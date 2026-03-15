const ExcelUpload = require('../models/ExcelUpload.model');
const EmailLog = require('../models/EmailLog.model');
const Template = require('../models/Template.model');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const emailUtil = require('../utils/email.util');

// @desc    Upload Excel file
// @route   POST /api/emails/upload-excel
// @access  Private (Admin)
exports.uploadExcel = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an Excel file' });
        }

        // Parse Excel to get total records
        const workbook = xlsx.read(fs.readFileSync(req.file.path));
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const excelUpload = await ExcelUpload.create({
            fileName: req.file.originalname,
            filePath: req.file.path,
            uploadedBy: req.user.id,
            admissionCycleId: req.body.admissionCycleId,
            offeringId: req.body.offeringId,
            totalRecords: data.length
        });

        res.status(201).json({
            success: true,
            data: excelUpload
        });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        next(error);
    }
};

// @desc    Get all excel uploads
// @route   GET /api/emails/excel-files
// @access  Private (Admin)
exports.getExcelFiles = async (req, res, next) => {
    try {
        const files = await ExcelUpload.find()
            .populate('uploadedBy', 'name email')
            .populate('admissionCycleId', 'name')
            .populate('offeringId', 'department specialization')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: files.length,
            data: files
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete excel upload
// @route   DELETE /api/emails/excel-files/:id
// @access  Private (Admin)
exports.deleteExcelFile = async (req, res, next) => {
    try {
        const file = await ExcelUpload.findById(req.params.id);

        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        // Remove file from filesystem
        if (fs.existsSync(file.filePath)) {
            fs.unlinkSync(file.filePath);
        }

        await file.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send bulk emails
// @route   POST /api/emails/send-bulk
// @access  Private (Admin)
exports.sendBulkEmails = async (req, res, next) => {
    try {
        const { excelFileId, templateId } = req.body;

        const excelFile = await ExcelUpload.findById(excelFileId);
        const template = await Template.findById(templateId);

        if (!excelFile || !template) {
            return res.status(404).json({ success: false, message: 'File or Template not found' });
        }

        // Process Excel file
        const workbook = xlsx.read(fs.readFileSync(excelFile.filePath));
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        excelFile.status = 'Processing';
        await excelFile.save();

        let successful = 0;
        let failed = 0;

        // We can run this async but for response we want to wait, or we run in background
        // for simplicity, let's process it synchronously in small batches or fast
        for (const record of data) {
            let status = 'Pending';
            let errorMessage = '';

            try {
                let emailBody = template.emailBody;
                // Replace variables
                // standard columns: Name, Email_ID, Result, Remarks
                const variables = {
                    name: record.Name || record.Applicant_Name,
                    result: record.Result,
                    remarks: record.Remarks
                };

                if (emailBody) {
                    emailBody = emailBody.replace(/{{name}}/g, variables.name || '');
                    emailBody = emailBody.replace(/{{result}}/g, variables.result || '');
                    emailBody = emailBody.replace(/{{remarks}}/g, variables.remarks || '');
                }

                const emailCustomBody = emailBody || template.content || 'Please see attachment/details.';

                // Use custom email function inside loop or email util
                await emailUtil.sendEmail({
                    email: record.Email_ID || record.Email,
                    subject: template.subject || 'IIT Ropar Admissions',
                    message: emailCustomBody.replace(/<[^>]*>?/gm, ''), // strip html for text
                    html: emailCustomBody
                });

                status = 'Sent';
                successful++;
            } catch (err) {
                status = 'Failed';
                errorMessage = err.message;
                failed++;
            }

            await EmailLog.create({
                recipientEmail: record.Email_ID || record.Email,
                recipientName: record.Name,
                subject: template.subject,
                body: template.emailBody || template.content,
                templateUsed: template._id,
                status,
                errorMessage,
                sentBy: req.user.id,
                excelFileId: excelFile._id
            });
        }

        excelFile.status = 'Completed';
        excelFile.processedRecords = data.length;
        excelFile.successfulEmails = successful;
        excelFile.failedEmails = failed;
        await excelFile.save();

        res.status(200).json({
            success: true,
            message: 'Bulk email processing completed',
            data: excelFile
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Resend failed emails
// @route   POST /api/emails/resend/:fileId
// @access  Private (Admin)
exports.resendEmails = async (req, res, next) => {
    try {
        const failedLogs = await EmailLog.find({
            excelFileId: req.params.fileId,
            status: 'Failed'
        });

        if (failedLogs.length === 0) {
            return res.status(400).json({ success: false, message: 'No failed emails to resend' });
        }

        let successful = 0;

        // Simplistic resend logic
        for (const log of failedLogs) {
            try {
                await emailUtil.sendEmail({
                    email: log.recipientEmail,
                    subject: log.subject,
                    message: log.body?.replace(/<[^>]*>?/gm, ''),
                    html: log.body
                });

                log.status = 'Sent';
                log.errorMessage = '';
                await log.save();
                successful++;
            } catch (err) {
                log.errorMessage = err.message;
                await log.save();
            }
        }

        const excelFile = await ExcelUpload.findById(req.params.fileId);
        if (excelFile) {
            excelFile.successfulEmails += successful;
            excelFile.failedEmails -= successful;
            await excelFile.save();
        }

        res.status(200).json({
            success: true,
            message: `Resent ${successful} emails successfully`
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get email logs
// @route   GET /api/emails/logs
// @access  Private (Admin)
exports.getEmailLogs = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.excelFileId) {
            filter.excelFileId = req.query.excelFileId;
        }

        const logs = await EmailLog.find(filter)
            .populate('templateUsed', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Send custom emails (to dynamic recipients)
// @route   POST /api/emails/send-custom
// @access  Private (Admin)
exports.sendCustomEmails = async (req, res, next) => {
    try {
        const { recipients, subject, html } = req.body;

        if (!recipients || !recipients.length || !subject || !html) {
            return res.status(400).json({ success: false, message: 'Please provide recipients, subject, and email body.' });
        }

        let successful = 0;
        let failed = 0;
        const errors = [];

        for (const recipient of recipients) {
            let status = 'Pending';
            let errorMessage = '';

            try {
                // Personalize body and subject with all available recipient fields
                const year = new Date().getFullYear();
                const name = recipient.name || 'Applicant';
                const interviewDate = recipient.interviewDate || 'To be notified separately';
                const appId = recipient.applicationId || '';
                const area = recipient.researchArea || '';
                const dept = recipient.department || '';

                const substitute = (text) => {
                    if (!text) return '';
                    return text
                        .replace(/{{name}}/gi, name)
                        .replace(/{{interviewDate}}/gi, interviewDate)
                        .replace(/{{applicationId}}/gi, appId)
                        .replace(/{{researchArea}}/gi, area)
                        .replace(/{{department}}/gi, dept)
                        .replace(/{{year}}/gi, year);
                };

                let personalizedHtml = substitute(html);
                let personalizedSubject = substitute(subject);
                let plainText = personalizedHtml.replace(/<[^>]*>?/gm, '');

                await emailUtil.sendEmail({
                    email: recipient.email,
                    subject: personalizedSubject,
                    message: plainText,
                    html: personalizedHtml
                });

                status = 'Sent';
                successful++;
            } catch (err) {
                status = 'Failed';
                errorMessage = err.message;
                errors.push({ email: recipient.email, error: errorMessage });
                failed++;
            }

            // Create log entry for auditing
            await EmailLog.create({
                recipientEmail: recipient.email,
                recipientName: recipient.name,
                subject: subject,
                body: html,
                status: status,
                errorMessage: errorMessage,
                sentBy: req.user.id
            });
        }

        res.status(200).json({
            success: true,
            message: `Processed ${recipients.length} emails. ${successful} sent, ${failed} failed.`,
            data: { successful, failed, errors }
        });
    } catch (error) {
        next(error);
    }
};

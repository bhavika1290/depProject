const Template = require('../models/Template.model');

// @desc    Get all templates
// @route   GET /api/templates
// @access  Private (Admin, Faculty)
exports.getAllTemplates = async (req, res, next) => {
    try {
        // Define default templates
        const defaultTemplates = [
            {
                name: 'Shortlisted Interview Notification',
                subject: 'Interview Scheduled — IIT Ropar PhD Admissions {{year}}',
                emailBody: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
  <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 36px 40px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">IIT Ropar — PhD Admissions</h1>
    <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">Department of Mathematics</p>
  </div>
  <div style="padding: 36px 40px;">
    <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px;">Dear <strong>{{name}}</strong>,</p>
    <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 20px;">
      We are pleased to inform you that you have been <strong style="color: #16a34a;">shortlisted</strong> for the PhD program at IIT Ropar.
      After a thorough review of your application, the selection committee would like to invite you for an interview.
    </p>
    <div style="background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px; padding: 20px 24px; margin: 24px 0;">
      <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px;">Interview Details</p>
      <p style="margin: 0; font-size: 18px; font-weight: 700; color: #1e3a5f;">📅 {{interviewDate}}</p>
    </div>
    <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 20px;">
      Please ensure you are available at the scheduled time. The interview will be conducted online/in-person (details to follow).
      Kindly carry all original documents during the interview.
    </p>
    <p style="font-size: 15px; color: #1e293b; margin: 0;">Best regards,<br><strong>Admissions Committee</strong><br>IIT Ropar</p>
  </div>
</div>`,
                variables: [
                    { name: 'name', description: "Recipient's full name" },
                    { name: 'interviewDate', description: 'Scheduled interview date and time' },
                    { name: 'year', description: 'Current admission year' }
                ]
            },
            {
                name: 'Selection Notification',
                subject: 'Admission Offer: PhD Program at IIT Ropar {{year}}',
                emailBody: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
  <div style="background: linear-gradient(135deg, #065f46 0%, #10b981 100%); padding: 36px 40px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">Congratulations! Offer of Admission</h1>
    <p style="color: #d1fae5; margin: 8px 0 0; font-size: 14px;">IIT Ropar — PhD Admissions</p>
  </div>
  <div style="padding: 36px 40px;">
    <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px;">Dear <strong>{{name}}</strong>,</p>
    <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 20px;">
      We are delighted to inform you that you have been <strong style="color: #059669;">selected</strong> for admission to the PhD program in the Department of Mathematics at IIT Ropar for the academic session {{year}}.
    </p>
    <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 20px;">
      Your selection is based on your excellent performance in the interview and your academic record. Formal offer letters with fellowship details and joining instructions will be sent to you shortly.
    </p>
    <p style="font-size: 15px; color: #1e293b; margin: 0;">Warmest congratulations,<br><strong>Admissions Office</strong><br>IIT Ropar</p>
  </div>
</div>`,
                variables: [
                    { name: 'name', description: "Recipient's full name" },
                    { name: 'year', description: 'Current admission year' }
                ]
            },
            {
                name: 'Waitlist Notification',
                subject: 'Update on Your PhD Application — IIT Ropar {{year}}',
                emailBody: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
  <div style="background: linear-gradient(135deg, #92400e 0%, #f59e0b 100%); padding: 36px 40px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">Waitlist Notification</h1>
    <p style="color: #fef3c7; margin: 8px 0 0; font-size: 14px;">IIT Ropar — PhD Admissions</p>
  </div>
  <div style="padding: 36px 40px;">
    <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px;">Dear <strong>{{name}}</strong>,</p>
    <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 20px;">
      Thank you for your interest in the PhD program at IIT Ropar. We would like to inform you that you have been placed on the <strong style="color: #d97706;">waitlist</strong> for admission.
    </p>
    <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 20px;">
      Candidates from the waitlist will be considered for admission if vacancies arise in the order of merit. We will keep you updated on the status of your application.
    </p>
    <p style="font-size: 15px; color: #1e293b; margin: 0;">Best regards,<br><strong>Admissions Committee</strong><br>IIT Ropar</p>
  </div>
</div>`,
                variables: [
                    { name: 'name', description: "Recipient's full name" },
                    { name: 'year', description: 'Current admission year' }
                ]
            },
            {
                name: 'Rejection Notification',
                subject: 'PhD Admission Decision — IIT Ropar {{year}}',
                emailBody: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
  <div style="background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%); padding: 36px 40px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">Admission Decision</h1>
    <p style="color: #e5e7eb; margin: 8px 0 0; font-size: 14px;">IIT Ropar — PhD Admissions</p>
  </div>
  <div style="padding: 36px 40px;">
    <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px;">Dear <strong>{{name}}</strong>,</p>
    <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 20px;">
      Thank you for applying to the PhD program at IIT Ropar. The selection process was highly competitive this year, with many qualified applicants.
    </p>
    <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 20px;">
      We regret to inform you that we are unable to offer you admission to the program at this time. This decision does not reflect negatively on your potential, and we appreciate the effort you put into your application.
    </p>
    <p style="font-size: 15px; color: #334155; line-height: 1.7; margin: 0 0 20px;">
      We wish you the very best in your future academic endeavors.
    </p>
    <p style="font-size: 15px; color: #1e293b; margin: 0;">Best regards,<br><strong>Admissions Committee</strong><br>IIT Ropar</p>
  </div>
</div>`,
                variables: [
                    { name: 'name', description: "Recipient's full name" },
                    { name: 'year', description: 'Current admission year' }
                ]
            }
        ];

        for (const t of defaultTemplates) {
            try {
                const existingTemplate = await Template.findOne({ name: t.name });
                if (!existingTemplate) {
                    await Template.create({
                        ...t,
                        scope: 'DEFAULT',
                        type: 'EMAIL',
                        isActive: true
                    });
                }
            } catch (err) {
                // If parallel requests hit the seeder, one might fail with 11000 — we can safely ignore it
                if (err.code !== 11000) console.error(`Failed to seed template "${t.name}":`, err);
            }
        }

        const templates = await Template.find().populate('createdBy', 'name email').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: templates.length,
            data: templates
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Private (Admin, Faculty)
exports.getTemplateById = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id).populate('createdBy', 'name email');

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        res.status(200).json({
            success: true,
            data: template
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new template
// @route   POST /api/templates
// @access  Private (Admin)
exports.createTemplate = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        const template = await Template.create(req.body);

        res.status(201).json({
            success: true,
            data: template
        });
    } catch (error) {
        // Mongoose duplicate key
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Template name already exists' });
        }
        next(error);
    }
};

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private (Admin)
exports.updateTemplate = async (req, res, next) => {
    try {
        let template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        if (template.scope === 'DEFAULT' && req.body.name && req.body.name !== template.name) {
            return res.status(400).json({ success: false, message: 'Cannot rename DEFAULT templates' });
        }

        template = await Template.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: template
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private (Admin)
exports.deleteTemplate = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        if (template.scope === 'DEFAULT') {
            return res.status(400).json({ success: false, message: 'Cannot delete DEFAULT templates' });
        }

        await template.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

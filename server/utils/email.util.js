const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send email
exports.sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || `IIT Ropar Admissions <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

// Send bulk emails
exports.sendBulkEmails = async (recipients, subject, templateFunction) => {
  const results = {
    successful: 0,
    failed: 0,
    errors: []
  };

  for (const recipient of recipients) {
    try {
      const emailBody = templateFunction(recipient);
      
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || `IIT Ropar Admissions <${process.env.EMAIL_USER}>`,
        to: recipient.email,
        subject: subject,
        html: emailBody
      });

      results.successful++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        email: recipient.email,
        error: error.message
      });
    }
  }

  return results;
};

// Email templates
exports.getApplicationSubmissionEmail = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #003366; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .button { background-color: #003366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>IIT Ropar</h1>
          <h2>PhD Admissions Portal</h2>
        </div>
        <div class="content">
          <h3>Dear ${data.name},</h3>
          <p>Thank you for submitting your application for the PhD program at IIT Ropar.</p>
          <p><strong>Application Details:</strong></p>
          <ul>
            <li>Application ID: ${data.applicationId}</li>
            <li>Department: ${data.department}</li>
            <li>Specialization: ${data.specialization}</li>
            <li>Application Type: ${data.applicationType}</li>
          </ul>
          <p>Your application is currently under review. You will be notified about the next steps via email.</p>
          <p>You can track your application status by logging into the portal.</p>
          <a href="${process.env.CLIENT_URL}/student/applications" class="button">View Application</a>
        </div>
        <div class="footer">
          <p>Indian Institute of Technology Ropar</p>
          <p>Rupnagar, Punjab - 140001, India</p>
          <p>Email: coapcell@iitrpr.ac.in | Phone: +91-1881-231114</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

exports.getAcceptanceEmail = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .success-box { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Congratulations!</h1>
        </div>
        <div class="content">
          <h3>Dear ${data.name},</h3>
          <div class="success-box">
            <p><strong>We are pleased to inform you that you have been selected for the PhD program at IIT Ropar!</strong></p>
          </div>
          <p><strong>Application Details:</strong></p>
          <ul>
            <li>Application ID: ${data.applicationId}</li>
            <li>Department: ${data.department}</li>
            <li>Specialization: ${data.specialization}</li>
          </ul>
          <p>Further instructions regarding the admission process will be sent to you shortly.</p>
          <p>We look forward to welcoming you to IIT Ropar.</p>
        </div>
        <div class="footer">
          <p>Indian Institute of Technology Ropar</p>
          <p>Rupnagar, Punjab - 140001, India</p>
          <p>Email: coapcell@iitrpr.ac.in | Phone: +91-1881-231114</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

exports.getRejectionEmail = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #003366; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>IIT Ropar</h1>
          <h2>PhD Admissions Portal</h2>
        </div>
        <div class="content">
          <h3>Dear ${data.name},</h3>
          <p>I hope this email finds you well. I am writing to inform you that the selection committee has carefully reviewed your application for the PhD program at IIT Ropar, and unfortunately, your <strong>${data.applicationType}</strong> application with <strong>ID: ${data.applicationId}</strong> for the offering: <strong>${data.offeringId}</strong> of specialization in <strong>${data.specialization}</strong> in the Department of <strong>${data.department}</strong> has been rejected. We are unable to invite you for further interviews.</p>
          
          <p>Please know that this was a highly competitive process and we received many outstanding applications. The selection committee had to make difficult decisions, and unfortunately, we could not accommodate all applicants. We want to thank you for your interest in our program and for taking the time to submit your application. We appreciate the effort you put into your application and want to assure you that this decision was not a reflection of your abilities.</p>
          
          ${data.remarks ? `<p><strong>Remarks:</strong> ${data.remarks}</p>` : ''}
          
          <p>We wish you all the best in your future endeavors and hope that you will continue to pursue your academic goals with the same dedication and passion that you have shown in your application.</p>
          
          <p>--<br>
          Academic Affairs<br>
          Indian Institute of Technology Ropar</p>
        </div>
        <div class="footer">
          <p>Indian Institute of Technology Ropar</p>
          <p>Rupnagar, Punjab - 140001, India</p>
          <p>Email: coapcell@iitrpr.ac.in | Phone: +91-1881-231114</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

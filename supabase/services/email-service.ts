import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // true for port 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html: html || text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendTemplatedEmail(
    to: string,
    subject: string,
    template: string,
    data: Record<string, any>
  ): Promise<boolean> {
    try {
      // Simple template processing - replace {{variable}} with actual values
      let processedTemplate = template;
      Object.entries(data).forEach(([key, value]) => {
        processedTemplate = processedTemplate.replace(
          new RegExp(`{{${key}}}`, 'g'),
          String(value)
        );
      });

      return await this.sendEmail(to, subject, processedTemplate, processedTemplate);
    } catch (error) {
      console.error('Error sending templated email:', error);
      return false;
    }
  }
}

import { NextResponse } from 'next/server';
import { EmailService } from '../../../supabase/services/email-service';
import { supabase } from '../../../../supabase';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { userId, templateName, subject, data } = await request.json();
    
    if (!userId || !templateName || !subject || !data) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Get user email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();
      
    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check notification preferences if needed
    // This is optional and can be implemented based on your requirements
    
    // Load email template
    const templatePath = path.join(process.cwd(), 'src/email-templates', `${templateName}.html`);
    let template: string;
    
    try {
      template = fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
      console.error('Error loading email template:', error);
      return NextResponse.json(
        { error: 'Email template not found' },
        { status: 404 }
      );
    }
    
    // Send email
    const emailService = new EmailService();
    const success = await emailService.sendTemplatedEmail(
      user.email,
      subject,
      template,
      {
        ...data,
        subject,
        supportEmail: 'support@aismsautomation.com'
      }
    );
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
    
    // Log the notification
    const { error: logError } = await supabase
      .from('notification_logs')
      .insert([
        {
          user_id: userId,
          type: 'email',
          subject: subject,
          content: JSON.stringify(data),
          status: 'sent'
        }
      ]);
      
    if (logError) {
      console.error('Error logging notification:', logError);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
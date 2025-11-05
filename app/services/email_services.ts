// app/services/email_service.ts
import nodemailer from 'nodemailer'

export default class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    console.log('🔍 ENV DEBUG:')
    console.log('SMTP_HOST:', process.env.SMTP_HOST)
    console.log('SMTP_PORT:', process.env.SMTP_PORT)
    console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME)
    console.log('SMTP_PASSWORD exists:', !!process.env.SMTP_PASSWORD)
    console.log('MAIL_FROM:', process.env.MAIL_FROM)

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: Number.parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    } as nodemailer.TransportOptions)
  }

  /**
   * Send OTP email
   */
  async sendOtpEmail(
    to: string,
    otp: string,
    purpose: 'email_verification' | 'password_reset' = 'email_verification'
  ): Promise<boolean> {
    const subject =
      purpose === 'email_verification'
        ? 'Verify Your Email Address - CyberFort'
        : 'Your Verification Code - CyberFort'

    const html = this.getOtpEmailTemplate(otp, purpose)

    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.APP_NAME || 'CyberFort'}" <${process.env.MAIL_FROM || 'noreply@cyberfort.com'}>`,
        to,
        subject,
        html,
        text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
      })

      console.log('✅ Email sent successfully:', info.messageId)
      return true
    } catch (error: any) {
      console.error('❌ Email sending failed:', error.message)

      // Development fallback - log OTP to console
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Development OTP for:', to)
        console.log('🔢 OTP Code:', otp)
        console.log('🎯 Purpose:', purpose)
      }

      throw new Error(`Failed to send email: ${error.message}`)
    }
  }

  /**
   * Beautiful HTML email template optimized for Indian email clients
   */
  private getOtpEmailTemplate(otp: string, purpose: string): string {
    const action =
      purpose === 'email_verification'
        ? 'verify your email address and activate your CyberFort account'
        : 'reset your password'

    const appName = process.env.APP_NAME || 'CyberFort'

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #f5f5f5; 
            color: #333; 
            line-height: 1.6; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px; 
            text-align: center; 
            color: white; 
        }
        .header h1 { 
            font-size: 28px; 
            margin-bottom: 10px; 
            font-weight: 600; 
        }
        .content { 
            padding: 40px 30px; 
        }
        .otp-container { 
            text-align: center; 
            margin: 30px 0; 
        }
        .otp-code { 
            font-size: 42px; 
            font-weight: bold; 
            color: #2563eb; 
            letter-spacing: 8px; 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 12px; 
            border: 2px dashed #e2e8f0;
            display: inline-block;
            margin: 15px 0;
        }
        .note { 
            background: #fff7ed; 
            padding: 15px; 
            border-radius: 8px; 
            border-left: 4px solid #f59e0b; 
            margin: 25px 0; 
        }
        .footer { 
            background: #f8fafc; 
            padding: 25px 30px; 
            text-align: center; 
            color: #64748b; 
            font-size: 14px; 
            border-top: 1px solid #e2e8f0; 
        }
        .button { 
            display: inline-block; 
            background: #2563eb; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 10px 0; 
        }
        .info-text { 
            color: #475569; 
            margin-bottom: 20px; 
        }
        @media only screen and (max-width: 600px) {
            .content { padding: 30px 20px; }
            .otp-code { font-size: 32px; letter-spacing: 6px; padding: 15px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${appName}</h1>
            <p>Secure Your Digital World</p>
        </div>
        
        <div class="content">
            <h2>Email Verification</h2>
            <p class="info-text">Hello,</p>
            <p class="info-text">Use the verification code below to ${action}:</p>
            
            <div class="otp-container">
                <div class="otp-code">${otp}</div>
            </div>
            
            <div class="note">
                <strong>⚠️ Important:</strong> This verification code will expire in <strong>10 minutes</strong>. 
                Please do not share this code with anyone.
            </div>
            
            <p class="info-text">
                If you didn't request this code, please ignore this email. Your account security is important to us.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>${appName} Team</strong></p>
            <p>Enhancing your digital security, one step at a time</p>
            <p>📍 Made with ❤️ in India</p>
            <p style="margin-top: 15px; font-size: 12px; color: #94a3b8;">
                This is an automated message. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
    `
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      console.log('✅ SMTP connection verified successfully')
      return true
    } catch (error: any) {
      console.error('❌ SMTP connection failed:', error.message)
      return false
    }
  }

  /**
   * Get transporter info for debugging (fixed typing)
   */
  getTransporterInfo() {
    const options = this.transporter.options as any
    return {
      host: options.host,
      port: options.port,
      secure: options.secure,
      authUser: options.auth?.user,
    }
  }
}

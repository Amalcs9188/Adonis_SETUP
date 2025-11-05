// app/services/otp_service.ts
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import Otp from '#models/otp'
import EmailService from './email_services.js'

export default class OtpService {
  private static OTP_EXPIRY_MINUTES = 10
  private emailService: EmailService

  constructor() {
    this.emailService = new EmailService()
  }

  /**
   * Generate and send OTP
   */
  async generateAndSendOtp(
    email: string,
    purpose: 'email_verification' | 'password_reset' = 'email_verification'
  ) {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    console.log(`🔄 Generating OTP for ${email}, purpose: ${purpose}`)
    console.log(`🔢 OTP Generated: ${otp}`)

    // Debug: Check hash before storing
    const hashedOtp = await hash.make(otp)
    console.log(`🔐 Hash generated: ${hashedOtp.substring(0, 20)}...`)

    // Store OTP in database
    const otpRecord = await Otp.create({
      email: email.toLowerCase().trim(),
      otp: hashedOtp,
      purpose,
      expiresAt: DateTime.now().plus({ minutes: OtpService.OTP_EXPIRY_MINUTES }),
      isUsed: false,
    })

    console.log(`💾 OTP stored in database with ID: ${otpRecord.id}`)

    try {
      await this.emailService.sendOtpEmail(email, otp, purpose)
      console.log(`✅ OTP generated and sent to ${email}`)

      return {
        success: true,
        otpRecord,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
      }
    } catch (emailError) {
      await otpRecord.delete()
      throw emailError
    }
  }

  /**
   * Verify OTP - FIXED VERSION (gets latest OTP)
   */
  async verifyOtp(email: string, otp: string, purpose: string): Promise<boolean> {
    console.log(`🔍 Verifying OTP for ${email}, OTP: ${otp}, Purpose: ${purpose}`)

    const now = DateTime.now()

    // Get the LATEST OTP record (order by created_at DESC)
    const otpRecord = await Otp.query()
      .where('email', email.toLowerCase().trim())
      .where('purpose', purpose)
      .where('is_used', false)
      .where('expires_at', '>', now.toISO())
      .orderBy('created_at', 'desc') // Get the most recent OTP
      .first()

    if (!otpRecord) {
      console.log('❌ OTP record not found or expired')
      throw new Error('OTP not found, expired, or already used')
    }

    console.log(`📊 OTP Record Found:`, {
      id: otpRecord.id,
      email: otpRecord.email,
      expiresAt: otpRecord.expiresAt,
      isUsed: otpRecord.isUsed,
      createdAt: otpRecord.createdAt,
      storedHash: otpRecord.otp.substring(0, 20) + '...',
    })

    console.log(`🔐 Verifying OTP: "${otp}" against stored hash`)

    // Verify OTP
    const isValid = await hash.verify(otpRecord.otp, otp)
    console.log(`🔐 Hash verification result: ${isValid}`)

    if (!isValid) {
      console.log('❌ OTP hash verification failed')
      throw new Error('Invalid OTP code')
    }

    // Mark OTP as used
    otpRecord.isUsed = true
    await otpRecord.save()

    console.log(`✅ OTP verified successfully for ${email}`)
    return true
  }

  /**
   * Check if active OTP exists for email
   */
  async hasActiveOtp(email: string, purpose: string): Promise<boolean> {
    const now = DateTime.now()
    const otpRecord = await Otp.query()
      .where('email', email.toLowerCase().trim())
      .where('purpose', purpose)
      .where('is_used', false)
      .where('expires_at', '>', now.toISO())
      .orderBy('created_at', 'desc')
      .first()

    return !!otpRecord
  }

  /**
   * Debug method to check stored OTPs
   */
  async debugOtps(email: string) {
    const otps = await Otp.query().where('email', email).orderBy('created_at', 'desc')

    console.log('🔍 DEBUG - All OTPs for:', email)
    otps.forEach((otp, index) => {
      console.log(`OTP ${index + 1}:`, {
        id: otp.id,
        purpose: otp.purpose,
        isUsed: otp.isUsed,
        expiresAt: otp.expiresAt,
        createdAt: otp.createdAt,
        isExpired: DateTime.now() > otp.expiresAt,
        isActive: !otp.isUsed && DateTime.now() < otp.expiresAt,
      })
    })

    return otps
  }

  /**
   * Clean up expired OTPs
   */
  async cleanupExpiredOtps(): Promise<void> {
    const now = DateTime.now().toISO()
    await Otp.query().where('expires_at', '<', now).orWhere('is_used', true).delete()

    console.log(`🧹 Cleaned up expired OTPs`)
  }

  async getLatestOtp(email: string, purpose: string) {
    const otpRecord = await Otp.query()
      .where('email', email.toLowerCase().trim())
      .where('purpose', purpose)
      .orderBy('created_at', 'desc')
      .first()

    return otpRecord
  }
}

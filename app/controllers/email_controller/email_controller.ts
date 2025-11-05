import User from '#models/user'
import OtpService from '#services/otp_service'
import formatValidationError, { Resp } from '#utils/response_handler'
import { sendOtpValidator, verifyEmailValidator } from '#validators/user_validator'
import { HttpContext } from '@adonisjs/http-server'
import { errors } from '@vinejs/vine'

// ==============================================================================
// 📩 Email Verification Controller
// ==============================================================================
// 1. Send OTP
// 2. Verify OTP
// ==============================================================================

export default class EmailController {
  public async sendOtp({ request, response }: HttpContext) {
    try {
      const otpService = new OtpService()
      const { email } = await sendOtpValidator.validate(request.all())
      const result = await otpService.generateAndSendOtp(email, 'email_verification')
      return Resp.Api({ response, message: 'OTP sent successfully!', data: result })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(422).json(formatValidationError(error))
      }
      return Resp.InvalidRequest({
        response,
        validator: { errors: [{ field: 'email', message: error.message }] },
        message: error.message,
      })
    }
  }
  public async verifyOtp({ request, response }: HttpContext) {
    try {
      const otpService = new OtpService()
      const { email, otp } = await verifyEmailValidator.validate(request.all())
      const isEmail = await User.findBy('email', email)
      if (!isEmail) {
        return Resp.InvalidRequest({
          response,
          validator: { errors: [{ field: 'email', message: 'Invalid email' }] },
        })
      }
      const result = await otpService.verifyOtp(email, otp, 'email_verification')
      if (result) {
        await User.query().where('email', email).update({ is_email_verified: true })

        Resp.Api({ response, message: 'OTP verified successfully!' })
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(422).json(formatValidationError(error))
      }
      return Resp.InvalidRequest({
        response,
        validator: { errors: [{ field: 'otp', message: error.message }] },
      })
    }
  }
}

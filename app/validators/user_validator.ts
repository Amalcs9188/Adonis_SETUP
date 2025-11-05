import { vine } from '#config/validator_config'

export const signupValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255).minLength(3),
    email: vine.string().trim().email().normalizeEmail().maxLength(255),
    password: vine.string().minLength(6),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string(),
  })
)

export const verifyEmailValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    otp: vine.string().minLength(6).maxLength(6),
  })
)

export const sendOtpValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
  })
)

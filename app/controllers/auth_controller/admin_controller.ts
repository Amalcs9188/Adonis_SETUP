import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'
import formatValidationError, { Resp, RespCodes } from '#utils/response_handler'
import { signupValidator, loginValidator } from '#validators/user_validator'
import { errors } from '@vinejs/vine'
import Otp from '#models/otp'

// ==============================================================================
// 📩Admin Controller  Controller
// ==============================================================================
// 1. Sign up
// 2. Login
// ==============================================================================

export default class AdminController {
  public async signup({ auth, request, response }: HttpContext) {
    try {
      const admin = auth.user as User

      const isAdmin = admin.serialize().roleType
      console.log(isAdmin)
      if (isAdmin !== 1) {
        return Resp.InvalidRequest({
          response,
          validator: { errors: [{ field: 'role_type', message: 'You are not an admin' }] },
        })
      }
      const data = await signupValidator.validate(request.all())
      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        return Resp.InvalidRequest({
          response,
          validator: { errors: [{ field: 'email', message: 'Email already exists' }] },
        })
      }
      const user = await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role_type: 1,
      })

      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: '7 days',
      })

      return Resp.Api({
        response,
        message: 'Signup Success!',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role_type: user.role_type,
          },
        },
        misc: {
          auth: {
            token_type: 'bearer',
            access_token: token.value!.release(),
            expires_in: ' 7 days ',
          },
        },
      })
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(422).json(formatValidationError(error))
      }
      return Resp.BadApi({
        response,
        message: 'Oops! Something went wrong.',
        errors: error.messages,
        code: RespCodes.VALIDATION_ERROR,
      })
    }
  }

  public async login({ request, response }: HttpContext) {
    const data = await loginValidator.validate(request.all())

    const user = await User.query().where('email', data.email).where('role_type', 1).first()
    const otps = await Otp.query().where('purpose', 'email_verification').where('id', 26).first()
    const otp = otps?.serialize()
    console.log(otp)
    if (!user) {
      return Resp.InvalidRequest({
        response,
        validator: { errors: [{ field: 'email' }, { message: 'Invalid email or password' }] },
      })
    }

    const isValid = await hash.verify(user.password, data.password)
    if (!isValid) {
      return Resp.InvalidRequest({
        response,
        validator: { errors: [{ field: 'email' }, { message: 'Invalid email or password' }] },
      })
    }

    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '7 days',
    })

    return Resp.Api({
      response,
      message: 'Login Success!',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role_type: user.role_type,
        },
      },
      misc: {
        auth: {
          token_type: 'bearer',
          access_token: token.value!.release(),
          expires_in: ' 7 days ',
        },
      },
    })
  }
  public async getallusers({ auth, response }: HttpContext) {
    const user = auth.user as User

    const id = user.serialize().id
    console.log(id)

    await auth.authenticate()
    const users = await User.all()
    return Resp.Api({ response, data: users })
  }
}

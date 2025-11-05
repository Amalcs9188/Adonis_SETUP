import User from '#models/user'
import { Resp } from '#utils/response_handler'
import { HttpContext } from '@adonisjs/core/http'

export default class GetUserController {
  public async getUserByRole({ request, response }: HttpContext) {
    try {
      const { roleType } = request.qs()
      if (!roleType) {
        return Resp.InvalidRequest({
          response,
          validator: { errors: [{ field: 'role_type', message: 'Role type is required' }] },
        })
      }
      const user = await User.query().where('role_type', roleType)
      if (user.length < 1 || !user) {
        return Resp.InvalidRequest({
          response,
          validator: { errors: [{ field: 'id', message: 'User not found' }] },
        })
      }
      return Resp.Api({ response, data: user })
    } catch (error) {
      return Resp.InvalidRequest({
        response,
        validator: { errors: [{ field: 'id', message: 'User not found' }] },
      })
    }
  }
}

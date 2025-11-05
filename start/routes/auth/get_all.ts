const GetUserController = () => import('#controllers/auth_controller/get_user_controller')
// import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/getAllUsersByRole', [GetUserController, 'getUserByRole'])
  })
  .prefix('/api/doc/users')
// .use(middleware.auth())

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const UserController = () => import('#controllers/auth_controller/user_controller')

// =======================================================
// 👤 user_Auth Routes
// =======================================================
// Open EndPoint
router
  .group(() => {
    router.post('/signup', [UserController, 'signup'])
    router.post('/login', [UserController, 'login'])
  })
  .prefix('/api/doc//user')

// =======================================================
// 👥 User Management Routes
// =======================================================
// Secured EndPoint
router
  .group(() => {
    router.get('/getAll', [UserController, 'getallusers'])
  })
  .prefix('/api/doc/users')
  .use(middleware.auth())

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AdminController = () => import('#controllers/auth_controller/admin_controller')

// =======================================================
// 👤 Auth Routes
// =======================================================
// Secured EndPoint
router
  .group(() => {
    router.post('/signup', [AdminController, 'signup'])
  })
  .prefix('/admin')
  .use(middleware.auth())
// Open EndPoint
router.post('/login', [AdminController, 'login']).prefix('/api/doc/admin')

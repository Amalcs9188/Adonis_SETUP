import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const WorkerController = () => import('#controllers/auth_controller/worker_controller')

// =======================================================
// 🧑‍🏭 worker_Auth Routes
// =======================================================
// Secured EndPoint
router
  .group(() => {
    router.post('/signup', [WorkerController, 'signup'])
  })
  .prefix('/worker')
  .use(middleware.auth())
// Open EndPoint
router.post('/login', [WorkerController, 'login']).prefix('/api/doc/worker')

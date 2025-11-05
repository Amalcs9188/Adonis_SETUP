import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ContractorController = () => import('#controllers/auth_controller/contractor_controller')

// =======================================================
// 👤 Contractor_Auth Routes
// =======================================================
// Secured EndPoint
router
  .group(() => {
    router.post('/signup', [ContractorController, 'signup'])
  })
  .prefix('/contractor')
  .use(middleware.auth())
router.post('/login', [ContractorController, 'login']).prefix('/api/doc/contractor')

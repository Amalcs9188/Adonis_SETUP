import router from '@adonisjs/core/services/router'

const EmailController = () => import('#controllers/email_controller/email_controller')

// =======================================================
// 📩 Email Verification Routes
// =======================================================

router
  .group(() => {
    router.post('/send', [EmailController, 'sendOtp'])
    router.post('/verify', [EmailController, 'verifyOtp'])
  })
  .prefix('/email')

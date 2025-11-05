/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import '#start/routes/auth/user_auth'
import '#start/routes/auth/admin_auth'
import '#start/routes/auth/contractor_auth'
import '#start/routes/auth/worker_auth'
import '#start/routes/email/otp_verification'
import '#start/routes/auth/get_all'

import router from '@adonisjs/core/services/router'
// import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'Welcome to CyberFort',
  }
})

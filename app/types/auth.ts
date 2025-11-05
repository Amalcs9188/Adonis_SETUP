import type { Authenticators } from '@adonisjs/auth/types'

declare module '@adonisjs/core/types' {
    interface GuardsList extends Authenticators { }
}

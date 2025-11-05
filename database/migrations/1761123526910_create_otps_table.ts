// database/migrations/xxxx_otps.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class OtpsSchema extends BaseSchema {
  protected tableName = 'otps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email').notNullable().index()
      table.string('otp').notNullable()
      table.string('purpose').notNullable()
      table.boolean('is_used').defaultTo(false)
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      // Index for faster queries
      table.index(['email', 'purpose', 'is_used'])
      table.index(['expires_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

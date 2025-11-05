import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare role_type: number

  @column()
  declare email: string

  @column()
  declare password: string
  @column()
  declare first_login: number

  @column()
  declare otp_code: string

  @column()
  declare otp_expires_at: string

  @column()
  declare last_login: string

  @column()
  declare record_status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

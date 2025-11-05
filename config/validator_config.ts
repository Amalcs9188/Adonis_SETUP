import vine, { SimpleMessagesProvider } from '@vinejs/vine'

// Custom messages for entire application
export const customMessages = {
  'required': 'The {{ field }} field is required',
  'string': 'The {{ field }} field must be a string',
  'email': 'Please provide a valid email address',
  'minLength': '{{ field }} must be at least {{ options.minLength }} characters long',
  'maxLength': '{{ field }} cannot exceed {{ options.maxLength }} characters',
  'name.minLength': 'Name must be at least 3 characters long',
  'name.maxLength': 'Name cannot be longer than 255 characters',
  'password.minLength': 'Password must be at least 6 characters long',
  'password.maxLength': 'Password cannot be longer than 255 characters',
  'number': 'The {{ field }} field must be a number',
  'boolean': 'The {{ field }} field must be true or false',
  'date': 'The {{ field }} field must be a valid date',
  'otp.minLength': 'OTP must be 6 digits long',
  'otp.maxLength': 'OTP must be 6 digits long',
}

vine.messagesProvider = new SimpleMessagesProvider(customMessages)

export { vine }

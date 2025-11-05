import type { Response } from '@adonisjs/core/http'

export const RespCodes = {
  OK: 100,
  CREATED: 101,
  ACCEPTED: 102,
  UPDATED: 103,
  GENERAL_CLIENT_ERROR: 200,
  VALIDATION_ERROR: 201,
  MISSING_REQUIRED_FIELD: 202,
  INVALID_FORMAT: 203,
  INVALID_INPUT_DATA: 204,
  RESOURCE_ALREADY_EXISTS: 205,
  AUTHENTICATION_ERROR: 210,
  AUTHORIZATION_ERROR: 211,
  PERMISSION_DENIED: 212,
  RATE_LIMIT_EXCEEDED: 220,
  HEADER_ERROR: 230,
  UNSUPPORTED_MEDIA_TYPE: 240,
  GENERAL_SERVER_ERROR: 300,
  DATABASE_ERROR: 301,
  EXTERNAL_SERVICE_ERROR: 302,
  TIMEOUT: 303,
  INTERNAL_SERVICE_ERROR: 304,
  RESOURCE_NOT_FOUND: 310,
  RESOURCE_GONE: 311,
  GENERAL_BUSINESS_LOGIC_ERROR: 400,
  INSUFFICIENT_FUNDS: 401,
  ORDER_CANNOT_BE_PROCESSED: 402,
  ACCOUNT_INACTIVE: 403,
  UNKNOWN_ERROR: 900,
  SYSTEM_MAINTENANCE: 901,
} as const

export const Messages = {
  MESSAGE_FETCHED: 'Records fetched successfully.',
  MESSAGE_FETCHED_SINGLE: 'Record fetched successfully.',
  MESSAGE_ADDED: 'Record added successfully.',
  MESSAGE_UPDATED: 'Record updated successfully.',
  MESSAGE_DELETED: 'Record deleted successfully.',
  MESSAGE_COMPLETED: 'Operation completed successfully.',
  MESSAGE_NO_RECORDS: 'No records found!',
  MESSAGE_NO_RECORDS_SINGLE: 'Record not found!',
  MESSAGE_DATA_MISSING: 'Required data is missing!',
  MESSAGE_INCOMPLETE_DATA: 'Incomplete data provided!',
  MESSAGE_INVALID_REQUEST: 'The request is invalid!',
} as const

interface ApiResponse<T = unknown> {
  status: boolean
  message: string
  code: number
  data?: T | null
  misc?: Record<string, unknown>
  errors?: unknown[]
}

function createResponse<T = unknown>(
  response: Response,
  options: {
    status: boolean
    message: string
    code: number
    data?: T | null
    misc?: Record<string, unknown>
    errors?: unknown[]
    rc: number
  }
) {
  const { status, message, code, data = null, misc = {}, errors = [], rc } = options
  const body: ApiResponse<T> = { status, message, code, data, misc, errors }
  return response.status(rc).json(body)
}

export const Resp = {
  Api: <T = unknown>({
    response,
    message = Messages.MESSAGE_COMPLETED,
    data = null,
    misc = {},
    code = RespCodes.OK,
    rc = 200,
  }: {
    response: Response
    message?: string
    data?: T | null
    misc?: Record<string, unknown>
    code?: number
    rc?: number
  }) => createResponse<T>(response, { status: true, message, code, data, misc, errors: [], rc }),

  BadApi: <T = unknown>({
    response,
    message = 'Oops! Something went wrong.',
    errors = [],
    data = null,
    misc = {},
    code = RespCodes.GENERAL_SERVER_ERROR,
    rc = 500,
  }: {
    response: Response
    message?: string
    errors?: unknown[]
    data?: T | null
    misc?: Record<string, unknown>
    code?: number
    rc?: number
  }) => createResponse<T>(response, { status: false, message, code, data, misc, errors, rc }),

  InvalidRequest: ({
    response,
    validator,
    message = 'Data validation failed!',
    rc = 422,
  }: {
    response: Response
    validator?: { errors?: unknown[] }
    message?: string
    rc?: number
  }) => {
    const errors = validator?.errors || []
    return Resp.BadApi({ response, message, errors, code: RespCodes.VALIDATION_ERROR, rc })
  },

  NoAuth: ({
    response,
    authType = 'User',
    rc = 401,
  }: {
    response: Response
    authType?: string
    rc?: number
  }) => {
    return Resp.BadApi({
      response,
      message: `${authType} Authentication Failed!`,
      code: RespCodes.AUTHENTICATION_ERROR,
      rc,
    })
  },
}
export default function formatValidationError(error: any) {
  return {
    status: false,
    message: 'Data validation failed!',
    code: 201,
    data: null,
    misc: {},
    errors: error.messages.map((err: any) => ({
      field: err.field,
      message: err.message,
    })),
  }
}

import axios, { AxiosError } from 'axios'

function isObject(o: any) {
  return o instanceof Object && o.constructor === Object
}

const findErrorMessage = (entity: any): string => {
  const errorMessage = 'Something went wrong'

  if (!entity) {
    return errorMessage
  } else if (isObject(entity)) {
    const firstKey = Object.keys?.(entity)?.[0]
    const firstElement = entity?.[firstKey]

    return findErrorMessage(firstElement)
  } else if (Array.isArray(entity)) {
    return findErrorMessage(entity?.[0])
  } else if (typeof entity === 'string') {
    return entity
  } else {
    return errorMessage
  }
}

export const errorMessageParser = (e: Error | AxiosError | unknown) => {
  let errorMessage = 'Something went wrong'

  //    if directly errorMessage is sent to us
  if (typeof e === 'string') {
    return e
  }

  if (!axios.isAxiosError(e)) {
    // native error

    const data = (e as unknown as any)?.message
    errorMessage = findErrorMessage(data)

    return errorMessage
  } else {
    //   axios error

    const data = e.response?.data as unknown as any

    if (data?.error) {
      errorMessage = findErrorMessage(data?.error)

      return errorMessage
    }

    if (data?.errors) {
      errorMessage = findErrorMessage(data?.errors)

      return errorMessage
    }

    if (data?.validationErrors) {
      errorMessage = findErrorMessage(data?.validationErrors)

      return errorMessage
    }

    if (data?.message) {
      errorMessage = data?.message

      return errorMessage
    }

    // no case matches
    return errorMessage
  }
}
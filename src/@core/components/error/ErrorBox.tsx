import React from 'react'
import { errorMessageParser } from '@utils/error'
import { FormHelperText } from '@mui/material'

function ErrorBox({ error }: { error: any }) {
  const errorMessage = errorMessageParser(error)

  return (
    <>
      <FormHelperText sx={{ color: 'error.main' }}>{errorMessage}</FormHelperText>
    </>
  )
}

export default ErrorBox

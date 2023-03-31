import { CircularProgress } from '@mui/material'
import React from 'react'

function ButtonSpinner() {
  return (
    <>
      <CircularProgress style={{ position: 'relative', left: '10px' }} color='inherit' size={16} />
    </>
  )
}

export default ButtonSpinner
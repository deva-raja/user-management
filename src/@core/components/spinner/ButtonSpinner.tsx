import { CircularProgress } from '@mui/material'
import React from 'react'

function ButtonSpinner({ left = '10px' }: { left?: string }) {
  return (
    <>
      <CircularProgress style={{ position: 'relative', left: left }} color='inherit' size={16} />
    </>
  )
}

export default ButtonSpinner
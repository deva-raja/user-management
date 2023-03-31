import { useTheme } from '@mui/material/styles'
import toast, { ToastOptions } from 'react-hot-toast'

const useCustomToast = () => {
  const theme = useTheme()

  const toastSuccess = (message: string, opts?: ToastOptions) => {
    return toast.success(message, {
      style: {
        padding: '16px',
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`
      },
      iconTheme: {
        primary: theme.palette.success.main,
        secondary: theme.palette.success.contrastText
      },
      ...(opts && { ...opts })
    })
  }

  const toastError = (message: string, opts?: ToastOptions) => {
    return toast.error(message, {
      style: {
        padding: '16px',
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`
      },
      iconTheme: {
        primary: theme.palette.error.main,
        secondary: theme.palette.error.contrastText
      },
      ...(opts && { ...opts })
    })
  }

  return {
    success: (message: string, opts?: ToastOptions) => toastSuccess(message, opts),
    error: (message: string, opts?: ToastOptions) => toastError(message, opts)
  }
}

export default useCustomToast

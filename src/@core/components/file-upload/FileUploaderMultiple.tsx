// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import useCustomToast from '@components/toast'

interface FileProp {
  name: string
  type: string
  size: number
}

// Styled component for the upload image inside the dropzone area
const FileUploaderMultiple = ({
  files,
  setFiles
}: {
  files: File[] | string[]
  setFiles: React.Dispatch<React.SetStateAction<File[] | string[]>>
}) => {
  // ** State

  // ** Hooks
  const toast = useCustomToast()
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 4000000, // 4mb
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error('file size should not exceed 4 MB.', {
        duration: 2000
      })
    }
  })

  const renderFilePreview = (file: FileProp | string) => {
    if (typeof file === 'string') {
      return <img width={38} height={38} alt={''} src={file} />
    } else if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='tabler:file-description' />
    }
  }

  const handleRemoveFile = (file: FileProp | string) => {
    const uploadedFiles = files as FileProp[]

    if (typeof file === 'string') {
      const filtered = uploadedFiles.filter((i: any) => i !== file)
      setFiles([...(filtered as any)])
    } else {
      const filtered = uploadedFiles.filter((i: FileProp) => i?.name !== (file as FileProp)?.name)
      setFiles([...(filtered as any)])
    }
  }

  const fileList = files.map((file: FileProp | string) => {
    if (typeof file === 'string') {
      return (
        <ListItem key={file}>
          <div className='file-details'>
            <div className='file-preview'>{renderFilePreview(file)}</div>
            <div>
              <Typography className='file-name'>{'uploaded attachment'}</Typography>
            </div>
          </div>
          <IconButton onClick={() => handleRemoveFile(file)}>
            <Icon icon='tabler:x' fontSize={20} />
          </IconButton>
        </ListItem>
      )
    } else {
      return (
        <ListItem key={file.name}>
          <div className='file-details'>
            <div className='file-preview'>{renderFilePreview(file)}</div>
            <div>
              <Typography className='file-name'>{file.name}</Typography>
              <Typography className='file-size' variant='body2'>
                {Math.round(file.size / 100) / 10 > 1000
                  ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                  : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
              </Typography>
            </div>
          </div>
          <IconButton onClick={() => handleRemoveFile(file)}>
            <Icon icon='tabler:x' fontSize={20} />
          </IconButton>
        </ListItem>
      )
    }
  })

  return (
    <Fragment>
      <div style={{ minHeight: '65px' }} {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Typography variant='body1' sx={{ mb: 2.5 }}>
            Drop files here or click to upload.
          </Typography>
        </Box>
      </div>
      {files.length ? (
        <Fragment>
          <List>{fileList}</List>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default FileUploaderMultiple

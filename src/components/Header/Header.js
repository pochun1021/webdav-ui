import React from 'react'
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import { lightBlue } from '@mui/material/colors'
import { useTheme } from '@mui/material/styles'

function Header({ onGoUp, onUndo, onRedo, undoDisabled, redoDisabled, goUpDisabled }) {
  const theme = useTheme()
  const bgcolor = lightBlue[100]

  return (
    <AppBar position="static" sx={{ backgroundColor: bgcolor }}>
      <Typography variant="h6" component="div" sx={{ 
        display: 'flex', 
        flexGrow: 1, 
        ml: 2, mb: -1, 
        p: 2, pb: 0, 
        color: theme.palette.getContrastText(bgcolor) 
      }}>
        檔案管理員
      </Typography>
      <Toolbar>
        <IconButton onClick={onUndo} aria-label="上一動作" disabled={undoDisabled}>
          <UndoIcon />
        </IconButton>
        <IconButton onClick={onRedo} aria-label="下一動作" disabled={redoDisabled}>
          <RedoIcon />
        </IconButton>
        <IconButton onClick={onGoUp} aria-label="回上一層" disabled={goUpDisabled}>
          <ArrowUpwardIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header

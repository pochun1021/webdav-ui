import React from 'react'
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import { yellow } from '@mui/material/colors'

function Main({ currentFolder, currentFile, onNodeSelect }) {
  if (currentFile) {
    return (
      <Box sx={{ flexGrow: 1, bgcolor: "grey.50", p: 3 }}>
        <Typography variant="h6">{currentFile.name}</Typography>
        <Box sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
          {currentFile.content || "（無內容）"}
        </Box>
      </Box>
    )
  }

  if (currentFolder) {
    return (
      <Box sx={{ flexGrow: 1, bgcolor: "grey.50", p: 3 }}>
        <Typography variant="h6">{currentFolder.name} 包含：</Typography>
        <List>
          {(currentFolder.children || []).map(item => (
            <ListItem key={item.id}
              component="button"
              onClick={() => { onNodeSelect && onNodeSelect(item) }}
              sx={{ backgroundColor: 'transparent', border: 'none', cursor: "pointer" }}
            >
              <ListItemIcon sx={{ mr: -2 }}>
                {item.type === "folder" ? (
                  <FolderIcon sx={{ color: yellow[600], marginRight: 1 }} />
                ) : (
                  <InsertDriveFileIcon color="primary" />
                )}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "grey.50", p: 3 }}>
      <Typography variant="h6">請點選左側資料夾或檔案</Typography>
    </Box>
  )
}

export default Main

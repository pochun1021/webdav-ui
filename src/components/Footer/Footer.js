import React from 'react'
import { Box, Typography } from '@mui/material'

function Footer({ pathArray, onPathClick }) {
  return (
    <Box component="footer" sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.200' }}>
      <Typography variant="body2" color="text.secondary">
        <span>目前路徑: </span>
        {pathArray && pathArray.length > 0 ? pathArray.map((name, idx) => (
          <Box component="span" key={idx}>
            <Box component="span" onClick={() => onPathClick(idx)} 
              sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
              {name}
            </Box>
            {idx < pathArray.length - 1 ? ' / ' : ''}
          </Box>
        )) : <span>-</span>}
      </Typography>
    </Box>
  )
}

export default Footer

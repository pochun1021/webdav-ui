import React from "react"
import { Tree } from "react-arborist"
import { Box, Typography } from "@mui/material"
import FolderIcon from "@mui/icons-material/Folder"
import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

// 決定要顯示的 icon
function getIcon(node) {
  const { type } = node.data
  const isOpen = node.isOpen
  const hasChildren = !!node.data.children
  if (type === "folder") {
    if (hasChildren) {
      return (
        <>
          {/* 展開收合箭頭：只箭頭才可以點擊展開/收合 */}
          <Box
            onClick={e => { e.stopPropagation(); node.toggle(); }}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            {isOpen ? (
              <ExpandMoreIcon fontSize="small" sx={{ mr: 0.5 }} />
            ) : (
              <ChevronRightIcon fontSize="small" sx={{ mr: 0.5 }} />
            )}
          </Box>
          {isOpen ? (
            <FolderOpenIcon color="primary" sx={{ mr: 1 }} />
          ) : (
            <FolderIcon color="primary" sx={{ mr: 1 }} />
          )}
        </>
      )
    } else {
      return (
        <>
          <Box sx={{ width: 20, mr: 0.5 }} />
          <FolderIcon color="primary" sx={{ mr: 1 }} />
        </>
      )
    }
  }
  if (type === "file") {
    return (
      <>
        <Box sx={{ width: 20, mr: 0.5 }} />
        <InsertDriveFileIcon color="action" sx={{ mr: 1 }} />
      </>
    )
  }
  return null
}

// 每個樹節點的渲染方式
function Node({ node, style, dragHandle, onNodeSelect }) {
  const handleClick = (e) => {
    e.stopPropagation()
    onNodeSelect && onNodeSelect(node.data)
  }

  return (
    <Box
      style={style}
      ref={dragHandle}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 0.5,
        pl: `${node.level * 16}px`,
        cursor: "pointer",
        userSelect: "none"
      }}
      onClick={handleClick}
    >
      {getIcon(node)}
      <span>{node.data.name}</span>
    </Box>
  )
}

function Sidebar({ data, onNodeSelect }) {
  const NodeRenderer = (props) => <Node {...props} onNodeSelect={onNodeSelect} />

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "grey.100",
        borderRight: "1px solid #ddd",
        boxSizing: "border-box",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        樹狀資料
      </Typography>
      <Tree
        data={data}
        height={600}
        width={220}
        rowHeight={36}
      >
        {NodeRenderer}
      </Tree>
    </Box>
  )
}

export default Sidebar

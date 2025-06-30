import React, { useState, useEffect, useMemo } from 'react'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import Main from './components/Main/Main'
import Footer from './components/Footer/Footer'
import Assistant from './components/Assistant/Assistant'
import { Box, CssBaseline } from '@mui/material'

function buildIdMap(tree, map = {}) {
  for (const node of tree) {
    map[node.id] = node
    if (node.children) buildIdMap(node.children, map)
  }
  return map
}

function App() {
  const [data, setData] = useState([]) // 預設空，等待 fetch
  const [currentFolder, setCurrentFolder] = useState(null)
  const [currentFile, setCurrentFile] = useState(null)
  const [history, setHistory] = useState([])         // [{type, id, ...}]
  const [historyIndex, setHistoryIndex] = useState(-1) // -1 代表沒瀏覽過

  // 用 useMemo 確保只有 data 變動時才重建 map
  const idMap = useMemo(() => buildIdMap(data), [data])
  const node = currentFolder || currentFile
  const { path: currentPathArray, nodes: currentNodePath } = getPathArray(node, idMap)
  const currentPathString = currentPathArray.join(' / ')

  // fetch tree on mount
  useEffect(() => {
    async function fetchTree() {
      // 假設 API 回傳的是 array/tree 結構
      const res = await fetch(process.env.PUBLIC_URL + "/tree.json")
      if (!res.ok) throw new Error('Network response was not ok')
      const tree = await res.json()
      setData(tree)
    }
    fetchTree()
  }, [])

  function setFolderAndFile(node) {
    if (!node) {
      setCurrentFolder(null)
      setCurrentFile(null)
      return
    }
    if (node.type === 'folder') {
      setCurrentFolder(node)
      setCurrentFile(null)
    } else {
      setCurrentFolder(null)
      setCurrentFile(node)
    }
  }

  function handleNavigate(node) {
    // node: 被點擊的 folder 或 file 物件
    // 若 index 不是在最後，要砍掉 redo 區間
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(node)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    // 再依 node.type 設定 currentFolder/currentFile
    setFolderAndFile(node)
  }

  function handleUndo() {
    if (historyIndex <= 0) return
    const prevIndex = historyIndex - 1
    setHistoryIndex(prevIndex)
    const prevNode = history[prevIndex]
    setFolderAndFile(prevNode)
  }

  function handleRedo() {
    if (historyIndex >= history.length - 1) return
    const nextIndex = historyIndex + 1
    setHistoryIndex(nextIndex)
    const nextNode = history[nextIndex]
    setFolderAndFile(nextNode)
  }

   // 回上一層（如果在資料夾中）
  function handleGoUp() {
    // 先判斷目前是 folder 還是 file
    const node = currentFolder || currentFile
    // 如果已經在根層就不動作
    if (!node || !node.parent) return
    // 找 parent node
    const parentNode = idMap[node.parent]
    if (parentNode) handleNavigate(parentNode)
  }

  function getPathArray(node, idMap) {
    if (!node) return { path: [], nodes: [] }
    const path = [], nodes = []
    let current = node
    while (current) {
      path.unshift(current.name)
      nodes.unshift(current)
      if (!current.parent) break
      current = idMap[current.parent]
    }
    return { path, nodes }
  }

  function handlePathClick(index) {
    if (!node) return

    const targetNode = currentNodePath[index]
    console.log(targetNode)
    if (targetNode) handleNavigate(targetNode)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar data={data} onNodeSelect={handleNavigate} />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Header onUndo={handleUndo} onRedo={handleRedo} onGoUp={handleGoUp}
          undoDisabled={historyIndex <= 0}
          redoDisabled={historyIndex >= history.length - 1}
          goUpDisabled={!node || !node.parent}
        />
        <Main currentFolder={currentFolder} currentFile={currentFile} onNodeSelect={handleNavigate} />
        <Footer pathArray={currentPathArray} onPathClick={handlePathClick} />
        <Assistant />
      </Box>
    </Box>
  )
}

export default App

import React, { useRef, useState, useEffect } from "react"
import { Box, Fab, Card, CardContent, Typography, Button, Stack, TextField, IconButton, List, ListItem, ListItemText, CircularProgress, ButtonGroup } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import SendIcon from "@mui/icons-material/Send"
import CloseIcon from "@mui/icons-material/Close"

const tips = [
  "歡迎使用本檔案管理器，有需要協助請隨時點擊小助手！",
  "你可以點擊資料夾瀏覽檔案，也可以直接搜尋檔名。",
  "哈囉！有什麼問題都可以問我喔 😊"
]

function Assistant() {
  const randomItem = tips[Math.floor(Math.random() * tips.length)];
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { from: "assistant", text: randomItem }
  ])
  const messagesEndRef = useRef(null)
  const [waiting, setWaiting] = useState(false)
  const [fontSize, setFontSize] = useState(16)

  // 每當 messages 變動時，自動捲到最底
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, open])

  async function fetchAssistantReply(input) {
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    })
    if (!res.ok) throw new Error("Assistant API 錯誤")
    const data = await res.json()
    return data.reply
  }

  // 發送訊息
  const handleSend = () => {
    if (!input.trim() || waiting) return
    setMessages((msgs) => [
      ...msgs,
      { from: "user", text: input }
    ])
    setWaiting(true)
    // 這裡可以呼叫 API 並收到 assistant 回覆
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: "assistant", text: "好的，我已收到你的提問（這裡可以串接 AI 回應）" }
      ])
      setWaiting(false)
    }, 1200)
    setInput("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Box sx={{ position: "fixed", bottom: 72, right: 32, zIndex: 9999, }} >
      {open ? (
        <Card sx={{ 
          width: { xs: "90vw", md: "50vw" }, // 小螢幕90vw，大螢幕30vw
          maxWidth: { xs: 400, md: 500 },
          minWidth: 320,
          height: 500,
          mb: 2,
          boxShadow: 6,
          display: "flex",
          flexDirection: "column"
        }}>
          <CardContent sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0, // 重要，讓flex容器正確分配高度
            pb: 1,
          }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary">小助手</Typography>
              <ButtonGroup size="small" sx={{ mr: 1 }}>
               <Button variant={fontSize === 14 ? "contained" : "outlined"} onClick={() => setFontSize(14)}>A-</Button>
               <Button variant={fontSize === 16 ? "contained" : "outlined"} onClick={() => setFontSize(16)}>A</Button>
               <Button variant={fontSize === 20 ? "contained" : "outlined"} onClick={() => setFontSize(20)}>A+</Button>
              </ButtonGroup>
              <IconButton aria-label="關閉" size="small" onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>
            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", mt: 1, mb: 1 }}>
              <List dense>
                {messages.map((msg, idx) => (
                  <ListItem key={idx} sx={{ justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }} >
                    <Box sx={{
                        bgcolor: msg.from === "user" ? "#1976d2" : "#eee",
                        color: msg.from === "user" ? "#fff" : "inherit",
                        px: 2, py: 1,
                        borderRadius: 2,
                        maxWidth: "80%",
                        wordBreak: "break-word"
                      }}
                    >
                      <ListItemText primary={msg.text} primaryTypographyProps={{ fontSize: `${fontSize}px` }}/>
                    </Box>
                  </ListItem>
                ))}
                 {waiting && (
                  <ListItem sx={{ justifyContent: "flex-start" }}>
                    <Box sx={{ px: 2, py: 1 }}>
                      <CircularProgress size={20} />
                    </Box>
                  </ListItem>
                )}
                <div ref={messagesEndRef} />
              </List>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField 
                fullWidth
                size="small"
                placeholder="請輸入您的問題..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                multiline
                maxRows={4}
                disabled={waiting}
                sx={{
                  "& .MuiInputBase-input": { fontSize: `${fontSize}px` }
                }}
              />
              <IconButton color="primary" onClick={handleSend} aria-label="發送" disabled={waiting || !input.trim()}>
                <SendIcon />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Fab color="primary" aria-label="小助手" onClick={() => setOpen(true)} sx={{ width: 56, height: 56 }}>
          <ChatIcon fontSize="large" />
        </Fab>
      )}
    </Box>
  )
}

export default Assistant

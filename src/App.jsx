import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import Composer from './components/Composer'
import './App.css'

function App() {
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [pinnedContext, setPinnedContext] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    loadChats()
  }, [])

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId)
      loadChatMeta(activeChatId)
    } else {
      setMessages([])
      setPinnedContext('')
    }
  }, [activeChatId])

  const loadChats = async () => {
    try {
      const result = await window.electronAPI.listChats()
      setChats(result)
      if (result.length > 0 && !activeChatId) {
        setActiveChatId(result[0].id)
      }
    } catch (error) {
      console.error('Failed to load chats:', error)
    }
  }

  const loadMessages = async (chatId) => {
    try {
      const result = await window.electronAPI.listMessages(chatId)
      setMessages(result)
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const loadChatMeta = async (chatId) => {
    try {
      const meta = await window.electronAPI.getChatMeta(chatId)
      setPinnedContext(meta.pinned_context || '')
    } catch (error) {
      console.error('Failed to load chat meta:', error)
    }
  }

  const handleCreateChat = async () => {
    try {
      const newChat = await window.electronAPI.createChat('New Chat')
      setChats([newChat, ...chats])
      setActiveChatId(newChat.id)
    } catch (error) {
      console.error('Failed to create chat:', error)
    }
  }

  const handleUpdatePinnedContext = async (context) => {
    if (!activeChatId) return
    try {
      await window.electronAPI.updatePinnedContext(activeChatId, context)
      setPinnedContext(context)
    } catch (error) {
      console.error('Failed to update pinned context:', error)
    }
  }

  const handleSendMessage = async (content, attachedFiles) => {
    if (!activeChatId || !content.trim()) return

    setIsStreaming(true)
    
    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])

    // Create empty assistant message
    const assistantMessageId = Date.now() + 1
    const assistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      await window.electronAPI.sendMessage(activeChatId, content, attachedFiles)
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsStreaming(false)
    }
  }

  useEffect(() => {
    const handleStreamDelta = (event, { chatId, delta }) => {
      if (chatId === activeChatId) {
        setMessages(prev => {
          const updated = [...prev]
          const lastMsg = updated[updated.length - 1]
          if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.content += delta
            return updated
          }
          return prev
        })
      }
    }

    const handleStreamEnd = (event, { chatId }) => {
      if (chatId === activeChatId) {
        setIsStreaming(false)
      }
    }

    window.electronAPI.onStreamDelta(handleStreamDelta)
    window.electronAPI.onStreamEnd(handleStreamEnd)

    return () => {
      window.electronAPI.removeStreamDelta(handleStreamDelta)
      window.electronAPI.removeStreamEnd(handleStreamEnd)
    }
  }, [activeChatId])

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onCreateChat={handleCreateChat}
        pinnedContext={pinnedContext}
        onUpdatePinnedContext={handleUpdatePinnedContext}
      />
      <div className="main-content">
        <ChatArea messages={messages} />
        <Composer onSend={handleSendMessage} disabled={isStreaming} />
      </div>
    </div>
  )
}

export default App


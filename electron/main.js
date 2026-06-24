import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Database from './database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let mainWindow = null
let db = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Load Vite dev server in development, built files in production
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173/cursor-lite.html')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/cursor-lite.html'))
  }
}

app.whenReady().then(() => {
  db = new Database()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers

ipcMain.handle('list-chats', async () => {
  try {
    return db.listChats()
  } catch (error) {
    console.error('Error listing chats:', error)
    throw error
  }
})

ipcMain.handle('create-chat', async (event, title) => {
  try {
    return db.createChat(title)
  } catch (error) {
    console.error('Error creating chat:', error)
    throw error
  }
})

ipcMain.handle('get-chat-meta', async (event, chatId) => {
  try {
    return db.getChatMeta(chatId)
  } catch (error) {
    console.error('Error getting chat meta:', error)
    throw error
  }
})

ipcMain.handle('update-pinned-context', async (event, chatId, context) => {
  try {
    db.updatePinnedContext(chatId, context)
    return { success: true }
  } catch (error) {
    console.error('Error updating pinned context:', error)
    throw error
  }
})

ipcMain.handle('list-messages', async (event, chatId) => {
  try {
    return db.listMessages(chatId)
  } catch (error) {
    console.error('Error listing messages:', error)
    throw error
  }
})

ipcMain.handle('pick-and-read-files', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (result.canceled) {
      return []
    }

    const fs = await import('fs/promises')
    const files = []

    for (const filePath of result.filePaths) {
      try {
        const content = await fs.readFile(filePath, 'utf8')
        const stats = await fs.stat(filePath)
        files.push({
          name: filePath.split(/[/\\]/).pop(),
          path: filePath,
          content: content,
          size: stats.size
        })
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error)
      }
    }

    return files
  } catch (error) {
    console.error('Error picking files:', error)
    throw error
  }
})

ipcMain.handle('send-message', async (event, chatId, content, attachedFiles) => {
  try {
    // Store user message
    const userMessage = db.createMessage(chatId, 'user', content)
    
    // Create empty assistant message
    const assistantMessage = db.createMessage(chatId, 'assistant', '')
    
    // Start streaming (mock for now)
    streamMockResponse(chatId, assistantMessage.id)
    
    return { success: true, userMessageId: userMessage.id, assistantMessageId: assistantMessage.id }
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
})

function streamMockResponse(chatId, messageId) {
  const mockResponse = "This is a mock response. In a real implementation, this would stream from OpenAI's API. The response is being streamed word by word to demonstrate the streaming architecture."
  const words = mockResponse.split(' ')
  let currentContent = ''
  let wordIndex = 0

  const streamInterval = setInterval(() => {
    if (wordIndex < words.length) {
      const word = words[wordIndex]
      currentContent += (wordIndex > 0 ? ' ' : '') + word
      
      // Update message in database
      db.updateMessage(messageId, currentContent)
      
      // Emit delta to renderer
      mainWindow.webContents.send('stream-delta', { chatId, messageId, delta: word + (wordIndex < words.length - 1 ? ' ' : '') })
      
      wordIndex++
    } else {
      clearInterval(streamInterval)
      mainWindow.webContents.send('stream-end', { chatId, messageId })
    }
  }, 100) // 100ms delay between words
}


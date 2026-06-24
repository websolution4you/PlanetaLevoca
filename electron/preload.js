import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Chat operations
  listChats: () => ipcRenderer.invoke('list-chats'),
  createChat: (title) => ipcRenderer.invoke('create-chat', title),
  getChatMeta: (chatId) => ipcRenderer.invoke('get-chat-meta', chatId),
  updatePinnedContext: (chatId, context) => ipcRenderer.invoke('update-pinned-context', chatId, context),
  
  // Message operations
  listMessages: (chatId) => ipcRenderer.invoke('list-messages', chatId),
  sendMessage: (chatId, content, attachedFiles) => ipcRenderer.invoke('send-message', chatId, content, attachedFiles),
  
  // File operations
  pickAndReadFiles: () => ipcRenderer.invoke('pick-and-read-files'),
  
  // Streaming events
  onStreamDelta: (callback) => {
    ipcRenderer.on('stream-delta', (event, data) => callback(event, data))
  },
  onStreamEnd: (callback) => {
    ipcRenderer.on('stream-end', (event, data) => callback(event, data))
  },
  removeStreamDelta: (callback) => {
    ipcRenderer.removeListener('stream-delta', callback)
  },
  removeStreamEnd: (callback) => {
    ipcRenderer.removeListener('stream-end', callback)
  }
})


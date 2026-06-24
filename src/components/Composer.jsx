import { useState } from 'react'
import './Composer.css'

function Composer({ onSend, disabled }) {
  const [content, setContent] = useState('')
  const [attachedFiles, setAttachedFiles] = useState([])

  const handleSend = async () => {
    if (!content.trim() && attachedFiles.length === 0) return
    if (disabled) return

    await onSend(content, attachedFiles)
    setContent('')
    setAttachedFiles([])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleAttachFiles = async () => {
    try {
      const files = await window.electronAPI.pickAndReadFiles()
      if (files && files.length > 0) {
        setAttachedFiles(files)
      }
    } catch (error) {
      console.error('Failed to attach files:', error)
    }
  }

  return (
    <div className="composer">
      {attachedFiles.length > 0 && (
        <div className="attached-files">
          {attachedFiles.map((file, idx) => (
            <div key={idx} className="attached-file">
              {file.name} ({file.size} bytes)
            </div>
          ))}
        </div>
      )}
      <div className="composer-input-area">
        <button
          className="attach-btn"
          onClick={handleAttachFiles}
          disabled={disabled}
          title="Attach files"
        >
          📎
        </button>
        <textarea
          className="composer-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          disabled={disabled}
          rows={3}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={disabled || (!content.trim() && attachedFiles.length === 0)}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Composer


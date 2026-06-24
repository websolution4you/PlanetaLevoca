import { useState } from 'react'
import './Sidebar.css'

function Sidebar({ chats, activeChatId, onSelectChat, onCreateChat, pinnedContext, onUpdatePinnedContext }) {
  const [localContext, setLocalContext] = useState(pinnedContext)

  const handleContextBlur = () => {
    onUpdatePinnedContext(localContext)
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onCreateChat}>
          + New Chat
        </button>
      </div>
      
      <div className="chat-list">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`chat-item ${chat.id === activeChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="chat-title">{chat.title}</div>
            {chat.summary && (
              <div className="chat-summary">{chat.summary}</div>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="pinned-context-section">
          <label className="pinned-context-label">Pinned Context</label>
          <textarea
            className="pinned-context-textarea"
            value={localContext}
            onChange={(e) => setLocalContext(e.target.value)}
            onBlur={handleContextBlur}
            placeholder="Add context that will be included in every message..."
          />
        </div>
      </div>
    </div>
  )
}

export default Sidebar


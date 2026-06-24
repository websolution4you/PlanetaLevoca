import { Virtuoso } from 'react-virtuoso'
import { useEffect, useRef } from 'react'
import './ChatArea.css'

function ChatArea({ messages }) {
  const virtuosoRef = useRef(null)

  useEffect(() => {
    if (messages.length > 0 && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1,
        behavior: 'smooth',
        align: 'end'
      })
    }
  }, [messages.length])

  const renderMessage = (index) => {
    const message = messages[index]
    if (!message) return null

    return (
      <div className={`message ${message.role}`}>
        <div className="message-role">{message.role === 'user' ? 'You' : 'Assistant'}</div>
        <div className="message-content">{message.content || '...'}</div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="chat-area empty">
        <div className="empty-state">No messages yet. Start a conversation!</div>
      </div>
    )
  }

  return (
    <div className="chat-area">
      <Virtuoso
        ref={virtuosoRef}
        data={messages}
        totalCount={messages.length}
        itemContent={renderMessage}
        followOutput="auto"
        style={{ height: '100%' }}
      />
    </div>
  )
}

export default ChatArea


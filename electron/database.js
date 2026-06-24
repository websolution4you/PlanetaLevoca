import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')
import { app } from 'electron'
import { join } from 'path'

class DatabaseManager {
  constructor() {
    const userDataPath = app.getPath('userData')
    const dbPath = join(userDataPath, 'cursor-lite.db')
    this.db = new Database(dbPath)
    this.initSchema()
  }

  initSchema() {
    // Create chats table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        created_at TEXT NOT NULL,
        pinned_context TEXT DEFAULT '',
        summary TEXT DEFAULT ''
      )
    `)

    // Create messages table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
      )
    `)

    // Create indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
    `)
  }

  listChats() {
    const stmt = this.db.prepare(`
      SELECT * FROM chats
      ORDER BY created_at DESC
    `)
    return stmt.all()
  }

  createChat(title) {
    const stmt = this.db.prepare(`
      INSERT INTO chats (title, created_at)
      VALUES (?, ?)
    `)
    const now = new Date().toISOString()
    const result = stmt.run(title, now)
    return {
      id: result.lastInsertRowid,
      title,
      created_at: now,
      pinned_context: '',
      summary: ''
    }
  }

  getChatMeta(chatId) {
    const stmt = this.db.prepare(`
      SELECT id, title, pinned_context, summary, created_at
      FROM chats
      WHERE id = ?
    `)
    return stmt.get(chatId)
  }

  updatePinnedContext(chatId, context) {
    const stmt = this.db.prepare(`
      UPDATE chats
      SET pinned_context = ?
      WHERE id = ?
    `)
    stmt.run(context, chatId)
  }

  listMessages(chatId) {
    const stmt = this.db.prepare(`
      SELECT * FROM messages
      WHERE chat_id = ?
      ORDER BY created_at ASC
    `)
    return stmt.all(chatId)
  }

  createMessage(chatId, role, content) {
    const stmt = this.db.prepare(`
      INSERT INTO messages (chat_id, role, content, created_at)
      VALUES (?, ?, ?, ?)
    `)
    const now = new Date().toISOString()
    const result = stmt.run(chatId, role, content, now)
    return {
      id: result.lastInsertRowid,
      chat_id: chatId,
      role,
      content,
      created_at: now
    }
  }

  updateMessage(messageId, content) {
    const stmt = this.db.prepare(`
      UPDATE messages
      SET content = ?
      WHERE id = ?
    `)
    stmt.run(content, messageId)
  }

  close() {
    this.db.close()
  }
}

export default DatabaseManager


// @flow
import db from '../db'

export type Message = Object

export const getManyMessages = (messageIds: string[]): Promise<Message[]> => {
  return db
    .table('messages')
    .getAll(...messageIds)
    .run()
    .then(messages => {
      return messages.filter(message => message && !message.deletedAt)
    })
}

export const getMessage = (messageId: string): Promise<Message> => {
  return db
    .table('messages')
    .get(messageId)
    .run()
    .then(message => {
      if (!message || message.deletedAt) {
        return null
      }
      return message
    })
}

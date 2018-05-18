// @flow
const Notification = `
  enum NotificationEventType {
    REACTION_CREATED
    MESSAGE_CREATED
    THREAD_CREATED
    CHANNEL_CREATED
    DIRECT_MESSAGE_THREAD_CREATED
    USER_JOINED_COMMUNITY
    USER_REQUESTED_TO_JOIN_PRIVATE_CHANNEL
    USER_APPROVED_TO_JOIN_PRIVATE_CHANNEL
    THREAD_LOCKED_BY_OWNER
    THREAD_DELETED_BY_OWNER
    COMMUNITY_INVITE
    MENTION_THREAD
    MENTION_MESSAGE
    PRIVATE_CHANNEL_REQUEST_SENT
    PRIVATE_CHANNEL_REQUEST_APPROVED
  }

  enum EntityType {
    REACTION
    MESSAGE
    THREAD
    CHANNEL
    COMMUNITY
    USER
    DIRECT_MESSAGE_THREAD
  }

  type NotificationEntityType {
    id: ID!
    payload: String!
    type: EntityType
  }

  type Notification {
    id: ID!
    createdAt: Date!
    modifiedAt: Date!
    actors: [ NotificationEntityType ]!
    context: NotificationEntityType!
    entities: [ NotificationEntityType ]!
    event: NotificationEventType!
    isRead: Boolean!
    isSeen: Boolean!
  }

  extend type Query {
    notification(id: ID!): Notification
  }
`

module.exports = Notification

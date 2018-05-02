// @flow
import db from '../db.js'

type DBUser = {
  id: string,
  email?: string,
  createdAt: Date,
  name: string,
  coverPhoto: string,
  profilePhoto: string,
  providerId?: ?string,
  githubProviderId?: ?string,
  githubUsername?: ?string,
  username: ?string,
  timezone?: ?number,
  isOnline?: boolean,
  lastSeen?: ?Date,
  description?: ?string,
  website?: ?string,
  modifiedAt: ?Date
}

type GetUserInput = {
  id?: string,
  username?: string
}

const getUser = async (input: GetUserInput): Promise<?DBUser> => {
  if (input.id) {
    return await getUserById(input.id)
  }
  if (input.username) {
    return await getUserByUsername(input.username)
  }
  return null
}

const getUserById = (userId: string): Promise<DBUser> => {
  return db
    .table('users')
    .get(userId)
    .run()
}

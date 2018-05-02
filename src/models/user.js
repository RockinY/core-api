// @flow
import db from '../db.js'
import { createNewUsersSettings } from './usersSettings.js'

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
    const user = await getUserById(input.id)
    return user
  }
  if (input.username) {
    const user = await getUserByUsername(input.username)
    return user
  }
  return null
}

const getUserById = (userId: string): Promise<DBUser> => {
  return db
    .table('users')
    .get(userId)
    .run()
}

const getUserByUsername = (username: string): Promise<DBUser> => {
  return db
    .table('users')
    .getAll(username, { index: 'username' })
    .run()
    .then(result => (result ? result[0] : null))
}

const saveUserProvider = (
  userId: string,
  providerMethod: string,
  providerId: number,
  extraFields?: Object
) => {
  return db
    .table('users')
    .get(userId)
    .run()
    .then(result => {
      let obj = Object.assign({}, result)
      obj[providerMethod] = providerId
      return obj
    })
    .then(user => {
      return db
        .table('users')
        .get(userId)
        .update(
          {
            ...user,
            ...extraFields
          },
          { returnChanges: true }
        )
        .run()
        .then(result => result.changes[0].new_val)
    })
}

const getUserByIndex = (indexName: string, indexValue: string) => {
  return db
    .table('users')
    .getAll(indexValue, { index: indexName })
    .run()
    .then(results => results && results.length > 0 && results[0])
}

const getUserByEmail = (email: string): Promise<DBUser> => {
  return db
    .table('users')
    .getAll(email, { index: 'email' })
    .run()
    .then(results => (results.length > 0 ? results[0] : null))
}

const createOrFindUser = (user: Object, providerMethod: string): Promise<DBUser | {}> => {
  let promise
  if (user.id) {
    promise = getUser({ id: user.id })
  } else {
    if (user[providerMethod]) {
      promise = getUserByIndex(providerMethod, user[providerMethod]).then(
        storedUser => {
          if (storedUser) {
            return storedUser
          }

          if (user.email) {
            return getUserByEmail(user.email)
          } else {
            return Promise.resolve({})
          }
        }
      )
    } else {
      if (user.email) {
        promise = getUserByEmail(user.email)
      } else {
        promise = Promise.resolve({})
      }
    }
  }

  return promise
    .then(storedUser => {
      if (storedUser && storedUser.id) {
        if (!storedUser[providerMethod]) {
          return saveUserProvider(
            storedUser.id,
            providerMethod,
            user[providerMethod]
          )
            .then(() => Promise.resolve(storedUser))
        } else {
          return Promise.resolve(storedUser)
        }
      }

      return storeUser(user)
    })
    .catch(err => {
      if (user.id) {
        console.log(err)
        return new Error(`No user found for id ${user.id}.`)
      }
      return storeUser(user)
    })
}

const storeUser = (user: Object): Promise<DBUser> => {
  return db
    .table('users')
    .insert(
      {
        ...user,
        modifiedAt: null
      },
      { returnChanges: true }
    )
    .run()
    .then(result => {
      const user = result.changes[0].new_val
      return Promise.all([user, createNewUsersSettings(user.id)])
    })
    .then(([user]) => user)
}

module.exports = {
  storeUser,
  createOrFindUser,
  saveUserProvider,
  getUser,
  getUserByIndex,
  getUserByUsername
}
// @flow
import db from '../db.js'
import { createNewUsersSettings } from './usersSettings.js'
import type { DBUser, FileUpload } from '../flowtypes'

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

/* ----------- Batch Operations ----------- */

const getUsers = (userIds: Array<string>): Promise<Array<DBUser>> => {
  return db
    .table('users')
    .getAll(...userIds)
    .run()
}

const getUsersByUsername = (
  usernames: Array<string>
): Promise<Array<DBUser>> => {
  return db
    .table('users')
    .getAll(...usernames, { index: 'username' })
    .run()
}

export type EditUserInput = {
  input: {
    file?: FileUpload,
    name?: string,
    description?: string,
    website?: string,
    coverFile?: FileUpload,
    username?: string,
    timezone?: number
  }
}

const editUser = (input: EditUserInput, userId: string): Promise<DBUser> => {
  const {
    input: { name, description, website, file, coverFile, username, timezone }
  } = input
  return db
    .table('users')
    .get(userId)
    .run()
    .then(result => {
      return Object.assign({}, result, {
        name,
        description,
        website,
        username,
        timezone,
        modifiedAt: new Date()
      })
    })
    .then(user => {
      if (file || coverFile) {
        // TODO: Upload images
      } else {
        return db
          .table('users')
          .get(user.id)
          .update(
            {
              ...user
            },
            { returnChanges: 'always' }
          )
          .run()
          .then(result => {
            // if an update happened
            if (result.replaced === 1) {
              return result.changes[0].new_val
            }

            // an update was triggered from the client, but no data was changed
            if (result.unchanged === 1) {
              return result.changes[0].old_val
            }
          })
      }
    })
}

module.exports = {
  storeUser,
  createOrFindUser,
  saveUserProvider,
  getUser,
  getUserByIndex,
  getUserByUsername,
  getUsers,
  getUsersByUsername,
  editUser
}

// @flow
require('dotenv').config()
const db = require('../db.js')
const faker = require('faker')
const debug = require('debug')('api:migrations:seed')
const {
  defaultCommunities,
  defaultUsers,
  defaultChannels,
  defaultUsersCommunities,
  defaultThreads,
  defaultUsersThreads,
  defaultDirectMessageThreads,
  defaultUsersDirectMessageThreads,
  defaultUsersChannels,
  defaultMessages
} = require('./default/index')
const { generateUsersSettings } = require('./generate')

const users = [
  ...defaultUsers
]

const usersSettings = []
users.forEach(user => {
  usersSettings.push(generateUsersSettings(user.id))
})

Promise.all([
  db
    .table('communities')
    .insert(defaultCommunities)
    .run(),
  db
    .table('channels')
    .insert(defaultChannels)
    .run(),
  db
    .table('threads')
    .insert(defaultThreads)
    .run(),
  db
    .table('messages')
    .insert(defaultMessages)
    .run(),
  db
    .table('users')
    .insert(users)
    .run(),
  db
    .table('usersSettings')
    .insert(usersSettings)
    .run(),
  db
    .table('directMessageThreads')
    .insert(defaultDirectMessageThreads)
    .run(),
  db
    .table('usersCommunities')
    .insert(defaultUsersCommunities)
    .run(),
  db
    .table('usersChannels')
    .insert(defaultUsersChannels)
    .run(),
  db
    .table('usersDirectMessageThreads')
    .insert(defaultUsersDirectMessageThreads)
    .run(),
  db
    .table('usersThreads')
    .insert(defaultUsersThreads)
    .run(),
  db
    .table('curatedContent')
    .insert({
      type: 'recommended',
      data: ['yunshe', 'kuyuan']
    })
])
  .then(() => {
    debug('Finished seeding database! 🎉')
    process.exit()
  })
  .catch(err => {
    debug(
      'Encountered error while inserting data (see below), please run yarn run db:drop and yarn run db:migrate to restore tables to original condition, then run this script again.'
    )
    debug(err)
  })

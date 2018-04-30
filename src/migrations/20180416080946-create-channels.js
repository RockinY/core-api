'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    r
      .tableCreate('channels')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      }),
    r
      .tableCreate('channelSettings')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      })
  ])
  .then(() => {
    return Promise.all([
      // index channels by communityId
      r
        .table('channels')
        .indexCreate('communityId')
        .run(connection)
        .catch(err => {
          console.log(err)
          throw err
        }),
      // index channelSettings
      r
        .table('channelSettings')
        .indexCreate('channelId')
        .run(connection)
        .catch(err => {
          console.log()
          throw err
        })
    ])
  })
  .catch(err => {
    console.log(err)
    throw err
  })
}

exports.down = function (r, connection) {
  return Promise.all([
    r
      .tableDrop('channels')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      }),
    r
      .tableDrop('channelSettings')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      })
  ])
  .catch(err => {
    console.log(err)
    throw err
  })
}

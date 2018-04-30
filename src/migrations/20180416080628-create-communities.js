'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    r
      .tableCreate('communities')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      }),
    r
      .tableCreate('communitySettings')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      })
  ])
  .then(() => {
    Promise.all([
      // index communities
      r
        .table('communities')
        .indexCreate('createdAt')
        .run(connection)
        .catch(err => {
          console.log(err)
          throw err
        }),
      r
        .table('communities')
        .indexCreate('slug')
        .run(connection)
        .catch(err => {
          console.log(err)
          throw err
        }),
      // index communitySettings
      r
        .table('communitySettings')
        .indexCreate('communityId')
        .run(connection)
        .catch(err => {
          console.log(err)
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
      .tableDrop('communities')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      }),
    r
      .tableDrop('communitySettings')
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

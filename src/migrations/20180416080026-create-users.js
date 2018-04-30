'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    r
      .tableCreate('users')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      }),
    r
      .tableCreate('usersSettings')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      }),
    r
      .tableCreate('sessions')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      })
  ])
    .then(() => {
      Promise.all([
        r
          .table('users')
          .indexCreate('username')
          .run(connection)
          .catch(err => {
            console.log(err)
            throw err
          }),
        r
          .table('users')
          .indexCreate('email')
          .run(connection)
          .catch(err => {
            console.log(err)
            throw err
          }),
        r
          .table('users')
          .indexCreate('githubProviderId')
          .run(connection)
          .catch(err => {
            console.log(err)
            throw err
          }),
        r
          .table('usersSettings')
          .indexCreate('userId')
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
      .tableDrop('users')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      }),
    r
      .tableDrop('usersSettings')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      }),
    r
      .tableDrop('sessions')
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

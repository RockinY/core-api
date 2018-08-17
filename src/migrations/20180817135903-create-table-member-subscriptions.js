'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    r
      .tableCreate('memberSubscriptions')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      })
  ])
  .then(() => {
    return Promise.all([
      r
        .table('memberSubscriptions')
        .indexCreate('userId', r.row('userId'))
        .run(connection)
        .catch(err => {
          console.log(err)
          throw err
        })
    ])
  })
}

exports.down = function (r, connection) {
  return Promise.all([r.tableDrop('memberSubscriptions').run(connection)]);
}

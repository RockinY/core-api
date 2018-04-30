'use strict'

exports.up = function (r, connection) {
  return r
    .tableCreate('reputationEvents')
    .run(connection)
    .then(() => {
      return Promise.all([
        r
          .table('reputationEvents')
          .indexCreate('communityId')
          .run(connection)
          .catch(err => {
            console.log(err)
            throw err
          }),
        r
          .table('reputationEvents')
          .indexCreate('userIdAndTimestamp', [r.row('userId'), r.row('timestamp')])
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
  return r
    .tableDrop('reputationEvents')
    .run(connection)
    .catch(err => {
      console.log(err)
      throw err
    })
}

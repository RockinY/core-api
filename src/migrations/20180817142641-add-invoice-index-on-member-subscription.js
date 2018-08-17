'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    r
      .table('memberSubscriptions')
      .indexCreate('invoiceId', r.row('invoiceId'))
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      })
  ])
}

exports.down = function (r, connection) {
  return Promise.resolve();
}


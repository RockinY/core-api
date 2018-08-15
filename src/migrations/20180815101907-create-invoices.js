'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    r
      .tableCreate('invoices')
      .run(connection)
      .catch(err => {
        console.log(err)
        throw err
      })
  ])
  .then(() => {
    return Promise.all([
      r
        .table('invoices')
        .indexCreate('customerId', r.row('customerId'))
        .run(connection)
        .catch(err => {
          console.log(err)
          throw err
        })
    ])
  })
}

exports.down = function (r, connection) {
  return Promise.all([r.tableDrop('invoices').run(connection)]);
}

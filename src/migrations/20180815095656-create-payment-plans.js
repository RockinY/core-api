'use strict'

// 价钱的单位为分
exports.up = function (r, connection) {
  return Promise.all([
    r
      .tableCreate('paymentPlans')
      .run(connection)
      .then(() => {
        const plans = [
          {
            displayName: '30天会员订阅',
            duration: 30,
            price: 2800
          }, {
            displayName: '90天会员订阅',
            duration: 90,
            price: 5800
          }, {
            displayName: '365天会员订阅',
            duration: 365,
            price: 19800
          }
        ]

        const insertPromises = plans.map(plan => {
          return r
            .table('paymentPlans')
            .insert(plan)
            .run(connection);
        });

        return Promise.all([insertPromises]);
      })
  ])
}

exports.down = function (r, connection) {
  return Promise.all([r.tableDrop('paymentPlans').run(connection)]);
}

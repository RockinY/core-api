'use strict'

exports.up = function(r, conn) {
  return Promise.all([
    r
      .tableCreate('curatedContent')
      .run(conn)
      .then(() => {
        const types = [
          {
            type: '测试',
            data: [
              'yunshe',
              'payments'
            ]
          }
        ];

        const insertPromises = types.map(type => {
          return r
            .table('curatedContent')
            .insert(type)
            .run(conn);
        });

        return Promise.all([insertPromises]);
      })
      .catch(err => {
        console.log(err);
        throw err;
      }),
  ]);
};

exports.down = function(r, conn) {
  return Promise.all([r.tableDrop('curatedContent').run(conn)]);
};


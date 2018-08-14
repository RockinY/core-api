'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    r
      .table('users')
      .indexCreate('wechatProviderId')
      .run(connection),
  ]).catch(err => {
    console.log(err);
    throw err;
  });
}

exports.down = function (r, connection) {
  return Promise.resolve();
}

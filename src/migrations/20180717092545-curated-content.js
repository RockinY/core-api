'use strict'

exports.up = function(r, conn) {
  return Promise.all([
    r
      .tableCreate('curatedContent')
      .run(conn)
  ]);
};

exports.down = function(r, conn) {
  return Promise.all([r.tableDrop('curatedContent').run(conn)]);
};


// @flow
import message from './rootMessage';
import getMediaMessagesForThread from './rootGetMediaMessagesForThread';
import author from './author';
import thread from './thread';
import reactions from './reactions';
import parent from './parent';

module.exports = {
  Query: {
    message,
    getMediaMessagesForThread,
  },
  Message: {
    author,
    thread,
    reactions,
    parent,
  },
};

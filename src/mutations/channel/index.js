// @flow
import createChannel from './createChannel'
import deleteChannel from './deleteChannel'
import editChannel from './editChannel'
import toggleChannelNotifications from './toggleChannelNotifications'
import unblockUser from './unblockUser'
import archiveChannel from './archiveChannel'
import restoreChannel from './restoreChannel'
import joinChannelWithToken from './joinChannelWithToken'
import enableChannelTokenJoin from './enableChannelTokenJoin'
import disableChannelTokenJoin from './disableChannelTokenJoin'
import resetChannelJoinToken from './resetChannelJoinToken'
import toggleChannelSubscription from './toggleChannelSubscription'

module.exports = {
  Mutation: {
    createChannel,
    deleteChannel,
    editChannel,
    toggleChannelNotifications,
    toggleChannelSubscription,
    unblockUser,
    archiveChannel,
    restoreChannel,
    joinChannelWithToken,
    enableChannelTokenJoin,
    disableChannelTokenJoin,
    resetChannelJoinToken
  }
}

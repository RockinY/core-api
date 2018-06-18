// @flow
import createCommunity from './createCommunity'
import deleteCommunity from './deleteCommunity'
import editCommunity from './editCommunity'
import pinThread from './pinThread'
import enableBrandedLogin from './enableBrandedLogin'
import disableBrandedLogin from './disableBrandedLogin'
import saveBrandedLoginSettings from './saveBrandedLoginSettings'
import enableCommunityTokenJoin from './enableCommunityTokenJoin'
import disableCommunityTokenJoin from './disableCommunityTokenJoin'
import resetCommunityJoinToken from './resetCommunityJoinToken'

module.exports = {
  Mutation: {
    createCommunity,
    deleteCommunity,
    editCommunity,
    pinThread,
    enableBrandedLogin,
    disableBrandedLogin,
    saveBrandedLoginSettings,
    enableCommunityTokenJoin,
    disableCommunityTokenJoin,
    resetCommunityJoinToken
  }
}

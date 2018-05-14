// @flow
import {
  getChannels
} from '../models/channel'
import createLoader from './createLoader'

export const __createChannelLoader = createLoader(channels => {
  return getChannels(channels)
})

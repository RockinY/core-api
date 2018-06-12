// @flow
import db from '../db'

export const NEW_DOCUMENTS = db
  .row('old_val')
  .eq(null)
  .and(db.not(db.row('new_val').eq(null)))

export type Timeframe = 'daily' | 'weekly' | 'monthly' | 'quarterly'

export const parseRange = (timeframe?: Timeframe) => {
  switch (timeframe) {
    case 'daily': {
      return { current: 60 * 60 * 24, previous: 60 * 60 * 24 * 2 }
    }
    case 'weekly': {
      return { current: 60 * 60 * 24 * 7, previous: 60 * 60 * 24 * 14 }
    }
    case 'monthly': {
      return { current: 60 * 60 * 24 * 30, previous: 60 * 60 * 24 * 60 }
    }
    case 'quarterly': {
      return { current: 60 * 60 * 24 * 90, previous: 60 * 60 * 24 * 180 }
    }
    default: {
      return { current: 60 * 60 * 24 * 7, previous: 60 * 60 * 24 * 14 }
    }
  }
}

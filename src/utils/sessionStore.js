// @flow
import session from '../middlewares/session'

/**
 * Get the sessions' users' ID of a req manually, needed for websocket authentication
 */
export const getUserIdFromReq = (req: any): Promise<string> =>
  new Promise((resolve, reject) => {
    session(req, {}, err => {
      if (err) return reject(err)
      if (!req.session || !req.session.passport || !req.session.passport.user) { return reject() }

      return resolve(req.session.passport.user)
    })
  })

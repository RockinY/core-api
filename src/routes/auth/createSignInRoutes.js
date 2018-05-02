import passport from 'passport'
import { URL } from 'url'
import { isOfficialUrl } from '../../utils/url'
import { signCookie, getCookie } from '../../utils/cookie'

const IS_PROD = process.env.NODE_ENV === 'production'
const FALLBACK_URL = IS_PROD
  ? 'http://lab.liangboyuan.pub'
  : 'http://localhost:3000'

type Strategy = 'github'

export const createSigninRoutes = (
  strategy: Strategy,
  strategyOptions?: Object
) => {
  return {
    /* Store the redirect URL in the session */
    main: (req, ...rest) => {
      let url = FALLBACK_URL
      if (typeof req.query.r === 'string' && isOfficialUrl(req.query.r)) {
        url = req.query.r
      }

      req.session.redirectUrl = url
      if (req.query.authType === 'token') {
        req.session.authType = 'token'
      }

      return passport.authenticate(strategy, strategyOptions)(req, ...rest)
    },

    /* Authenticate and set the response cookie */
    callbacks: [
      passport.authenticate(strategy, {
        failureRedirect: IS_PROD ? '/' : 'http://localhost:3000/'
      }),
      (req, res) => {
        const redirectUrl = req.session.redirectUrl
          ? new URL(req.session.redirectUrl)
          : new URL(FALLBACK_URL)
        redirectUrl.searchParams.append('authed', 'true')

        if (req.session.authType === 'token' && req.session.passport && req.session.passport.user) {
          const cookies = getCookie({ userId: req.session.passport.user })

          redirectUrl.searchParams.append('accessToken', signCookie(
            `session=${cookies.session}; session.sig=${
              cookies['session.sig']
            }`
          ))
        }

        req.session.authType = undefined
        req.session.redirectUrl = undefined
        return res.redirect(redirectUrl.href)
      }
    ]
  }
}

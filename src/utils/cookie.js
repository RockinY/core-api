// @flow
import Keygrip from 'keygrip'
import jwt from 'jsonwebtoken'

export const cookieKeygrip = new Keygrip([process.env.SESSION_COOKIE_SECRET])

export const getCookies = ({ userId }: { userId: string }) => {
  // The value of our "session" cookie
  const session = Buffer.from(
    JSON.stringify({ passport: { user: userId } })
  ).toString('base64')
  // The value of our "session.sig" cookie
  const sessionSig = cookieKeygrip.sign(`session=${session}`)

  return { session, 'session.sig': sessionSig }
}

export const signCookie = (cookie: string) => {
  if (!process.env.API_TOKEN_SECRET) {
    throw new Error(
      'Looks like youre missing an api token secret cookie signing!'
    )
  }
  return jwt.sign({ cookie }, process.env.API_TOKEN_SECRET, {
    expiresIn: '25y'
  })
}

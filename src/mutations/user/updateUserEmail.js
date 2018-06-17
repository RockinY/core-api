// @flow
import type { GraphQLContext } from '../../flowTypes'
import UserError from '../../utils/userError'
import { getUserByEmail, setUserPendingEmail } from '../../models/user'
import isEmail from 'validator/lib/isEmail'
import { isAuthedResolver as requireAuth } from '../../utils/permissions'

type Input = {
  email: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { email } = args
  const { user } = ctx

  if (!isEmail(email)) {
    return new UserError('Please enter a working email address')
  }

  const result = await getUserByEmail(email)

  if (result && result.email === email) {
    return new UserError(
      'Another person on Spectrum is already using this email.'
    )
  }

  return await setUserPendingEmail(user.id, email)
    .then(user => {
      return user
    })
    .catch(
      err =>
        new UserError(
          "We weren't able to send a confirmation email. Please try again."
        )
    )
})

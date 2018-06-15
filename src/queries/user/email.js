// @flow
import type { GraphQLContext, DBUser } from '../../flowTypes';

export default ({ id, email }: DBUser, _: any, { user }: GraphQLContext) => {
  // Only the user themselves can view the email
  if (!user || id !== user.id) return null;
  return email;
};

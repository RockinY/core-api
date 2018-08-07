// @flow
import type { GraphQLContext } from '../../flowTypes';
import UserError from '../../utils/userError';
import { removeSubscription } from '../../models/webPushSubscription';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

export default requireAuth(
  async (_: any, endpoint: string, ctx: GraphQLContext) => {
    const { user } = ctx;

    return await removeSubscription(endpoint)
      .then(() => true)
      .catch(err => {
        return new UserError("Couldn't remove web push subscription.");
      });
  }
);

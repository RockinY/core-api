// @flow
import type { GraphQLContext } from '../../flowTypes';
import UserError from '../../utils/userError';
import type { WebPushSubscription } from './'
import { storeSubscription } from '../../models/webPushSubscription';
import sendWebPushNotification from '../../utils/sendWebPushNotification';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  subscription: WebPushSubscription,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { subscription } = args;

  return storeSubscription(subscription, user.id)
    .then(() => {
      return sendWebPushNotification(
        subscription,
        {
          title: '一条新消息',
          body: '消息通知开启',
        },
        {
          TTL: 300, // If the user doesn't go online for five minutes don't send him this notification anymore
        }
      ).catch(err => {
        return new UserError(
          "It seems like we can't send you web push notifications. Please ping @mxstbr with your browser and OS versions and he'll take a look!"
        );
      });
    })
    .then(() => true)
    .catch(err => {
      return new UserError("Couldn't store web push subscription.");
    });
});

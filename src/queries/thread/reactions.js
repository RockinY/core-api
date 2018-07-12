// @flow
import type { GraphQLContext, DBThread } from '../../flowTypes'

export default ({ id }: DBThread, _: any, { user, loaders }: GraphQLContext) =>
  loaders.threadReaction.load(id).then(result => {
    if (!result) {
      return {
        count: 0,
        hasReacted: false,
      };
    }

    const reactions = result.reduction;

    return {
      count: reactions.length,
      hasReacted: user
        ? reactions.some(reaction => reaction.userId === user.id)
        : false,
    };
  });

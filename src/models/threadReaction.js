// @flow
import db from '../db';
import type { DBThreadReaction } from '../flowTypes';

type ThreadReactionType = 'like';

// prettier-ignore
export const getThreadReactions = (threadIds: Array<string>): Promise<Array<DBThreadReaction>> => {
  const distinctMessageIds = threadIds.filter((x, i, a) => a.indexOf(x) == i);
  return db
    .table('threadReactions')
    .getAll(...distinctMessageIds, { index: 'threadId' })
    .filter(row => row.hasFields('deletedAt').not())
    .group('threadId')
    .run();
};

type ThreadReactionInput = {
  threadId: string,
  type: ThreadReactionType,
};

// prettier-ignore
export const addThreadReaction = (input: ThreadReactionInput, userId: string): Promise<DBThreadReaction> => {
  return db
    .table('threadReactions')
    .getAll(input.threadId, { index: 'threadId' })
    .filter({ userId })
    .run()
    .then(async results => {
      // if the reaction already exists in the db, it was previously deleted
      // just remove the deletedAt field
      if (results && results.length > 0) {
        const thisReaction = results[0];

        return db
          .table('threadReactions')
          .get(thisReaction.id)
          .update({
            deletedAt: db.literal(),
          }, { returnChanges: 'always' })
          .run()
          .then(result => result.changes[0].new_val || result.changes[0].new_val)
      }

      return db
        .table('threadReactions')
        .insert(
          {
            ...input,
            userId,
            createdAt: Date.now(),
          },
          { returnChanges: 'always' }
        )
        .run()
        .then(result => result.changes[0].new_val)
        .then(threadReaction => {
          return threadReaction;
        });
    });
};

// prettier-ignore
export const removeThreadReaction = (threadId: string, userId: string): Promise<?DBThreadReaction> => {
  return db
    .table('threadReactions')
    .getAll(threadId, { index: 'threadId' })
    .filter({ userId })
    .run()
    .then(results => {
      // no reaction exists to be removed
      if (!results || results.length === 0) return null;

      const threadReaction = results[0];

      return db
        .table('threadReactions')
        .get(threadReaction.id)
        .update({
          deletedAt: new Date(),
        }, { returnChanges: 'always' })
        .run()
        .then(result => result.changes[0].new_val || result.changes[0].new_val)
    });
};

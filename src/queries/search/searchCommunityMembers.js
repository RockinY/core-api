// @flow
import type { GraphQLContext } from '../../flowTypes';
import client from '../../utils/elastic';
import type { Args } from './types';

export default (args: Args, { loaders, user }: GraphQLContext) => {
  const { queryString, filter } = args;
  const searchFilter = filter;

  // if we are searching for community members, find *everyone*
  const hitsPerPage = searchFilter && searchFilter.communityId ? 100000 : 20;

  return client.search({
    index: 'users',
    size: hitsPerPage,
    q: queryString
  })
  .then(content => {
    const users = content.hits.hits
    if (!content.hits || content.hits.total === 0) return [];
    // if no search filter was passed, there's no way to be searching for
    // community members
    if (searchFilter && !searchFilter.communityId) return [];
    const userIds = users.map(o => o._source.objectID);
    const input = userIds.map(userId => {
      if (!searchFilter || !searchFilter.communityId) return;
      return [userId, searchFilter.communityId];
    });
    return loaders.userPermissionsInCommunity.loadMany(input);
  })
  .then(results =>
    results.filter(
      user => (user && user.isMember) || (user && user.isBlocked)
    )
  )
  .then(data => data.filter(Boolean))
  .catch(err => {
    console.error('err', err);
  });
};

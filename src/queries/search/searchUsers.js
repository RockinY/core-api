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
    body: {
      query: {
        multi_match: {
          query: queryString,
          fields: ['name', 'username']
        }
      }
    }
  })
  .then(content => {
    const users = content.hits.hits
    if (!content.hits || content.hits.total === 0) return [];

    const userIds = users.map(o => o._source.objectID);
    return loaders.user.loadMany(userIds);
  })
  .then(data => data.filter(Boolean))
  .catch(err => {
    console.error('err', err);
  });
};

// @flow
import type { GraphQLContext } from '../../flowTypes';
import client from '../../utils/elastic';
import type { Args } from './types';

export default (args: Args, { loaders, user }: GraphQLContext) => {
  const { queryString } = args;

  return client.search({
    index: 'communities',
    body: {
      query: {
        multi_match: {
          query: queryString,
          fields: ['name', 'description']
        }
      }
    }
  })
  .then(content => {
    const communities = content.hits.hits
    if (!content.hits || content.hits.total === 0) return [];
    const communityIds = communities.map(o => o.objectID);
    return loaders.community.loadMany(communityIds);
  })
  .then(data => data.filter(Boolean))
  .then(data => data.filter(community => !community.isPrivate))
  .catch(err => {
    console.error('err', err);
  });
};

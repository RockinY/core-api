// @flow
import { graphiqlExpress } from 'graphql-server-express';

export default graphiqlExpress({
  endpointURL: '/api',
  subscriptionsEndpoint: process.env.WS_URL
});

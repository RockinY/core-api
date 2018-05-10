// @flow
/* ----------- Database ----------- */
export type DBUser = {
  id: string,
  email?: string,
  createdAt: Date,
  name: string,
  coverPhoto: string,
  profilePhoto: string,
  providerId?: ?string,
  githubProviderId?: ?string,
  githubUsername?: ?string,
  username: ?string,
  timezone?: ?number,
  isOnline?: boolean,
  lastSeen?: ?Date,
  description?: ?string,
  website?: ?string,
  modifiedAt: ?Date
}

/* ----------- Loader ----------- */
export type Loader = {
  load: (key: string | Array<string>) => Promise<any>,
  loadMany: (keys: Array<string>) => Promise<any>,
  clear: (key: string | Array<string>) => void
}

export type DataLoaderOptions = {
  cache?: boolean
}

/* ----------- GraphQL ----------- */
export type GraphQLContext = {
  user: DBUser,
  loaders: {
    [key: string]: Loader
  }
}

/* ----------- General ----------- */
export type FileUpload = {
  filename: string,
  mimetype: string,
  encoding: string,
  stream: any
}

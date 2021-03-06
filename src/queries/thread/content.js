// @flow
import type { GraphQLContext, DBThread } from '../../flowTypes'

export default ({ content }: DBThread, _: any, ctx: GraphQLContext) => {
  const defaultDraftState = JSON.stringify({
    blocks: [
      {
        key: 'foo',
        text: '',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {}
      }
    ],
    entityMap: {}
  })

  return {
    title: content.title,
    body: content.body ? content.body : defaultDraftState
  }
}

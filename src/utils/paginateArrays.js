// @flow
export type PaginationOptions = {
  first: number,
  after?: string
}

type Input = any

type Output = {
  list: Array<Input>,
  hasMoreItems: boolean
}

export default (
  arr: Array<Input>,
  { first, after }: PaginationOptions,
  getAfter?: any => mixed
): Output => {
  const cursor = getAfter ? arr.findIndex(getAfter) : arr.indexOf(after)
  const begin = cursor > -1 ? cursor + 1 : 0
  const end = begin + first
  return {
    list: arr.slice(begin, end),
    hasMoreItems: arr.length > end
  }
}

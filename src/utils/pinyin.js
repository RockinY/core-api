import pinyin from 'pinyin'

export const stringToLowerCasePinyin = (input: string): string => {
  if (!input) {
    return ''
  }
  // 转换为拼音
  const toPinyin = pinyin(input, {
    style: pinyin.STYLE_NORMAL
  }).map(i => i[0]).join('-')
  // 转换为小写字母
  const toLowerCaseString = toPinyin.toLowerCase()
  // 去除各种奇怪字符
  return toLowerCaseString.replace(/[^a-zA-Z-]/g, "")
}
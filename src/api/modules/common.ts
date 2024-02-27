import request from '../request'

// 中文转大写
export function upPercase(data) {
  return request({
    url: `/common/pinyin`,
    method: 'get',
    params: {
      ...data,
    },
  })
}

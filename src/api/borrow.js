import request from '@/utils/request'

export function bookBorrow(query) {
  return request({
    url: '/borrow/bookBorrow',
    method: 'get',
    params: query
  })
}

export function bookReturn(id) {
  return request({
    url: '/borrow/bookReturn',
    method: 'get',
    params: {id:id}
  })
}

export function listBorrow(query) {
  return request({
    url: '/borrow/list',
    method: 'get',
    params: query
  })
}
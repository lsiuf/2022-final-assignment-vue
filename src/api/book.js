import request from '@/utils/request'

export function listBook(query) {
  return request({
    url: '/book/list',
    method: 'get',
    params: query
  })
}

export function insertBook(dat) {
  return request({
    url: '/book/save',
    method: 'post',
    data: dat
  })
}

export function updateBook(dat) {
  return request({
    url: '/book/update',
    method: 'post',
    data: dat
  })
}

export function deleteBook(id) {
  return request({
    url: '/book/remove',
    method: 'get',
    params: {'id':id}
  })
}


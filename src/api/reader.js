import request from '@/utils/request'

export function listReader(query) {
  return request({
    url: '/reader/list',
    method: 'post',
    data: query
  })
}

export function getReader() {
  return request({
    url: '/reader/getReader',
    method: 'get'
  })
}

export function insertReader(dat) {
  return request({
    url: '/reader/save',
    method: 'post',
    data: dat
  })
}

export function updateReader(dat) {
  return request({
    url: '/reader/update',
    method: 'post',
    data: dat
  })
}

export function deleteReader(id) {
  return request({
    url: '/reader/remove',
    method: 'get',
    params: {'id':id}
  })
}

export function register(dat) {
  return request({
    url: '/reader/register',
    method: 'post',
    data: dat
  })
}

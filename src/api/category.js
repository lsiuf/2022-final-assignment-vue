import request from '@/utils/request'

export function listCategory() {
  return request({
    url: '/category/list',
    method: 'get'
  })
}

export function insertCategory(par) {
  return request({
    url: '/category/save',
    method: 'get',
    params: par
  })
}

export function updateCategory(par) {
  return request({
    url: '/category/update',
    method: 'get',
    params: par
  })
}

export function deleteCategory(id) {
  return request({
    url: '/category/remove',
    method: 'get',
    params: {'id':id}
  })
}


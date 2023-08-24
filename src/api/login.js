import request from '@/utils/request'

export function login(query, role) {
  return request({
    url: getUrlByRole(role, 'login'),
    method: 'get',
    params: query
  })
}

export function loginout(role) {
  return request({
    url: getUrlByRole(role, 'loginout'),
    method: 'get'
  })
}

export function getInfo(role) {
  return request({
    url: getUrlByRole(role, 'getLoginInfo'),
    method: 'get'
  })
}

function getUrlByRole(role, url) {
  let pre
  if(role == 'user') {
    pre = '/reader/'
  }
  if(role == 'admin') {
    pre = '/uadmin/'
  }
  return pre + url
}
import request from '@/utils/request'

export function login(query) {
  return request({
    url: '/uadmin/login',
    method: 'get',
    params: query
  })
}

export function loginout() {
  return request({
    url: '/uadmin/loginout',
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: '/uadmin/getLoginInfo',
    method: 'get'
  })
}
import request from '@/utils/request'

export function getLoginInfo(query) {
  return request({
    url: '/uadmin/login',
    method: 'get',
    params: query
  })
}

export function listUadmin(query) {
  return request({
    url: '/uadmin/list',
    method: 'get',
    params: query
  })
}

export function updateStatus(userId, status) {
  return request({
    url: '/uadmin/updateStatus',
    method: 'get',
    params: {userId:userId, status:status}
  })
}
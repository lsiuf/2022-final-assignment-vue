import request from '@/utils/request'

export function pageClassInfo(dat) {
  return request({
    url: '/classInfo/pageList',
    method: 'post',
    data: dat
  })
}

export function saveClassInfo(dat) {
    return request({
        url: '/classInfo/save',
        method: 'post',
        data: dat
    })
}

export function updateClassInfo(dat) {
    return request({
        url: '/classInfo/update',
        method: 'post',
        data: dat
    })
}

export function updateClassInfoStatus(dat) {
    return request({
        url: '/classInfo/updateStatus',
        method: 'post',
        data: dat
    })
}
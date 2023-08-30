import request from '@/utils/request'

export function getBorrowPeriod() {
    return request({
      url: '/configInfo/getBorrowPeriod',
      method: 'get'
    })
  }
  
import request from '@/utils/request'

export function uploadBookImg(dat) {
  return request({
    url: '/upload/bookImg',
    method: 'post',
    data: dat
  })
}

export const bookImgUrl = process.env.VUE_APP_BASE_API + '/images/'
import defaultSettings from '@/settings'

const title = defaultSettings.title || '韩山师范学院图书管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

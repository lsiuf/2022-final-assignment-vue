import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

]

// 动态渲染路由，根据roles权限显示
export const asyncRoutes = [
  //读者权限
  {
    path: '/borrow',
    component: Layout,
    meta: { roles: ['user'] },
    children: [
      {
        path: 'index',
        name: 'Borrow',
        component: () => import('@/views/borrow/index'),
        meta: {  title: '藏书', icon: 'example' }
      }
    ]
  },
  {
    path: '/readerBorrow',
    component: Layout,
    meta: { roles: ['user'] },
    children: [
      {
        path: 'index',
        name: 'ReaderBorrow',
        component: () => import('@/views/reader_borrow/index'),
        meta: {  title: '借阅订单', icon: 'example' }
      }
    ]
  },
  {
    path: '/readerInfo',
    component: Layout,
    meta: { roles: ['user'] },
    children: [
      {
        path: 'index',
        name: 'ReaderInfo',
        component: () => import('@/views/reader_info/index'),
        meta: {  title: '个人信息', icon: 'example' }
      }
    ]
  },

  //管理员权限
  {
    path: '/borrowList',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        name: 'BorrowList',
        component: () => import('@/views/borrow-list/index'),
        meta: { title: '借阅信息管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/book',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        name: 'Book',
        component: () => import('@/views/book/index'),
        meta: { title: '书籍信息管理', icon: 'nested' }
      }
    ]
  },

  {
    path: '/category',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        name: 'Category',
        component: () => import('@/views/category/index'),
        meta: { title: '书籍分类管理', icon: 'tree' }
      }
    ]
  },

  {
    path: '/reader',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        name: 'Reader',
        component: () => import('@/views/reader/index'),
        meta: { title: '读者信息管理', icon: 'user' }
      }
    ]
  },

  {
    path: '/uadmin',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        name: 'Uadmin',
        component: () => import('@/views/uadmin/index'),
        meta: { title: '管理员信息', icon: 'password' }
      }
    ]
  },

  {
    path: '/classInfo',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        name: 'ClassInfo',
        component: () => import('@/views/class_info/index'),
        meta: { title: '班级信息管理', icon: 'tree' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

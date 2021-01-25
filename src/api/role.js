import request from '@/utils/request'

/**
 * 获取服务器的路由
 * 返回数据  例子：
 * [{
    path: '/',
    component: "layout/Layout",
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: 'dashboard/index',
      name: 'Dashboard',
      meta: {
        title: '首页',
        icon: 'dashboard',
        affix: true
      }
    }]
  }]
 */
export const getRoutes = () => {
  return request({
    url: '/vue-element-admin/getRoutes',
    method: 'get'
  })
}
/**
 * 获取所有用户信息
 * 返回数据  例子：
 * [{
 *  id: 1, key: "admin", name: "admin", worker: "总经理",workerDes:"111"
 * }]
 */
export const getRoles = () => {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

/**
 * 添加角色信息
 * @param {*} role  角色信息
 * 参数例子：
 * {id: 4
    key: ""
    name: "1"
    routes: [{path: "", component: "layout/Layout", redirect: "dashboard",…}]
    worker: "2"
    workerDes: "3"}
 *
 * 返回数据  例子：
 * {"code":20000,"data":"success"}
 *
 */
export const addRole = role => {
  return request({
    url: '/vue-element-admin/addRole',
    method: 'post',
    data: role
  })
}

/**
 * 更新角色信息
 * @param {*} role  角色信息
 * 参数例子：
 * {id: 4
    key: ""
    name: "1"
    routes: [{path: "", component: "layout/Layout", redirect: "dashboard",…}]
    worker: "2"
    workerDes: "3"}
 *
 * 返回数据  例子：
 * {"code":20000,"data":"success"}
 *
 */
export const updateRole = role => {
  return request({
    url: '/vue-element-admin/role/updateRole',
    method: 'post',
    data: role
  })
}

/**
 * 删除角色信息
 * @param {*} role  角色信息
 * 参数例子：
 * {id: 4
    key: ""
    name: "1"
    routes: [{path: "", component: "layout/Layout", redirect: "dashboard",…}]
    worker: "2"
    workerDes: "3"}
 *
 * 返回数据  例子：
 * {"code":20000,"data":"success"}
 *
 */
export const deleteRole = role => {
  return request({
    url: '/vue-element-admin/role/deleteRole',
    method: 'post',
    data: role
  })
}

import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

/**
 *获取角色信息
 * @export
 * @param {*} token 身份令牌
 * @returns
 * 返回数据  例子：
 * [{id: 1, key: "admin", name: "admin", worker: "总经理",workerDes:'111'}]
 */
export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

/**
 * 添加角色
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
export function addUser(role) {
  return request({
    url: '/vue-element-admin/user/addUser',
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
export function delUser(role) {
  return request({
    url: '/vue-element-admin/user/delUser',
    method: 'post',
    data: role
  })
}

/**
 * 更新用户信息
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
export function updateUser(role) {
  return request({
    url: '/vue-element-admin/user/updateUser',
    method: 'post',
    data: role
  })
}

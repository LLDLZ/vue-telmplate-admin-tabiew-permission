import request from '@/utils/request'

// get employee info
/**
 * get employee info
 * 返回数据  例子：
 * [{id: 2, No: 49423, name: "谢平", phoneNum: "19954846127", worker: "厂长",workerDes:"厂长描述"}]
 */
export const getEmployeeInfo = () => {
  return request({
    url: '/vue-element-admin/employee/employee',
    method: 'post'
  })
}

/**
 * get employee workList
 * 返回数据  例子：
 * [{id: 1, label: "总经理", children: []}]
 */

export const getEmployeeWorkList = () => {
  return request({
    url: '/vue-element-admin/employee/employeeWorkList',
    method: 'post'
  })
}

/**
 * add employee
 * @param {*} role  角色信息
 * 参数例子：
 * {id: 30, No: "1", name: "2", phoneNum: "2", worker: "总经理", workerDes: "4", password: "3"}
 *
 * 返回数据  例子：
 * {"code":20000,"data":"success"}
 *
 */
export const addEmployee = (role) => {
  return request({
    url: '/vue-element-admin/employee/employeeAdd',
    method: 'post',
    data: role
  })
}

/**
 * update employee
 * @param {*} role  角色信息
 *  * 参数例子：
 * {id: 30, No: "1", name: "2", phoneNum: "2", worker: "总经理", workerDes: "4", password: "3"}
 * 返回数据  例子：
 * {"code":20000,"data":"success"}
 */
export const updateEmployee = (role) => {
  return request({
    url: '/vue-element-admin/employee/employeeUpdate',
    method: 'post',
    data: role
  })
}

/**
 * delete employee
 * @param {*} id  当前项id
 * 参数例子：
 * id:1
 * 返回数据  例子：
 * 1 (返回删除的id)
 */
export const delEmployee = (id) => {
  return request({
    url: '/vue-element-admin/employee/employeeDel',
    method: 'post',
    data: {
      id
    }
  })
}

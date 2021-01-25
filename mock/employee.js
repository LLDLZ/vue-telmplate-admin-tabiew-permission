const { config } = require('@vue/test-utils')
const { Random } = require('mockjs')
const Mock = require('mockjs')

const workerList = ['总经理', '经理', '员工', '保安', '采购专员', '采购助理', '人力资源主管', '人力资源总监', '厂长', '副厂长']

const workerInfoList = []

for (let i = 0; i < workerList.length; i++) {
	workerInfoList.push(Mock.mock({
		"id": i + 1,
		"label": workerList[i],
		"children": []
	}))
}

const employeeInfoList = []

for (let i = 0; i < 30; i++) {
	let num = Math.floor(Math.random() * 10)
	employeeInfoList.push(Mock.mock({
		"id": i + 1,
		"No|10000-100000": 10000,
		"name": "@cname",
		"phoneNum": /^1[3456789]\d{9}$/,
		"worker": workerList[num],
		"workerDes": "@cparagraph",
		"password": /\d{6}/
	}))
}

const addEmployee = (employee) => {
	if (employee) {
		employeeInfoList.push(employee)
	}
}
const updateEmployee = (employee) => {
	if (employee) {
		employeeInfoList.forEach(item => {
			if (employee.id == item.id) {
				for (index in item) {
					item[index] = employee[index]
				}
			}
		})
	}
}

const delEmployee = (id) => {
	let _index = ''
	if (id) {
		employeeInfoList.forEach((item, index) => {
			if (id == item.id) {
				_index = index
			}
		})
		employeeInfoList.splice(_index, 1)
	}
}


module.exports = [
	// update employee 
	{
		url: '/vue-element-admin/employee/employeeUpdate',
		type: 'post',
		response: config => {
			updateEmployee(config.body)
			return {
				code: 20000,
				data: config.body
			}
		}
	},

	// delete employee
	{
		url: '/vue-element-admin/employee/employeeDel',
		type: 'post',
		response: config => {
			delEmployee(config.body.id)
			return {
				code: 20000,
				data: config.body.id
			}
		}
	},
	// add employee 
	{
		url: '/vue-element-admin/employee/employeeAdd',
		type: 'post',
		response: config => {
			addEmployee(config.body)
			return {
				code: 20000,
				data: 'success'
			}
		}
	},
	//get employeeWorkList
	{
		url: '/vue-element-admin/employee/employeeWorkList',
		type: 'post',
		response: config => {
			return {
				code: 20000,
				data: workerInfoList
			}
		}
	},
	// get employee info
	{
		url: '/vue-element-admin/employee/employee',
		type: 'post',
		response: config => {
			return {
				code: 20000,
				data: employeeInfoList
			}
		}
	}
]
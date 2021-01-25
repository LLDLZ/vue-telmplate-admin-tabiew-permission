<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增员工</el-button>

    <el-table :data="employeeList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="员工编号" width="220">
        <template slot-scope="scope">
          {{ scope.row.No }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="员工姓名" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="手机号">
        <template slot-scope="scope">
          {{ scope.row.phoneNum }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="职位描述">
        <template slot-scope="scope">
          {{ scope.row.workerDes }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '编辑员工' : '新增员工'"
    >
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="员工编号">
          <el-input
            v-model="role.No"
            :placeholder="role.No == '' ? '自动生成' : role.No"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="员工姓名">
          <el-input v-model="role.name" placeholder="员工姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="role.phoneNum" placeholder="中国大陆手机号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="role.password"
            placeholder="设置初试密码"
            type="password"
          />
        </el-form-item>
        <el-form-item label="职位描述">
          <el-input
            v-model="role.workerDes"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="职位描述"
          />
        </el-form-item>
        <el-form-item label="选择职位">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="employeeWorkList"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
            @check-change="handleCheckChange"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import {
  getRoutes,
  getRoles
  // addRole,
  // deleteRole,
  // updateRole
} from '@/api/role'
import {
  getEmployeeInfo,
  getEmployeeWorkList,
  addEmployee,
  delEmployee,
  updateEmployee
} from '@/api/employee'
// import { log } from 'util'

const defaultRole = {
  id: null,
  No: null,
  name: null,
  phoneNum: null,
  worker: null,
  workerDes: null,
  password: null
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      employeeList: [],
      employeeWorkList: [],
      checkedList: []
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
    this.getemployeeInfo()
    this.getWorkList()
  },
  methods: {
    async getemployeeInfo() {
      const res = await getEmployeeInfo()
      this.employeeList = res.data
    },
    async getWorkList() {
      const res = await getEmployeeWorkList()
      this.employeeWorkList = res.data
    },
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    // handle check event
    handleCheckChange(data, checked, indeterminate) {
      const { id } = data
      const checkFlag = this.checkedList.indexOf(id)
      // 当前节点不在this.checked中,且当前节点为选中状态
      if (checkFlag < 0 && this.checkedList.length && checked) {
        this.$message.warning('只能选中一个节点')
        this.$refs.tree.setChecked(data, false) // 取消当前节点的选中状态
        return
      }
      // 当前节点在this.checked中,当前节点为未选中状态(主动去掉当前选中状态)
      if (!checked && checkFlag >= 0 && this.checkedList.length) {
        this.checkedList = []
        return
      }
      // 当前节点不在this.checked(长度为0)中,当前节点为选中状态,this.checked中存储当前节点id
      if (checkFlag < 0 && !this.checkedList.length && checked) {
        this.checkedList.push(id)
      }
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) {
          continue
        }

        const onlyOneShowingChild = this.onlyOneShowingChild(
          route.children,
          route
        )

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      this.role.id = Number(this.employeeList.length + 1)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    getWorkForWorkList(id) {
      let _worker = ''
      this.employeeWorkList.forEach(v => {
        if (Number(v.id) === Number(id)) {
          _worker = v.label
        }
      })
      return _worker
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const _worker = this.role.worker
        const willCheckNodeList = []
        this.employeeWorkList.forEach(v => {
          if (v.label === _worker) {
            willCheckNodeList.push(v)
            this.checkedList.push(v.id)
          }
        })
        this.$refs.tree.setCheckedNodes(willCheckNodeList)
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delEmployee(row.id)
          await this.getemployeeInfo()
          // this.employeeList.splice($index, 1);
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(
            route.children,
            routePath,
            checkedKeys
          )
        }

        if (
          checkedKeys.includes(routePath) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      // tree 选中的值  worker的id
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.worker = this.getWorkForWorkList(checkedKeys)
      console.log(this.role)
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      if (isEdit) {
        await updateEmployee(this.role)
        await this.getemployeeInfo()
      } else {
        await addEmployee(this.role)
        await this.getemployeeInfo()
      }

      const { worker, No, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>员工工号: ${No}</div>
            <div>员工姓名: ${name}</div>
            <div>职位: ${worker}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)
      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = {
          ...parent,
          path: '',
          noShowingChildren: true
        }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>

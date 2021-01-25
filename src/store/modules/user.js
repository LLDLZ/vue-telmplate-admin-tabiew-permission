import { login, logout, getInfo } from '@/api/user'
import { getRoles } from '@/api/role'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  menus: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(async response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { roles, name, avatar, introduction } = data
          const key = state.token.split('-')[0]
          const res = await getRoles()
          const menusList = res.data
          const newMenusList = menusList.filter(v => {
            if (v.key === key) {
              return v
            }
          })
          console.log(`newMenusList[0].routes`, newMenusList[0].routes)
          const menus = newMenusList[0].routes
          // const key =
          // const menus = [
          //   {
          //     path: "/employee",
          //     component: "layout/Layout",
          //     redirect: "/employee/index",
          //     children: [
          //       {
          //         path: "index",
          //         component: "employee/index",
          //         name: "C",
          //         meta: {
          //           title: "员工管理",
          //           icon: "peoples",
          //           noCache: true,
          //           roles: ["admin"]
          //         }
          //       }
          //     ]
          //   },
          //   {
          //     path: "/permission",
          //     component: 'layout/Layout',
          //     redirect: "/permission/page",
          //     name: "Permission",
          //     meta: {
          //       title: "权限管理",
          //       icon: "lock",
          //       roles: ["admin"]
          //     },
          //     children: [
          //       {
          //         path: "role",
          //         component: "permission/role",
          //         name: "RolePermission",
          //         meta: {
          //           title: "权限管理",
          //           roles: ["admin"]
          //         }
          //       }
          //     ]
          //   }
          // ]
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          commit('SET_MENUS', menus)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

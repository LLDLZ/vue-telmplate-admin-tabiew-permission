const Mock = require("mockjs");
const { deepClone } = require("../utils");
const { asyncRoutes, constantRoutes } = require("./routes.js");
// const {asyncRouteList} = require("./async-router");

const routes = deepClone([...constantRoutes, ...asyncRoutes]);

const roles = [
  {
    id: 1,
    key: "admin",
    name: "admin",
    worker: "总经理",
    workerDes: "Super Administrator. Have access to view all pages.",
    routes: routes
  },
  {
    id: 2,
    key: "editor",
    name: "editor",
    worker: "厂长",
    workerDes: "Normal Editor. Can see all pages except permission page",
    routes: routes.filter(i => i.path !== "/permission") // just a mock
  },
  {
    id: 3,
    key: "visitor",
    name: "visitor",
    worker: "员工",
    workerDes:
      "Just a visitor. Can only see the home page and the document page",
    routes: [
      {
        path: "",
        redirect: "dashboard",
        children: [
          {
            path: "dashboard",
            name: "Dashboard",
            meta: { title: "dashboard", icon: "dashboard" }
          }
        ]
      }
    ]
  }
];

/**
 * 判断用户是否有权限
 * @param {*} role  角色信息
 * @param {*} type  类型  add 添加 edit 修改 del 删除
 */
const rolePermission = (role, type) => {
  role.routes.forEach(route => {
    if (route.meta && route.meta.roles) {
      let index = route.meta.roles.indexOf(role.key);
      //小于0 说明没有权限
      if (index < 0 && type == "add") {
        route.meta.roles.push(role.key);
      }
      //大于0 有权限
      else if (type == "update") {
        route.meta.roles.splice(index,1)
        route.meta.roles.push(role.key);
      }else{
        //删除
        route.meta.roles.splice(index,1)
      }
    }
  });
};

const addRole = role => {
  if (role) {
    roles.push(role);
    rolePermission(role,'add')
  }
};

const delRole = role => {
  let _index = "";
  if (role.id) {
    roles.forEach((item, index) => {
      if (role.id == item.id) {
        _index = index;
      }
    });
    roles.splice(_index, 1);
  }
  // rolePermission(role,'del')
};

const upDateRole = role => {
  if (role) {
    roles.forEach(item => {
      if (role.id == item.id) {
        for (index in item) {
          item[index] = role[index];
        }
      }
    });
  }
  rolePermission(role,'update')
};

const getAsyncRouterList = username => {
  let _routerList = [];
  roles.forEach(v => {
    if (v.key == username) {
      _routerList = v.asyncRouterList;
    }
  });
  return _routerList;
};

module.exports = [
  // mock get all routes form server    //mock所有的路由
  {
    url: "/vue-element-admin/getRoutes",
    type: "get",
    response: _ => {
      return {
        code: 20000,
        data: routes
      };
    }
  },
  // mock get all roles form server  mock 所有角色
  {
    url: "/vue-element-admin/roles",
    type: "get",
    response: _ => {
      return {
        code: 20000,
        data: roles
      };
    }
  },
  // add role  添加角色
  {
    url: "/vue-element-admin/addRole",
    type: "post",
    response: config => {
      addRole(config.body);
      return {
        code: 20000,
        // data: "success"
        data: {
          newrole: config.body.routes,
          roles
        }
      };
    }
  },
  // update role  更新角色信息
  {
    url: "/vue-element-admin/role/updateRole",
    type: "post",
    response: config => {
      upDateRole(config.body);
      return {
        code: 20000,
        data: roles
      };
    }
  },
  // delete role  删除角色
  {
    url: "/vue-element-admin/role/deleteRole",
    type: "post",
    response: config => {
      delRole(config.body);
      return {
        code: 20000,
        data: roles
      };
    }
  }
];

// Just a mock data
const constantRoutes = [
  {
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
  },

];

const asyncRoutes = [
  {
    path: "/employee",
    component: "layout/Layout",
    redirect: "/employee/index",
    children: [
      {
        path: "index",
        component: "employee/index",
        name: "C",
        meta: {
          title: "员工管理",
          icon: "peoples",
          noCache: true,
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/permission",
    component: "layout/Layout",
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      title: "权限管理",
      icon: "lock",
      roles: ["admin"]
    },
    children: [
      {
        path: "role",
        component: "permission/role",
        name: "RolePermission",
        meta: {
          title: "权限管理",
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/data_upload",
    component: "layout/Layout",
    redirect: "/data_upload/index",
    alwaysShow: true, // will always show the root menu
    name: "data_upload",
    meta: {
      title: "数据上报",
      icon: "lock",
      roles: ["admin", "editor"] // you can set roles in root nav
    },
    children: [
      {
        path: "index",
        component: "data_upload/index",
        name: "toady_sales_data",
        meta: {
          title: "销售明细表",
          roles: ["admin", "editor"]
        }
      },
      {
        path: "index",
        component: "data_upload/bank_info",
        name: "toady_sales_data",
        meta: {
          title: "银行流水表",
          roles: ["admin", "editor"]
        }
      }
    ]
  },
  {
    path: "/404",
    component: "error-page/404",
    hidden: true
  }
];

module.exports = {
  constantRoutes,
  asyncRoutes
};

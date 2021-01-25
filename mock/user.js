const tokens = {
  admin: {
    token: "admin-token"
  },
  editor: {
    token: "editor-token"
  }
};

const users = {
  "admin-token": {
    roles: ["admin"],
    introduction: "I am a super administrator",
    avatar:
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    name: "Super Admin"
  },
  "editor-token": {
    roles: ["editor"],
    introduction: "I am an editor",
    avatar:
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    name: "Normal Editor"
  }
};

const addUser = role => {
  const newUser = `{
    "${role.key}-token":{
      "roles": ["${role.key}"],
      "introduction": "I am an ${role.key}",
      "avatar":"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      "name": "Normal ${role.key}"
    }
  }`;
  const newUserToken = `{
    "${role.key}": {
      "token": "${role.key}-token"
    }
  }`;
  const newUserTokenObj = JSON.parse(newUserToken);
  const newUserObj = JSON.parse(newUser);
  Object.assign(users, users, newUserObj);
  Object.assign(tokens, tokens, newUserTokenObj);
};
const delUser = (role) => {
  for( k in users){
    if(k == `${role.key}-token`){
      delete users[k]
    }
  }
  for( k in tokens){
    if(k == `${role.key}`){
      delete users[k]
    }
  }
};
const updateUser = (role) => {
  delUser(role)
  addUser(role)
};

module.exports = [
  // 登录
  {
    url: "/vue-element-admin/user/login",
    type: "post",
    response: config => {
      const { username } = config.body;
      const token = tokens[username];
      // mock error
      if (!token) {
        return {
          code: 60204,
          message: "帐户或者密码不正确"
        };
      }

      return {
        code: 20000,
        data: token
      };
    }
  },

  // 获取用户信息
  {
    url: "/vue-element-admin/user/info.*",
    type: "get",
    response: config => {
      const { token } = config.query;
      const info = users[token];

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: "登录失败，无法获取用户详细信息。",
        };
      }

      return {
        code: 20000,
        data: info
      };
    }
  },

  // 退出登录
  {
    url: "/vue-element-admin/user/logout",
    type: "post",
    response: _ => {
      return {
        code: 20000,
        data: "success"
      };
    }
  },
  //添加用户
  {
    url: "/vue-element-admin/user/addUser",
    type: "post",
    response: config => {
      addUser(config.body);
      return {
        code: 20000,
        data: 'success'
      };
    }
  },
  //删除用户
  {
    url: "/vue-element-admin/user/delUser",
    type: "post",
    response: config => {
      delUser(config.body)
      return {
        code: 20000,
        data: "success"
      };
    }
  },
  //更新用户信息
  {
    url: "/vue-element-admin/user/updateUser",
    type: "post",
    response: config => {
      updateUser(config.body)
      return {
        code: 20000,
        data: "success"
      };
    }
  }
];

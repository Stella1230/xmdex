// 4种角色的mock用户
const mockUsers = {
  admin: {
    session: { sessionId: 'rp-s-admin-session-001', userId: 'USER_ADMIN', username: 'admin', name: '超级管理员', orgId: '2026071017405400000031', orgName: null, extFld: {} },
    user: {
      id: 'USER_ADMIN', username: 'admin', password: 'admin123', nickName: '管理员', name: '超级管理员',
      phone: '13800000000', email: 'admin@boc.cn', avatar: '', sex: '0', deptId: '2026071017405400000031',
      parentId: '', roleId: 'ROLE_ADMIN', postIds: '', status: 'ACTIVE', loginIp: '', loginDate: null,
      createBy: '', createTime: 'Tue Jul 07 09:54:34 CST 2026', updateBy: '', updateTime: 'Tue Jul 07 09:54:34 CST 2026',
      remark: '超级管理员账号', deptName: null, roleName: null,
      menuIds: [
        { id: 'MENU_DASHBOARD', menuName: '首页', parentId: '0', menuLevel: 1, menuPath: '/dashboard', sortOrder: 0 },
        { id: 'MENU_TASK', menuName: '任务中心', parentId: '0', menuLevel: 1, menuPath: '', sortOrder: 1, children: [
          { id: 'MENU_PROJECT_LIST', menuName: '项目列表', parentId: 'MENU_TASK', menuLevel: 2, menuPath: '/project/list', sortOrder: 1 },
          { id: 'MENU_TASK_LIST', menuName: '任务列表', parentId: 'MENU_TASK', menuLevel: 2, menuPath: '/task/todo', sortOrder: 2 }
        ]},
        { id: 'MENU_SYSTEM', menuName: '系统管理', parentId: '0', menuLevel: 1, menuPath: '', sortOrder: 2, children: [
          { id: 'MENU_DEPT', menuName: '部门管理', parentId: 'MENU_SYSTEM', menuLevel: 2, menuPath: '/system/dept', sortOrder: 1 },
          { id: 'MENU_ROLE', menuName: '角色管理', parentId: 'MENU_SYSTEM', menuLevel: 2, menuPath: '/system/role', sortOrder: 2 },
          { id: 'MENU_USER', menuName: '用户管理', parentId: 'MENU_SYSTEM', menuLevel: 2, menuPath: '/system/user', sortOrder: 3 }
        ]}
      ]
    }
  },
  deptmanager: {
    session: { sessionId: 'rp-s-deptmgr-session-002', userId: 'USER_DEPT_MGR', username: 'deptmanager', name: '王部门', orgId: '2026071017405400000032', orgName: null, extFld: {} },
    user: {
      id: 'USER_DEPT_MGR', username: 'deptmanager', password: '123456', nickName: '王部门', name: '王部门',
      phone: '13800000010', email: 'deptmanager@boc.cn', avatar: '', sex: '0', deptId: '2026071017405400000032',
      parentId: '', roleId: 'ROLE_DEPT_MANAGER', postIds: '', status: 'ACTIVE', loginIp: '', loginDate: null,
      createBy: '', createTime: 'Tue Jul 07 09:54:34 CST 2026', updateBy: '', updateTime: 'Tue Jul 07 09:54:34 CST 2026',
      remark: '部门负责人 - 软件开发中心', deptName: null, roleName: null,
      menuIds: [
        { id: 'MENU_DASHBOARD', menuName: '首页', parentId: '0', menuLevel: 1, menuPath: '/dashboard', sortOrder: 0 },
        { id: 'MENU_TASK', menuName: '任务中心', parentId: '0', menuLevel: 1, menuPath: '', sortOrder: 1, children: [
          { id: 'MENU_PROJECT_LIST', menuName: '项目列表', parentId: 'MENU_TASK', menuLevel: 2, menuPath: '/project/list', sortOrder: 1 },
          { id: 'MENU_TASK_LIST', menuName: '任务列表', parentId: 'MENU_TASK', menuLevel: 2, menuPath: '/task/todo', sortOrder: 2 }
        ]}
      ]
    }
  },
  groupleader: {
    session: { sessionId: 'rp-s-grouplead-session-003', userId: 'USER_GROUP_LEAD', username: 'groupleader', name: '赵小组', orgId: '2026071314134200000001', orgName: null, extFld: {} },
    user: {
      id: 'USER_GROUP_LEAD', username: 'groupleader', password: '123456', nickName: '赵小组', name: '赵小组',
      phone: '13800000020', email: 'groupleader@boc.cn', avatar: '', sex: '0', deptId: '2026071314134200000001',
      parentId: '', roleId: 'ROLE_GROUP_LEADER', postIds: '', status: 'ACTIVE', loginIp: '', loginDate: null,
      createBy: '', createTime: 'Tue Jul 07 09:54:34 CST 2026', updateBy: '', updateTime: 'Tue Jul 07 09:54:34 CST 2026',
      remark: '小组长 - 开发一部', deptName: null, roleName: null,
      menuIds: [
        { id: 'MENU_DASHBOARD', menuName: '首页', parentId: '0', menuLevel: 1, menuPath: '/dashboard', sortOrder: 0 },
        { id: 'MENU_TASK', menuName: '任务中心', parentId: '0', menuLevel: 1, menuPath: '', sortOrder: 1, children: [
          { id: 'MENU_TASK_LIST', menuName: '任务列表', parentId: 'MENU_TASK', menuLevel: 2, menuPath: '/task/todo', sortOrder: 1 }
        ]}
      ]
    }
  },
  employee: {
    session: { sessionId: 'rp-s-employee-session-004', userId: 'USER_001', username: 'employee', name: '张三', orgId: '2026071017405400000032', orgName: null, extFld: {} },
    user: {
      id: 'USER_001', username: 'employee', password: '123456', nickName: '小张', name: '张三',
      phone: '13800000001', email: 'employee@boc.cn', avatar: '', sex: '0', deptId: '2026071017405400000032',
      parentId: '', roleId: 'ROLE_EMPLOYEE', postIds: '', status: 'ACTIVE', loginIp: '', loginDate: null,
      createBy: '', createTime: 'Tue Jul 07 09:54:34 CST 2026', updateBy: '', updateTime: 'Tue Jul 07 09:54:34 CST 2026',
      remark: '普通员工 - 软件开发中心', deptName: null, roleName: null,
      menuIds: [
        { id: 'MENU_DASHBOARD', menuName: '首页', parentId: '0', menuLevel: 1, menuPath: '/dashboard', sortOrder: 0 },
        { id: 'MENU_TASK', menuName: '任务中心', parentId: '0', menuLevel: 1, menuPath: '', sortOrder: 1, children: [
          { id: 'MENU_TASK_LIST', menuName: '任务列表', parentId: 'MENU_TASK', menuLevel: 2, menuPath: '/task/todo', sortOrder: 1 }
        ]}
      ]
    }
  }
}

let currentUserKey = 'admin'

const mockData = {
  // 登录响应 - 默认返回admin
  login: mockUsers.admin,

  // getUserInfo 响应 - 匹配 HAR ENTRY 3/6/8/13/17/20/23
  userInfo: {
    sessionId: 'rp-s-3abab801-880f-4006-ac74-07d0327efa26',
    userId: 'USER_ADMIN',
    username: 'admin',
    userName: 'admin',
    nickName: '超级管理员',
    name: '超级管理员',
    orgId: '2026071017405400000031',
    orgName: null,
    extFld: {}
  },

  // 部门树 - 匹配 HAR ENTRY 4/9/14/21
  deptTree: [
    {
      id: '2026071017405400000031', deptName: '总行部门', parentId: '0', rootId: '2026071017405400000031', deptLevel: 1, status: 'ACTIVE',
      createBy: null, createTime: 'Fri Jul 10 17:40:54 CST 2026', updateBy: null, updateTime: 'Fri Jul 10 17:40:54 CST 2026', remark: '根部门',
      children: [
        {
          id: '2026071017405400000032', deptName: '软件开发中心', parentId: '2026071017405400000031', rootId: '2026071017405400000031', deptLevel: 2, status: 'ACTIVE',
          createBy: null, createTime: 'Fri Jul 10 17:41:02 CST 2026', updateBy: null, updateTime: 'Fri Jul 10 17:41:02 CST 2026', remark: '',
          children: [
            { id: '2026071314134200000001', deptName: '开发一部', parentId: '2026071017405400000032', rootId: '2026071017405400000031', deptLevel: 3, status: 'ACTIVE', createBy: null, createTime: 'Mon Jul 13 14:13:42 CST 2026', updateBy: null, updateTime: 'Mon Jul 13 14:13:42 CST 2026', remark: null, children: null }
          ]
        },
        {
          id: '2026071018540900000041', deptName: '测试中心', parentId: '2026071017405400000031', rootId: '2026071017405400000031', deptLevel: 2, status: 'ACTIVE',
          createBy: null, createTime: 'Fri Jul 10 18:54:09 CST 2026', updateBy: null, updateTime: 'Fri Jul 10 18:54:09 CST 2026', remark: '', children: null
        },
        {
          id: 'DEPT_001', deptName: '产品管理中心', parentId: '2026071017405400000031', rootId: '2026071017405400000031', deptLevel: 2, status: 'ACTIVE',
          createBy: null, createTime: 'Fri Jul 10 18:54:09 CST 2026', updateBy: null, updateTime: 'Fri Jul 10 18:54:09 CST 2026', remark: '', children: null
        }
      ]
    }
  ],

  // 部门扁平列表 - 匹配 HAR ENTRY 15/16
  deptList: {
    content: [
      { id: '2026071017405400000031', deptName: '总行部门', parentId: '0', rootId: '2026071017405400000031', deptLevel: 1, status: 'ACTIVE', createBy: null, createTime: 'Fri Jul 10 17:40:54 CST 2026', updateBy: null, updateTime: 'Fri Jul 10 17:40:54 CST 2026', remark: '根部门', children: null },
      { id: '2026071018540900000041', deptName: '测试中心', parentId: '2026071017405400000031', rootId: '2026071017405400000031', deptLevel: 2, status: 'ACTIVE', createBy: null, createTime: 'Fri Jul 10 18:54:09 CST 2026', updateBy: null, updateTime: 'Fri Jul 10 18:54:09 CST 2026', remark: '', children: null },
      { id: '2026071017405400000032', deptName: '软件开发中心', parentId: '2026071017405400000031', rootId: '2026071017405400000031', deptLevel: 2, status: 'ACTIVE', createBy: null, createTime: 'Fri Jul 10 17:41:02 CST 2026', updateBy: null, updateTime: 'Fri Jul 10 17:41:02 CST 2026', remark: '', children: null },
      { id: '2026071314134200000001', deptName: '开发一部', parentId: '2026071017405400000032', rootId: '2026071017405400000031', deptLevel: 3, status: 'ACTIVE', createBy: null, createTime: 'Mon Jul 13 14:13:42 CST 2026', updateBy: null, updateTime: 'Mon Jul 13 14:13:42 CST 2026', remark: null, children: null },
      { id: 'DEPT_001', deptName: '产品管理中心', parentId: '2026071017405400000031', rootId: '2026071017405400000031', deptLevel: 2, status: 'ACTIVE', createBy: null, createTime: 'Fri Jul 10 18:54:09 CST 2026', updateBy: null, updateTime: 'Fri Jul 10 18:54:09 CST 2026', remark: '', children: null }
    ],
    totalElements: 5, totalPages: 1, last: true, number: 0, size: 10,
    sort: { sorted: false, unsorted: true, empty: true },
    numberOfElements: 5, first: true, empty: false
  },

  // 用户列表 - 匹配 HAR ENTRY 11/22
  users: {
    total: 3,
    rows: [
      { id: 'USER_ADMIN', username: 'admin', password: 'admin123', nickName: '管理员', name: '超级管理员', phone: '13800000000', email: '', avatar: '', sex: '0', deptId: '2026071017405400000031', parentId: '', roleId: 'ROLE_ADMIN', postIds: '', status: 'ACTIVE', loginIp: '', loginDate: null, createBy: '', createTime: 'Tue Jul 07 09:54:34 CST 2026', updateBy: '', updateTime: 'Tue Jul 07 09:54:34 CST 2026', remark: '', deptName: null, roleName: null, menuIds: null },
      { id: 'USER_001', username: 'zhangsan', password: '123456', nickName: '小张', name: '张三', phone: '13800000001', email: '', avatar: '', sex: '0', deptId: '2026071017405400000032', parentId: '', roleId: 'ROLE_EMPLOYEE', postIds: '', status: 'ACTIVE', loginIp: '', loginDate: null, createBy: '', createTime: 'Tue Jul 07 09:54:34 CST 2026', updateBy: '', updateTime: 'Tue Jul 07 09:54:34 CST 2026', remark: '', deptName: null, roleName: null, menuIds: null },
      { id: 'USER_002', username: 'lisi', password: '123456', nickName: '小李', name: '李四', phone: '13800000002', email: '', avatar: '', sex: '0', deptId: '2026071018540900000041', parentId: '', roleId: 'ROLE_GROUP_LEADER', postIds: '', status: 'ACTIVE', loginIp: '', loginDate: null, createBy: '', createTime: 'Tue Jul 07 09:54:34 CST 2026', updateBy: '', updateTime: 'Tue Jul 07 09:54:34 CST 2026', remark: '', deptName: null, roleName: null, menuIds: null }
    ]
  },

  // 角色列表 - 匹配 HAR ENTRY 18
  roles: {
    total: 4,
    rows: [
      { id: 'ROLE_ADMIN', roleName: '超级管理员', dataScope: 'ALL', dataScopeDeptIds: '', status: 'ACTIVE', createBy: '', createTime: 'Thu Jul 09 16:25:25 CST 2026', updateBy: '', updateTime: 'Thu Jul 09 16:25:25 CST 2026', remark: '' },
      { id: 'ROLE_DEPT_MANAGER', roleName: '部门负责人', dataScope: 'DEPT', dataScopeDeptIds: '', status: 'ACTIVE', createBy: '', createTime: 'Thu Jul 09 16:25:25 CST 2026', updateBy: '', updateTime: 'Thu Jul 09 16:25:25 CST 2026', remark: '' },
      { id: 'ROLE_GROUP_LEADER', roleName: '小组长', dataScope: 'DEPT', dataScopeDeptIds: '', status: 'ACTIVE', createBy: '', createTime: 'Thu Jul 09 16:25:25 CST 2026', updateBy: '', updateTime: 'Thu Jul 09 16:25:25 CST 2026', remark: '' },
      { id: 'ROLE_EMPLOYEE', roleName: '普通员工', dataScope: 'SELF', dataScopeDeptIds: '', status: 'ACTIVE', createBy: '', createTime: 'Thu Jul 09 16:25:25 CST 2026', updateBy: '', updateTime: 'Thu Jul 09 16:25:25 CST 2026', remark: '' }
    ]
  },

  // 菜单树 - 匹配 HAR ENTRY 19
  menuTree: [
    { id: 'MENU_DASHBOARD', menuName: '首页', parentId: '0', menuLevel: 1, menuPath: '/dashboard', sortOrder: 0, createBy: null, createTime: 'Thu Jul 09 15:49:59 CST 2026', updateBy: null, updateTime: 'Thu Jul 09 15:49:59 CST 2026', remark: null, children: null },
    { id: 'MENU_TASK', menuName: '任务中心', parentId: '0', menuLevel: 1, menuPath: '', sortOrder: 1, createBy: null, createTime: 'Thu Jul 09 15:49:59 CST 2026', updateBy: null, updateTime: 'Thu Jul 09 15:49:59 CST 2026', remark: null, children: [
      { id: 'MENU_PROJECT_LIST', menuName: '项目列表', parentId: 'MENU_TASK', menuLevel: 2, menuPath: '/project/list', sortOrder: 1, createBy: null, createTime: 'Thu Jul 09 15:49:59 CST 2026', updateBy: null, updateTime: 'Thu Jul 09 15:49:59 CST 2026', remark: null, children: null },
      { id: 'MENU_TASK_LIST', menuName: '任务列表', parentId: 'MENU_TASK', menuLevel: 2, menuPath: '/task/todo', sortOrder: 2, createBy: null, createTime: 'Thu Jul 09 15:49:59 CST 2026', updateBy: null, updateTime: 'Thu Jul 09 15:49:59 CST 2026', remark: null, children: null }
    ]},
    { id: 'MENU_SYSTEM', menuName: '系统管理', parentId: '0', menuLevel: 1, menuPath: '', sortOrder: 2, createBy: null, createTime: 'Thu Jul 09 15:49:59 CST 2026', updateBy: null, updateTime: 'Thu Jul 09 15:49:59 CST 2026', remark: null, children: [
      { id: 'MENU_DEPT', menuName: '部门管理', parentId: 'MENU_SYSTEM', menuLevel: 2, menuPath: '/system/dept', sortOrder: 1, createBy: null, createTime: 'Thu Jul 09 15:49:59 CST 2026', updateBy: null, updateTime: 'Thu Jul 09 15:49:59 CST 2026', remark: null, children: null },
      { id: 'MENU_ROLE', menuName: '角色管理', parentId: 'MENU_SYSTEM', menuLevel: 2, menuPath: '/system/role', sortOrder: 2, createBy: null, createTime: 'Thu Jul 09 15:49:59 CST 2026', updateBy: null, updateTime: 'Thu Jul 09 15:49:59 CST 2026', remark: null, children: null },
      { id: 'MENU_USER', menuName: '用户管理', parentId: 'MENU_SYSTEM', menuLevel: 2, menuPath: '/system/user', sortOrder: 3, createBy: null, createTime: 'Thu Jul 09 15:49:59 CST 2026', updateBy: null, updateTime: 'Thu Jul 09 15:49:59 CST 2026', remark: null, children: null }
    ]}
  ],

  // 项目列表 - 匹配 HAR ENTRY 5/10
  projects: {
    total: 2,
    rows: [
      { id: 'PROJ_001', projectName: 'Xmdex待办管理系统', projectDesc: '企业内部待办任务管理系统', deptId: 'DEPT_ROOT', completionRate: 50, projectStatus: 'ACTIVE', creatorId: 'USER_ADMIN', createTime: 'Tue Jul 07 09:54:47 CST 2026', updateTime: 'Tue Jul 07 09:54:47 CST 2026', startDate: null, endDate: null, deptName: null, creatorName: null },
      { id: 'PROJ_002', projectName: '移动端适配项目', projectDesc: 'PC端系统移动端适配开发', deptId: 'DEPT_001', completionRate: 30, projectStatus: 'ACTIVE', creatorId: 'USER_ADMIN', createTime: 'Tue Jul 07 09:54:47 CST 2026', updateTime: 'Tue Jul 07 09:54:47 CST 2026', startDate: null, endDate: null, deptName: null, creatorName: null }
    ]
  },

  // 任务列表 - 匹配 HAR ENTRY 2/12
  tasks: {
    total: 3,
    rows: [
      { id: 'TASK_001', taskId: 'TASK_001', taskTitle: '完成登录功能开发', taskContent: '完成用户登录功能开发及单元测试', taskType: 'PERSONAL', priority: 1, status: 'IN_PROGRESS', creatorId: 'USER_ADMIN', ownerId: 'USER_ADMIN', deptId: 'DEPT_ROOT', projectId: 'PROJ_001', revokeStatus: 'NORMAL', creatorName: '超级管理员', ownerName: '超级管理员', createTime: 'Tue Jul 07 09:54:47 CST 2026', updateTime: 'Tue Jul 07 09:54:47 CST 2026', completeTime: null, startDate: null, deadline: null, projectName: null, deptName: null },
      { id: 'TASK_002', taskId: 'TASK_002', taskTitle: '修复用户管理页面BUG', taskContent: '修复用户管理页面数据加载异常问题', taskType: 'PERSONAL', priority: 2, status: 'PENDING', creatorId: 'USER_ADMIN', ownerId: 'USER_001', deptId: 'DEPT_ROOT', projectId: 'PROJ_001', revokeStatus: 'NORMAL', creatorName: '超级管理员', ownerName: '张三', createTime: 'Tue Jul 07 09:54:47 CST 2026', updateTime: 'Tue Jul 07 09:54:47 CST 2026', completeTime: null, startDate: null, deadline: null, projectName: null, deptName: null },
      { id: 'TASK_003', taskId: 'TASK_003', taskTitle: '完成项目列表接口', taskContent: '开发项目列表查询接口', taskType: 'PERSONAL', priority: 2, status: 'COMPLETED', creatorId: 'USER_ADMIN', ownerId: 'USER_001', deptId: 'DEPT_001', projectId: 'PROJ_001', revokeStatus: 'NORMAL', creatorName: '超级管理员', ownerName: '张三', createTime: 'Tue Jul 07 09:54:47 CST 2026', updateTime: 'Tue Jul 07 09:54:47 CST 2026', completeTime: null, startDate: null, deadline: null, projectName: null, deptName: null }
    ]
  },

  // 看板数据 - 匹配 HAR ENTRY 1/7
  boardData: {
    projectCount: 5,
    statusStat: { completedTask: 12, inProgressTask: 8, pendingTask: 5, overdueTask: 3 },
    completionRate: 48,
    projectStatList: [
      { COMPLETEDCOUNT: 8, PROJECTID: 'PROJ_001', TASKCOUNT: 15, OVERDUECOUNT: 2, PROJECTNAME: 'Xmdex待办管理系统' },
      { COMPLETEDCOUNT: 3, PROJECTID: 'PROJ_002', TASKCOUNT: 6, OVERDUECOUNT: 1, PROJECTNAME: '移动端适配项目' },
      { COMPLETEDCOUNT: 1, PROJECTID: 'PROJ_003', TASKCOUNT: 4, OVERDUECOUNT: 0, PROJECTNAME: '数据中台接入' },
      { COMPLETEDCOUNT: 0, PROJECTID: 'PROJ_004', TASKCOUNT: 0, OVERDUECOUNT: 0, PROJECTNAME: '智慧园区平台' }
    ],
    recent7DaysTrend: {
      dates: ['07-08', '07-09', '07-10', '07-11', '07-12', '07-13', '07-14'],
      newTask: [3, 2, 4, 1, 5, 2, 3],
      completedTask: [2, 3, 1, 4, 2, 3, 5]
    },
    yesterdayTrend: { totalTask: 2, completedTask: 1, pendingTask: 1, overdueTask: 0 }
  }
}

const roleMenuAssignments = {
  ROLE_ADMIN: ['MENU_DASHBOARD', 'MENU_TASK', 'MENU_PROJECT_LIST', 'MENU_TASK_LIST', 'MENU_SYSTEM', 'MENU_DEPT', 'MENU_ROLE', 'MENU_USER'],
  ROLE_DEPT_MANAGER: ['MENU_DASHBOARD', 'MENU_TASK', 'MENU_PROJECT_LIST', 'MENU_TASK_LIST'],
  ROLE_GROUP_LEADER: ['MENU_DASHBOARD', 'MENU_TASK', 'MENU_TASK_LIST'],
  ROLE_EMPLOYEE: ['MENU_DASHBOARD', 'MENU_TASK', 'MENU_TASK_LIST']
}

const wrapSuccess = (data) => ({
  RSP_CODE: "000000",
  RSP_MSG: "成功",
  RSP_BODY: {
    resultData: data
  }
})

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = async (url, options = {}) => {
  await sleep(300)
  const method = options.method || 'GET'
  const data = options.data || {}

  let result = null

  if (url.includes('/handleLogin') || url.includes('/login/login')) {
    const username = data.username || 'admin'
    const user = mockUsers[username] || mockUsers.admin
    currentUserKey = username
    result = user
  } else if (url.includes('/login/logout') || url.includes('/handleLogout')) {
    result = {}
  } else if (url.includes('/login/changePwd') || url.includes('/handleChangePwd')) {
    const user = mockUsers[currentUserKey] || mockUsers.admin
    if (data.oldPassword && data.oldPassword !== user.user.password) {
      result = { code: 400, message: '原密码错误' }
    } else {
      if (data.newPassword) user.user.password = data.newPassword
      result = { code: 200, message: '密码修改成功' }
    }
  } else if (url.includes('/handleGetInfo') || url.includes('/login/getInfo') || url.includes('/user/info')) {
    const u = mockUsers[currentUserKey] || mockUsers.admin
    result = { sessionId: u.session.sessionId, userId: u.user.id, username: u.user.username, userName: u.user.username, nickName: u.user.nickName, name: u.user.name, phone: u.user.phone || '', email: u.user.email || '', sex: u.user.sex || '', orgId: u.user.deptId, orgName: null, extFld: {} }
  } else if (url.includes('/queryMenuTree') || url.includes('/system/menu/treeselect')) {
    result = mockData.menuTree
  } else if (url.includes('/system/menu/list') || url.includes('/queryMenuList')) {
    result = { rows: flattenMenus(mockData.menuTree), total: flattenMenus(mockData.menuTree).length }
  } else if (url.includes('/queryDeptTree') || url.includes('/system/dept/treeselect')) {
    result = mockData.deptTree
  } else if (url.includes('/queryDeptList') || url.includes('/system/dept/list')) {
    result = mockData.deptList
  } else if (url.includes('/system/dept') || url.includes('/createDept') || url.includes('/modifyDept') || url.includes('/removeDept')) {
    result = {}
  } else if (url.includes('/queryUserList') || url.includes('/system/user/list')) {
    const deptId = data.deptId
    let rows = mockData.users.rows
    if (deptId) {
      const collectChildDeptIds = (nodes) => {
        const ids = []
        nodes.forEach(n => {
          ids.push(n.id)
          if (n.children) ids.push(...collectChildDeptIds(n.children))
        })
        return ids
      }
      const allDeptIds = collectChildDeptIds(mockData.deptTree)
      const isChildOf = (targetId, ancestorId) => {
        const findPath = (nodes, target, path = []) => {
          for (const n of nodes) {
            if (n.id === target) return [...path, n.id]
            if (n.children) {
              const found = findPath(n.children, target, [...path, n.id])
              if (found) return found
            }
          }
          return null
        }
        const path = findPath(mockData.deptTree, targetId)
        return path && path.includes(ancestorId) && path[path.length - 1] === targetId
      }
      rows = rows.filter(u => u.deptId === deptId || isChildOf(u.deptId, deptId))
    }
    result = { total: rows.length, rows }
  } else if (url.includes('/createUser') || url.includes('/modifyUser') || url.includes('/removeUser') || url.includes('/system/user')) {
    result = {}
  } else if (url.includes('/queryRoleList') || url.includes('/system/role/list')) {
    result = mockData.roles
  } else if (url.includes('/system/role/authMenu') || url.includes('/assignMenu')) {
    if (data.action === 'get') {
      result = { data: roleMenuAssignments[data.roleId] || [] }
    } else {
      roleMenuAssignments[data.roleId] = data.menuIds || []
      result = {}
    }
  } else if (url.includes('/system/role') || url.includes('/createRole') || url.includes('/modifyRole') || url.includes('/removeRole')) {
    result = {}
  } else if (url.includes('/queryProjectList') || url.includes('/todo/project/list')) {
    const deptId = data.deptId
    let rows = mockData.projects.rows
    if (deptId) {
      rows = rows.filter(p => p.deptId === deptId)
    }
    result = { total: rows.length, rows }
  } else if (url.includes('/getProjectDetail') || url.includes('/todo/project/getProject')) {
    result = mockData.projects.rows[0]
  } else if (url.includes('/createProject') || url.includes('/modifyProject') || url.includes('/removeProject') || url.includes('/todo/project')) {
    result = {}
  } else if (url.includes('/queryTaskList') || url.includes('/todo/task/list')) {
    const deptId = data.deptId
    let rows = mockData.tasks.rows
    if (deptId) {
      rows = rows.filter(t => t.deptId === deptId)
    }
    result = { total: rows.length, rows }
  } else if (url.includes('/getTaskDetail') || url.includes('/todo/task/getTask')) {
    result = mockData.tasks.rows[0]
  } else if (url.includes('/finishTask') || url.includes('/todo/task/complete')) {
    result = {}
  } else if (url.includes('/reopenTask') || url.includes('/todo/task/reopen')) {
    result = {}
  } else if (url.includes('/createTask') || url.includes('/modifyTask') || url.includes('/removeTask') || url.includes('/todo/task')) {
    result = {}
  } else if (url.includes('/fetchBoardData') || url.includes('/todo/board')) {
    const roleId = data.roleId
    const boardData = mockData.boardData
    if (roleId === 'ROLE_EMPLOYEE') {
      result = {
        projectCount: 1,
        statusStat: { completedTask: 2, inProgressTask: 1, pendingTask: 0, overdueTask: 0 },
        completionRate: 67,
        projectStatList: [
          { COMPLETEDCOUNT: 2, PROJECTID: 'PROJ_001', TASKCOUNT: 3, OVERDUECOUNT: 0, PROJECTNAME: 'Xmdex待办管理系统' }
        ],
        recent7DaysTrend: boardData.recent7DaysTrend,
        yesterdayTrend: { totalTask: 0, completedTask: 1, pendingTask: 0, overdueTask: 0 }
      }
    } else if (roleId === 'ROLE_GROUP_LEADER') {
      result = {
        projectCount: 2,
        statusStat: { completedTask: 3, inProgressTask: 2, pendingTask: 1, overdueTask: 0 },
        completionRate: 50,
        projectStatList: boardData.projectStatList.slice(0, 2),
        recent7DaysTrend: boardData.recent7DaysTrend,
        yesterdayTrend: { totalTask: 1, completedTask: 1, pendingTask: 0, overdueTask: 0 }
      }
    } else {
      result = boardData
    }
  } else if (url.includes('/system/post')) {
    result = { rows: [], total: 0 }
  } else if (url.includes('/system/dict')) {
    result = { rows: [], total: 0 }
  } else if (url.includes('/system/config')) {
    result = { rows: [], total: 0 }
  } else if (url.includes('/system/notice')) {
    result = { rows: [], total: 0 }
  } else if (url.includes('/monitor')) {
    result = { rows: [], total: 0 }
  } else {
    result = {}
  }

  return wrapSuccess(result)
}

function flattenMenus(menus) {
  const result = []
  const flatten = (items) => {
    if (!items) return
    items.forEach(item => {
      const { children, ...rest } = item
      result.push(rest)
      if (children && children.length > 0) {
        flatten(children)
      }
    })
  }
  flatten(menus)
  return result
}

export default mockApi

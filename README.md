# xmdex后台管理系统

## 一、技术栈与版本号

| 类别 | 技术 | 版本 |
|------|------|------|
| **框架** | React | ^17.0.2 |
| **路由** | react-router-dom | ^5.3.4 |
| **UI组件库** | antd | ^4.24.15 |
| **HTTP请求** | axios | ^1.7.4 |
| **图表** | echarts | ^5.4.3 |
| **日期处理** | dayjs | ^1.11.10 |
| **构建工具** | webpack | ^5.69.0 |
| **CSS预处理器** | less | ^4.6.4 |

---

## 二、目录结构

```
xmdex/
├── public/                        # 静态资源目录
├── src/
│   ├── assets/                    # 资源目录
│   │   └── images/                # 图片资源
│   ├── common/                    # 公共代码目录
│   │   ├── Auth.js                # AuthProvider + useAuth（token/userId/deptId/roleId/menus）
│   │   └── hooks/                 # 公共Hooks
│   │       ├── UseResizable.js    # 拖拽调整宽度，返回 [leftWidth, onResizeStart]
│   │       └── UseTableCrud.js    # 公共CRUD状态管理Hook
│   ├── components/                # 组件目录
│   │   ├── DeptTree.jsx           # 部门树（搜索、展开收起、hover菜单）
│   │   ├── ECharts.jsx            # ECharts图表（树摇优化 + React.memo）
│   │   └── ErrorBoundary.jsx      # 错误边界
│   ├── layouts/                   # 基础布局模版目录
│   │   ├── index.jsx              # 主布局（侧边栏、Header、标签页、个人中心弹窗、修改密码）
│   │   └── index.less             # 布局样式（.logo/.header/.content/.ant-menu-dark/.profile-section/.pwd-section）
│   ├── models/                    # 前端数据模型目录（页面交互逻辑）
│   │   ├── Dashboard.js           # 首页看板模型（stats/chartData/trendData）
│   │   ├── TaskTodo.js            # 任务列表模型（CRUD/权限/部门筛选）
│   │   ├── ProjectList.js         # 项目列表模型（CRUD/部门树选择）
│   │   ├── Dept.js                # 部门管理模型（树形CRUD/层级管理）
│   │   ├── Role.js                # 角色管理模型（CRUD/菜单授权）
│   │   └── User.js                # 用户管理模型（CRUD/部门筛选/重置密码）
│   ├── routes/                    # 路由与页面目录
│   │   ├── config.js              # 路由配置 + 权限映射
│   │   ├── Dashboard.jsx          # 首页/仪表盘（5统计卡片 + 4图表 + 最近任务表）
│   │   ├── Dashboard.less
│   │   ├── Login.jsx              # 登录页（useAuth + useEffect自动跳转）
│   │   ├── NotFound.jsx           # 404页面
│   │   ├── Developing.jsx         # 待开发页面占位
│   │   ├── monitor/               # 系统监控（全部待开发）
│   │   ├── task/
│   │   │   ├── ProjectBoard.jsx   # 项目看板
│   │   │   ├── ProjectList.jsx    # 项目列表
│   │   │   └── TaskTodo.jsx       # 任务列表
│   │   ├── system/
│   │   │   ├── Config.jsx
│   │   │   ├── Dept.jsx           # 部门管理（拖拽宽度、树形结构）
│   │   │   ├── Dict.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Notice.jsx
│   │   │   ├── Post.jsx
│   │   │   ├── Role.jsx           # 角色管理（CRUD + 菜单授权弹窗）
│   │   │   └── User.jsx           # 用户管理（拖拽宽度、部门树、重置密码）
│   │   └── tool/                  # 系统工具（全部待开发）
│   ├── services/                  # 后台请求服务目录
│   │   ├── index.js               # axios实例 + 拦截器 + 统一导出
│   │   ├── Mock.js                # Mock数据（HAR录制）
│   │   ├── Auth.js                # 认证相关接口
│   │   ├── Dept.js                # 部门管理接口
│   │   ├── Role.js                # 角色管理接口
│   │   ├── User.js                # 用户管理接口
│   │   ├── Project.js             # 项目管理接口
│   │   ├── Task.js                # 任务管理接口
│   │   └── types/                 # TypeScript类型定义
│   │       ├── index.ts           # 统一导出
│   │       ├── Common.ts          # 通用类型（分页、树节点）
│   │       ├── Auth.ts            # 认证相关类型
│   │       ├── Dept.ts            # 部门管理类型
│   │       ├── Role.ts            # 角色管理类型
│   │       ├── User.ts            # 用户管理类型
│   │       ├── Project.ts         # 项目管理类型
│   │       ├── Task.ts            # 任务管理类型
│   │       └── Board.ts           # 看板统计类型
│   ├── utils/                     # 工具类目录
│   │   ├── Date.js                # parseTime 日期格式化
│   │   └── Status.js              # statusMap + getStatusTag 状态映射
│   ├── index.js                   # 入口：ConfigProvider + ErrorBoundary + App
│   ├── index.less                 # 全局样式（body/#root/.login-*/.resize-layout）
│   └── App.jsx                    # 路由配置（HashRouter + AuthProvider + PrivateRoute）
├── index.html
├── index.ejs
├── webpack.config.js              # Webpack（DefinePlugin REACT_APP_MOCK，端口3000）
├── package.json
└── README.md
```

---

## 三、启动方式

```bash
# 安装依赖
npm install

# 开发模式（默认Mock，端口3000）
npm run dev

# Mock开关（在webpack.config.js中修改MOCK_MODE）
# MOCK_MODE = true  → 走本地Mock数据
# MOCK_MODE = false → 走真实后端接口

# 生产构建
npm run build
```

访问: http://localhost:3000

### 登录账号（Mock模式）

| 角色 | 账号 | 密码 |
|------|------|------|
| 超级管理员 | admin | 123456 |
| 部门负责人 | deptmanager | 123456 |
| 小组长 | groupleader | 123456 |
| 普通员工 | employee | 123456 |

---

## 四、权限与路由

### 角色定义

| 角色 | 角色ID | 数据范围 |
|------|--------|---------|
| 超级管理员 | `ROLE_ADMIN` | 全公司 |
| 部门负责人 | `ROLE_DEPT_MANAGER` | 本部门 + 下级部门 |
| 小组长 | `ROLE_GROUP_LEADER` | 本组人员（本部门所有人） |
| 普通员工 | `ROLE_EMPLOYEE` | 本人 |

### 路由权限控制

| 路径 | 可访问角色 |
|------|-----------|
| `/dashboard` | 所有已登录用户 |
| `/project/list` | 所有已登录用户 |
| `/task/todo` | 所有已登录用户 |
| `/system/dept` | ROLE_ADMIN、ROLE_DEPT_MANAGER |
| `/system/role` | ROLE_ADMIN |
| `/system/user` | ROLE_ADMIN |

> 权限在 `src/routes/config.js` 的 `routePermissionMap` 中配置，`App.jsx` 的 `PrivateRoute` 组件统一拦截。

---

## 五、菜单结构与页面功能清单

### 菜单结构

```
首页
任务中心
├── 项目列表
└── 任务列表
系统管理
├── 部门管理
├── 角色管理
├── 用户管理
├── 岗位管理（待开发）
├── 菜单管理（待开发）
├── 字典管理（待开发）
├── 参数管理（待开发）
└── 通知管理（待开发）
系统监控
├── 在线用户（待开发）
├── 操作日志（待开发）
├── 定时任务（待开发）
├── 服务器（待开发）
└── 缓存监控（待开发）
系统工具
├── 代码生成（待开发）
└── 表单构建（待开发）
```

### 页面状态总览

| 模块 | 页面 | 路径 | 状态 |
|------|------|------|------|
| 首页 | 仪表盘 | /dashboard | ✅ 已完成 |
| 登录 | 登录页 | /login | ✅ 已完成 |
| 任务中心 | 项目列表 | /project/list | ✅ 已完成 |
| 任务中心 | 项目看板 | /project/board | ✅ 已完成 |
| 任务中心 | 任务列表 | /task/todo | ✅ 已完成 |
| 系统管理 | 部门管理 | /system/dept | ✅ 已完成 |
| 系统管理 | 角色管理 | /system/role | ✅ 已完成 |
| 系统管理 | 用户管理 | /system/user | ✅ 已完成 |
| 系统管理 | 岗位管理 | /system/post | 🔶 待开发 |
| 系统管理 | 菜单管理 | /system/menu | 🔶 待开发 |
| 系统管理 | 字典管理 | /system/dict | 🔶 待开发 |
| 系统管理 | 参数管理 | /system/config | 🔶 待开发 |
| 系统管理 | 通知管理 | /system/notice | 🔶 待开发 |
| 系统监控 | 在线用户 | /monitor/online | 🔶 待开发 |
| 系统监控 | 操作日志 | /monitor/operlog | 🔶 待开发 |
| 系统监控 | 定时任务 | /monitor/job | 🔶 待开发 |
| 系统监控 | 服务器 | /monitor/server | 🔶 待开发 |
| 系统监控 | 缓存监控 | /monitor/cache | 🔶 待开发 |
| 系统工具 | 代码生成 | /tool/gen | 🔶 待开发 |
| 系统工具 | 表单构建 | /tool/build | 🔶 待开发 |

---

## 六、前后端联调接口清单（34个接口）

> 所有接口定义在 `src/services/` 目录（Auth.js/Dept.js/Role.js/User.js/Project.js/Task.js），Mock数据在 `src/services/Mock.js`。
> TypeScript类型定义在 `src/services/types/` 目录，按模块拆分。
> 响应拦截器：Mock模式返回 `response.data.result`，否则提取 `RSP_BODY?.resultData` 并格式化日期字段。

### 1. 认证接口（`src/services/Auth.js`）

| # | 接口函数 | 后端路径 | 方法 | 请求参数 | 用途 | 状态 |
|---|---------|---------|------|---------|------|------|
| 1 | `login` | `/handleLogin.do` | POST | `{ username, password }` | 登录获取token | 🔗 待联调 |
| 2 | `getUserInfo` | `/handleGetInfo.do` | POST | — | 获取当前用户信息（含phone/email） | 🔗 待联调 |
| 3 | `logout` | `/handleLogout.do` | POST | — | 退出登录 | 🔗 待联调 |
| 4 | `changePassword` | `/handleChangePwd.do` | POST | `{ oldPassword, newPassword }` | 修改密码（个人中心） | 🔗 待联调 |

### 2. 部门管理（`src/services/Dept.js` + Dept.jsx）

| # | 接口函数 | 后端路径 | 方法 | 请求参数 | 用途 | 状态 |
|---|---------|---------|------|---------|------|------|
| 5 | `getDeptTree` | `/dept/tree` | GET | — | 左侧部门树 | 🔗 待联调 |
| 6 | `getDeptList` | `/dept/list` | GET | `{ pageNum, pageSize, deptName?, rootId? }` | 右侧部门列表 | 🔗 待联调 |
| 7 | `getDeptDetail` | `/dept/detail` | GET | `{ id }` | 编辑回显 | 🔗 待联调 |
| 8 | `addDept` | `/dept/add` | POST | `{ deptName, parentId, remark? }` | 新增部门 | 🔗 待联调 |
| 9 | `updateDept` | `/dept/update` | POST | `{ id, deptName, remark? }` | 编辑部门 | 🔗 待联调 |
| 10 | `deleteDept` | `/dept/delete` | POST | `{ id }` | 删除部门 | 🔗 待联调 |

### 3. 角色管理（`src/services/Role.js` + Role.jsx）

| # | 接口函数 | 后端路径 | 方法 | 请求参数 | 用途 | 状态 |
|---|---------|---------|------|---------|------|------|
| 11 | `getRoleList` | `/role/list` | GET | `{ pageNum, pageSize }` | 角色列表 | 🔗 待联调 |
| 12 | `addRole` | `/role/add` | POST | `{ roleName, status }` | 新增角色 | 🔗 待联调 |
| 13 | `updateRole` | `/role/update` | POST | `{ id, roleName, status }` | 编辑角色 | 🔗 待联调 |
| 14 | `deleteRole` | `/role/delete` | POST | `{ id }` | 删除角色 | 🔗 待联调 |
| 15 | `getMenuTree` | `/menu/tree` | GET | — | 授权菜单树 | 🔗 待联调 |
| 16 | `authRoleMenu`（查询） | `/role/menu` | GET | `{ roleId }` | 查询已授权菜单 | 🔗 待联调 |
| 17 | `authRoleMenu`（保存） | `/role/menu` | POST | `{ roleId, menuIds: [...] }` | 保存授权 | 🔗 待联调 |

### 4. 用户管理（`src/services/User.js` + User.jsx）

| # | 接口函数 | 后端路径 | 方法 | 请求参数 | 用途 | 状态 |
|---|---------|---------|------|---------|------|------|
| 18 | `getUserList` | `/user/list` | GET | `{ pageNum, pageSize, deptId?, username?, phone? }` | 用户列表 | 🔗 待联调 |
| 19 | `addUser` | `/user/add` | POST | `{ userName, name, deptId, roleId, phone?, email? }` | 新增用户 | 🔗 待联调 |
| 20 | `updateUser` | `/user/update` | POST | `{ userId, userName, name, deptId, roleId, phone?, email? }` | 编辑用户 | 🔗 待联调 |
| 21 | `deleteUser` | `/user/delete` | POST | `{ id }` | 删除用户 | 🔗 待联调 |
| 22 | `resetPwd` | `/user/resetPwd` | POST | `{ id }` | 重置密码 | 🔗 待联调 |

### 5. 首页看板（`src/services/task.js` + Dashboard.jsx）

| # | 接口函数 | 后端路径 | 方法 | 请求参数 | 用途 | 状态 |
|---|---------|---------|------|---------|------|------|
| 23 | `getTodoBoardData` | `/dashboard/boardData` | GET | `{ userId, deptId }` | 看板统计数据 | 🔗 待联调 |
| 24 | `getTodoTaskList` | `/task/list` | GET | `{ pageNum, pageSize, ... }` | 最近任务列表 | 🔗 待联调 |

### 6. 项目列表（`src/services/project.js` + ProjectList.jsx）

| # | 接口函数 | 后端路径 | 方法 | 请求参数 | 用途 | 状态 |
|---|---------|---------|------|---------|------|------|
| 25 | `getTodoProjectList` | `/project/list` | GET | `{ pageNum, pageSize, projectName?, deptId? }` | 项目列表 | 🔗 待联调 |
| 26 | `getTodoProject` | `/project/detail` | GET | `{ id }` | 编辑回显 | 🔗 待联调 |
| 27 | `addTodoProject` | `/project/add` | POST | `{ projectName, projectDesc?, deptId, completionRate? }` | 新增项目 | 🔗 待联调 |
| 28 | `updateTodoProject` | `/project/update` | POST | `{ projectId, projectName, projectDesc?, deptId, completionRate? }` | 编辑项目 | 🔗 待联调 |
| 29 | `deleteTodoProject` | `/project/delete` | POST | `{ id }` | 删除项目 | 🔗 待联调 |

### 7. 任务列表（`src/services/task.js` + TaskTodo.jsx）

| # | 接口函数 | 后端路径 | 方法 | 请求参数 | 用途 | 状态 |
|---|---------|---------|------|---------|------|------|
| 30 | `getTodoTaskList` | `/task/list` | GET | `{ pageNum, pageSize, taskContent?, projectId?, status?, deptId?, dateRange? }` | 任务列表 | 🔗 待联调 |
| 31 | `getTodoTask` | `/task/detail` | GET | `{ id }` | 编辑回显 | 🔗 待联调 |
| 32 | `addTodoTask` | `/task/add` | POST | `{ taskContent, projectId, userId?, planFinishTime?, status }` | 新增任务 | 🔗 待联调 |
| 33 | `updateTodoTask` | `/task/update` | POST | `{ taskId, taskContent, projectId, userId?, planFinishTime?, status }` | 编辑任务 | 🔗 待联调 |
| 34 | `deleteTodoTask` | `/task/delete` | POST | `{ id }` | 删除任务 | 🔗 待联调 |

### 8. 共用接口汇总（去重后）

| 接口 | 后端路径 | 被引用模块 |
|------|---------|-----------|
| `getDeptTree` | `/dept/tree` | 认证、部门、用户、项目 |
| `getRoleList` | `/role/list` | 角色、用户 |
| `getMenuTree` | `/menu/tree` | 认证、角色 |
| `getUserList` | `/user/list` | 用户、任务 |
| `getTodoProjectList` | `/project/list` | 项目列表、任务列表 |
| `getTodoTaskList` | `/task/list` | 看板、任务列表 |

**共计 34 个接口调用，去重后 26 个独立接口**，其中 6 个接口被多模块共用。API 按模块拆分：`Auth.js`/`Dept.js`/`Role.js`/`User.js`/`Project.js`/`Task.js`。

---

## 七、数据库设计（OceanBase MySQL 模式）

> OceanBase 不支持外键约束，引用完整性由应用层保证。


### 4. 项目表 `project_info`

```sql
CREATE TABLE project_info (
  id              VARCHAR(64)   NOT NULL COMMENT '项目ID',
  project_name    VARCHAR(100)  NOT NULL COMMENT '项目名称',
  project_desc    VARCHAR(500)  DEFAULT NULL COMMENT '项目描述',
  dept_id         VARCHAR(64)   NOT NULL COMMENT '所属部门ID',
  completion_rate INT           DEFAULT 0 COMMENT '完成度百分比',
  status          VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE' COMMENT '状态 ACTIVE/INACTIVE',
  creator_id      VARCHAR(64)   NOT NULL COMMENT '创建人ID',
  create_time     DATETIME      NOT NULL COMMENT '创建时间',
  update_time     DATETIME      NOT NULL COMMENT '更新时间',
  PRIMARY KEY (id),
  KEY idx_dept_id (dept_id),
  KEY idx_creator_id (creator_id),
  KEY idx_create_time (create_time)
) COMMENT='项目表';
```

### 5. 任务表 `task_info`

```sql
CREATE TABLE task_info (
  id                VARCHAR(64)   NOT NULL COMMENT '任务ID',
  task_content      VARCHAR(500)  NOT NULL COMMENT '任务内容',
  project_id        VARCHAR(64)   NOT NULL COMMENT '所属项目ID',
  user_id           VARCHAR(64)   NOT NULL COMMENT '负责人ID',
  status            VARCHAR(20)   NOT NULL DEFAULT '0' COMMENT '状态 0待开始/1进行中/2已完成/3已取消',
  plan_finish_time  DATE          DEFAULT NULL COMMENT '计划完成时间',
  finish_time       DATETIME      DEFAULT NULL COMMENT '实际完成时间',
  creator_id        VARCHAR(64)   NOT NULL COMMENT '创建人ID',
  create_time       DATETIME      NOT NULL COMMENT '创建时间',
  update_time       DATETIME      NOT NULL COMMENT '更新时间',
  PRIMARY KEY (id),
  KEY idx_project_id (project_id),
  KEY idx_user_id (user_id),
  KEY idx_status (status),
  KEY idx_create_time (create_time)
) COMMENT='任务表';
```





---

## 八、看板聚合SQL（按角色数据范围）

**参数说明**：`:userId` 当前用户ID、`:deptId` 当前部门ID、`:roleId` 当前角色ID

### 8.1 项目总数 + 任务状态统计 + 完成率

```sql
SELECT
  (SELECT COUNT(DISTINCT p.id)
   FROM t_project p
   WHERE (
     (:roleId = 'ROLE_ADMIN')
     OR (:roleId = 'ROLE_DEPT_MANAGER' AND p.dept_id IN (
           SELECT id FROM t_dept WHERE id = :deptId
           UNION ALL
           SELECT id FROM t_dept WHERE parent_id = :deptId
         ))
     OR (:roleId = 'ROLE_GROUP_LEADER' AND p.dept_id = :deptId)
     OR (:roleId = 'ROLE_EMPLOYEE' AND p.id IN (
           SELECT project_id FROM t_task WHERE user_id = :userId
         ))
   )
  ) AS project_count,
  SUM(CASE WHEN t.status = '0' THEN 1 ELSE 0 END) AS pending_task,
  SUM(CASE WHEN t.status = '1' THEN 1 ELSE 0 END) AS in_progress_task,
  SUM(CASE WHEN t.status = '2' THEN 1 ELSE 0 END) AS completed_task,
  SUM(CASE WHEN t.status = '3' THEN 1 ELSE 0 END) AS cancelled_task,
  ROUND(SUM(CASE WHEN t.status = '2' THEN 1 ELSE 0 END) * 100.0
        / NULLIF(COUNT(t.id), 0), 1) AS completion_rate
FROM t_project p
LEFT JOIN t_task t ON p.id = t.project_id
WHERE (
  (:roleId = 'ROLE_ADMIN')
  OR (:roleId = 'ROLE_DEPT_MANAGER' AND p.dept_id IN (
        SELECT id FROM t_dept WHERE id = :deptId
        UNION ALL
        SELECT id FROM t_dept WHERE parent_id = :deptId
      ))
  OR (:roleId = 'ROLE_GROUP_LEADER' AND p.dept_id = :deptId)
  OR (:roleId = 'ROLE_EMPLOYEE' AND p.id IN (
        SELECT project_id FROM t_task WHERE user_id = :userId
      ))
);
```

### 8.2 各项目任务分布

```sql
SELECT
  p.project_name,
  COUNT(t.id) AS task_count,
  SUM(CASE WHEN t.status = '2' THEN 1 ELSE 0 END) AS completed_count
FROM t_project p
LEFT JOIN t_task t ON p.id = t.project_id
WHERE (
  (:roleId = 'ROLE_ADMIN')
  OR (:roleId = 'ROLE_DEPT_MANAGER' AND p.dept_id IN (
        SELECT id FROM t_dept WHERE id = :deptId
        UNION ALL
        SELECT id FROM t_dept WHERE parent_id = :deptId
      ))
  OR (:roleId = 'ROLE_GROUP_LEADER' AND p.dept_id = :deptId)
  OR (:roleId = 'ROLE_EMPLOYEE' AND p.id IN (
        SELECT project_id FROM t_task WHERE user_id = :userId
      ))
)
GROUP BY p.id, p.project_name
ORDER BY task_count DESC;
```

### 8.3 近7天趋势（新增 + 完成）

```sql
-- 近7天新增任务趋势
SELECT DATE(t.create_time) AS date, COUNT(*) AS count
FROM t_task t
INNER JOIN t_project p ON t.project_id = p.id
WHERE t.create_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
  AND (
    (:roleId = 'ROLE_ADMIN')
    OR (:roleId = 'ROLE_DEPT_MANAGER' AND p.dept_id IN (
          SELECT id FROM t_dept WHERE id = :deptId
          UNION ALL
          SELECT id FROM t_dept WHERE parent_id = :deptId
        ))
    OR (:roleId = 'ROLE_GROUP_LEADER' AND t.user_id IN (
          SELECT user_id FROM t_user WHERE dept_id = :deptId
        ))
    OR (:roleId = 'ROLE_EMPLOYEE' AND t.user_id = :userId)
  )
GROUP BY DATE(t.create_time)
ORDER BY date;

-- 近7天完成任务趋势
SELECT DATE(t.finish_time) AS date, COUNT(*) AS count
FROM t_task t
INNER JOIN t_project p ON t.project_id = p.id
WHERE t.status = '2'
  AND t.finish_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
  AND (
    (:roleId = 'ROLE_ADMIN')
    OR (:roleId = 'ROLE_DEPT_MANAGER' AND p.dept_id IN (
          SELECT id FROM t_dept WHERE id = :deptId
          UNION ALL
          SELECT id FROM t_dept WHERE parent_id = :deptId
        ))
    OR (:roleId = 'ROLE_GROUP_LEADER' AND t.user_id IN (
          SELECT user_id FROM t_user WHERE dept_id = :deptId
        ))
    OR (:roleId = 'ROLE_EMPLOYEE' AND t.user_id = :userId)
  )
GROUP BY DATE(t.finish_time)
ORDER BY date;
```

### 8.4 最近更新任务列表

```sql
SELECT
  t.id AS task_id,
  t.task_content AS task_name,
  p.project_name,
  u.name AS assignee_name,
  t.plan_finish_time,
  t.status
FROM t_task t
INNER JOIN t_project p ON t.project_id = p.id
INNER JOIN t_user u ON t.user_id = u.id
WHERE (
  (:roleId = 'ROLE_ADMIN')
  OR (:roleId = 'ROLE_DEPT_MANAGER' AND p.dept_id IN (
        SELECT id FROM t_dept WHERE id = :deptId
        UNION ALL
        SELECT id FROM t_dept WHERE parent_id = :deptId
      ))
  OR (:roleId = 'ROLE_GROUP_LEADER' AND t.user_id IN (
        SELECT user_id FROM t_user WHERE dept_id = :deptId
      ))
  OR (:roleId = 'ROLE_EMPLOYEE' AND t.user_id = :userId)
)
ORDER BY t.update_time DESC
LIMIT :pageSize OFFSET (:pageNum - 1) * :pageSize;
```

---

## 九、项目规约

### 1. 命名规范
- **组件文件**：大驼峰 `.jsx`（例：`TaskTodo.jsx`、`DeptTree.jsx`）
- **Service/Model/Util/Hook文件**：大驼峰 `.js`（例：`Auth.js`、`Dashboard.js`、`UseResizable.js`、`Status.js`）
- **类型定义文件**：大驼峰 `.ts`（例：`Auth.ts`、`Common.ts`、`Board.ts`）
- **样式文件**：跟随组件大驼峰（例：`Dashboard.less`）
- **目录命名**：小驼峰，模块目录用复数（例：`routes`、`components`、`services`）
- **`index.js` / `config.js`**：保持小写

### 2. 组件规范
- 纯展示组件用函数组件
- 有状态业务组件使用 `useState`/`useEffect`
- 公共可复用组件放 `src/components/`
- 页面级组件放 `src/routes/对应模块/`
- 页面交互逻辑（状态管理、API调用、事件处理）放 `src/models/`，组件只负责UI渲染
- 左侧树形页面（Dept/ProjectList/TaskTodo）首次进入默认选中第一个根节点，并显示部门名称（非ID）
- 个人中心弹窗：Header用户下拉菜单 → 个人信息展示（账号/姓名/手机/邮箱/部门）+ 修改密码
- 页面切换时通过 `PageCache` 保留状态（筛选条件、分页、选中节点、部门名称等），刷新页面自动清除
- 新模块开发流程：Service → Types → Mock → Model → Route → Config → Layout（详见第十一节）

### 3. 样式规范
- 全局样式收敛到 `src/index.less`（body、#root、.login-*、.resize-layout）
- 布局样式在 `src/layouts/index.less`
- 页面样式跟随组件目录，使用 `.less` 格式

### 4. 路由规范
- `HashRouter` 配置在 `src/App.jsx`
- `AuthProvider` 包裹整个应用
- `PrivateRoute` 统一做登录+权限拦截
- 路由+权限配置集中管理：`src/routes/config.js`

### 5. API规范
- 所有接口在 `src/services/` 目录中按模块定义（Auth.js/Dept.js/Role.js/User.js/Project.js/Task.js）
- `src/services/index.js` 负责axios实例配置、拦截器和统一导出（re-export）
- TypeScript类型定义在 `src/services/types/` 目录，按模块拆分（common/auth/dept/role/user/project/task/menu/board.ts）
- Mock数据在 `src/services/Mock.js`，Mock开关由 `process.env.REACT_APP_MOCK` 控制
- 请求拦截：自动添加 `Authorization: Bearer <token>` 请求头
- 响应拦截：提取 `RSP_BODY.resultData`；401未授权去重跳转登录

### 6. 状态管理
- 组件内 `useState` 管理本地状态
- 认证状态：`src/common/Auth.js` 的 `AuthProvider` + `useAuth`
- 页面交互逻辑：`src/models/` 目录，每个模块一个文件（自定义Hook）
  - `Dashboard.js` → 首页看板数据、图表配置、最近任务
  - `TaskTodo.js` → 任务CRUD、权限判断、部门筛选（含selectedDeptName）、分页
  - `ProjectList.js` → 项目CRUD、部门树选择（含selectedDeptName）、分页
  - `Dept.js` → 部门树管理、层级CRUD、搜索重置、部门名称显示
  - `Role.js` → 角色CRUD、菜单授权、分页
  - `User.js` → 用户CRUD、部门筛选、重置密码、分页
- 公共Hook：`src/common/hooks/UseTableCrud.js`（CRUD状态管理）、`src/common/hooks/UseResizable.js`（拖拽宽度）
- 公共工具：`src/utils/Date.js`（parseTime）、`src/utils/Status.js`（statusMap/getStatusTag）
- 页面缓存：`src/common/PageCache.js`（模块级Map缓存，切换页面时保留状态，刷新页面自动清除）

---

## 十、联调指南

### 后端接口约定

| 项目 | 说明 |
|------|------|
| **基础路径** | 需在 `src/services/index.js` 中配置 `BASE_URL` |
| **请求格式** | `{ REQ_HEAD: { TRANS_PROCESS, TRAN_ID }, REQ_BODY: {...} }` |
| **响应格式** | `{ RSP_BODY: { resultData }, RSP_HEAD: { TRAN_SUCCESS } }` |
| **认证** | Header: `Authorization: Bearer <token>` |
| **错误码** | 401：未登录/token过期；其他：业务错误 |
| **时间格式** | Java `toString()` 格式（如 `Mon Jul 14 10:30:00 CST 2025`），前端 `parseTime()` 自动转换 |

### 联调步骤

1. 修改 `webpack.config.js`：`MOCK_MODE = false`
2. 配置后端 `BASE_URL`（`src/services/index.js`）
3. 启动后端服务
4. 启动前端：`npm run dev`
5. 测试各模块接口连通性

### Mock模式说明

Mock数据基于 `D:\VSCode\MyCode\JS\bbip\run.har` 录制，包含：
- 登录/获取用户信息/部门树/菜单树（`src/services/Mock.js`）
- 项目列表（2条记录）
- 任务列表（10条记录）
- 看板统计数据
- 角色/用户列表
- 部门列表

Mock模式下 `REACT_APP_MOCK = true`，响应拦截器直接返回 `response.data.result`，绕过后端响应格式处理。

---

## 十一、前端模块开发指南

以新增一个**岗位管理**模块为例，演示完整的开发流程。

### 第一步：定义 Service 层（API 调用）

在 `src/services/` 目录新建模块文件，按 RESTful 风格定义接口：

```js
// src/services/Post.js
import { service, MOCK_MODE } from './index'
import { mockApi } from './Mock'

const mockRequest = (url, options) => mockApi(url, options)

export const getPostList = (data) => MOCK_MODE ? mockRequest('/system/post/list.do', { method: 'POST', data }) : service.post('/queryPostList.do', data || {})
export const addPost = (data) => MOCK_MODE ? mockRequest('/system/post/add.do', { method: 'POST', data }) : service.post('/createPost.do', data)
export const updatePost = (data) => MOCK_MODE ? mockRequest('/system/post/update.do', { method: 'POST', data }) : service.post('/modifyPost.do', data)
export const deletePost = (data) => MOCK_MODE ? mockRequest('/system/post/delete.do', { method: 'POST', data: { id: data.id } }) : service.post('/removePost.do', { id: data.id })
```

在 `src/services/index.js` 中添加 re-export：

```js
export * from './Post'
```

### 第二步：定义 TypeScript 类型（可选）

在 `src/services/types/` 目录新建类型定义文件：

```ts
// src/services/types/Post.ts
import { PaginationParams, PaginatedRowsResponse, EmptyResponse, IdParam } from './Common'

export interface PostInfo {
  postId: string
  postName: string
  postCode: string
  status: string
  createTime: string
}

export type GetPostListFn = (params: PaginationParams & { postName?: string }) => Promise<PaginatedRowsResponse<PostInfo>>
export type AddPostFn = (data: Omit<PostInfo, 'postId' | 'createTime'>) => Promise<EmptyResponse>
export type UpdatePostFn = (data: Partial<PostInfo> & IdParam) => Promise<EmptyResponse>
export type DeletePostFn = (data: IdParam) => Promise<EmptyResponse>
```

在 `src/services/types/index.ts` 中添加 re-export：

```ts
export * from './Post'
```

### 第三步：编写 Mock 数据

在 `src/services/Mock.js` 中添加 Mock 数据和路由处理：

```js
// 1. 在 mockData 对象中添加数据
posts: {
  total: 2,
  rows: [
    { postId: 'POST_001', postName: '项目经理', postCode: 'PM', status: 'ACTIVE', createTime: '...' },
    { postId: 'POST_002', postName: '开发工程师', postCode: 'DEV', status: 'ACTIVE', createTime: '...' }
  ]
}

// 2. 在 mockApi 函数中添加路由
} else if (url.includes('/queryPostList') || url.includes('/system/post/list')) {
  result = mockData.posts
} else if (url.includes('/createPost') || url.includes('/modifyPost') || url.includes('/removePost') || url.includes('/system/post')) {
  result = {}
}
```

### 第四步：编写 Model 层（页面交互逻辑）

在 `src/models/` 目录新建自定义 Hook，封装所有状态管理和业务逻辑：

```js
// src/models/Post.js
import { useState, useEffect, useRef } from 'react'
import { Form, message } from 'antd'
import { getPostList, addPost, updatePost, deletePost } from '../services'
import { getPageCache, setPageCache } from '../common/PageCache'

const CACHE_KEY = 'post'

const usePostModel = () => {
  const cached = getPageCache(CACHE_KEY)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增岗位')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState(cached?.pagination ?? { current: 1, pageSize: 10, total: 0 })
  const paginationRef = useRef(pagination)
  paginationRef.current = pagination

  useEffect(() => {
    fetchData()
    return () => setPageCache(CACHE_KEY, { pagination })
  }, [])

  const fetchData = async (params = {}) => {
    setLoading(true)
    try {
      const { current, pageSize } = paginationRef.current
      const res = await getPostList({ pageNum: params.pageNum || current, pageSize: params.pageSize || pageSize, ...params })
      setData(res.rows || [])
      setPagination(prev => ({ ...prev, total: res.total || 0, ...params }))
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleAdd = () => { /* ... */ }
  const handleEdit = (record) => { /* ... */ }
  const handleDelete = async (id) => { /* ... */ }
  const handleSubmit = async () => { /* ... */ }
  const handlePageChange = (page, size) => { /* ... */ }

  return {
    loading, data, modalVisible, modalTitle, submitLoading, editingId, form, pagination,
    handleAdd, handleEdit, handleDelete, handleSubmit, handlePageChange, setModalVisible
  }
}

export default usePostModel
```

### 第五步：编写页面组件

在 `src/routes/` 目录新建页面组件，只负责 UI 渲染，所有逻辑从 Model 获取：

```jsx
// src/routes/system/Post.jsx
import React from 'react'
import { Card, Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import usePostModel from '../../models/Post'

const Post = () => {
  const model = usePostModel()
  const { loading, data, modalVisible, modalTitle, submitLoading, editingId, form, pagination } = model

  const columns = [
    { title: '岗位名称', dataIndex: 'postName', key: 'postName' },
    { title: '岗位编码', dataIndex: 'postCode', key: 'postCode' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => model.handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => model.handleDelete(record.postId)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <Button type="primary" icon={<PlusOutlined />} onClick={model.handleAdd} style={{ marginBottom: 16 }}>新增岗位</Button>
      <Table columns={columns} dataSource={data} rowKey="postId" loading={loading}
        pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, onChange: model.handlePageChange }} />
      <Modal title={modalTitle} open={modalVisible} onOk={model.handleSubmit} onCancel={() => model.setModalVisible(false)} confirmLoading={submitLoading}>
        <Form form={form} layout="vertical">
          <Form.Item name="postId" hidden><Input /></Form.Item>
          <Form.Item name="postName" label="岗位名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="postCode" label="岗位编码" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Post
```

### 第六步：注册路由

在 `src/routes/config.js` 中添加路由配置：

```js
import Post from './system/Post'

// 在 routeConfig 数组中添加：
{ path: '/system/post', component: Post },

// 在 routePermissionMap 中添加：
'/system/post': ['ROLE_ADMIN'],
```

### 第七步：添加菜单

在 `src/layouts/index.jsx` 的 `defaultMenuData` 中添加菜单项：

```js
{ key: 'post', icon: <TeamOutlined />, title: '岗位管理', path: '/system/post', sortOrder: 4 }
```

### 开发流程总结

```
Service (API) → Types (TS) → Mock (数据) → Model (逻辑) → Route (UI) → Config (路由) → Layout (菜单)
```

| 步骤 | 目录 | 文件 | 职责 |
|------|------|------|------|
| 1 | `src/services/` | `Post.js` | 定义接口调用函数 |
| 2 | `src/services/types/` | `Post.ts` | TypeScript 类型定义 |
| 3 | `src/services/` | `Mock.js` | Mock 数据和路由 |
| 4 | `src/models/` | `Post.js` | 页面交互逻辑（自定义Hook） |
| 5 | `src/routes/system/` | `Post.jsx` | 页面 UI 组件 |
| 6 | `src/routes/` | `config.js` | 路由 + 权限配置 |
| 7 | `src/layouts/` | `index.jsx` | 菜单配置 |

---

## 十二、文件命名约定总结

| 文件类型 | 命名风格 | 扩展名 | 示例 |
|---------|---------|--------|------|
| React组件 | PascalCase | `.jsx` | `TaskTodo.jsx`、`DeptTree.jsx` |
| Service层 | PascalCase | `.js` | `Auth.js`、`Dept.js`、`Project.js` |
| Model层 | PascalCase | `.js` | `Dashboard.js`、`TaskTodo.js` |
| 工具函数 | PascalCase | `.js` | `Date.js`、`Status.js` |
| 自定义Hook | PascalCase | `.js` | `UseResizable.js`、`UseTableCrud.js` |
| 类型定义 | PascalCase | `.ts` | `Auth.ts`、`Common.ts`、`Board.ts` |
| 样式文件 | PascalCase | `.less` | `Dashboard.less`、`index.less` |
| 配置文件 | 小写 | `.js` | `index.js`、`config.js` |
import Dashboard from './Dashboard'
import Login from './Login'
import NotFound from './NotFound'
import ProjectList from './task/ProjectList'
import ProjectBoard from './task/ProjectBoard'
import TaskTodo from './task/TaskTodo'
import Dept from './system/Dept'
import Role from './system/Role'
import User from './system/User'

export const routeConfig = [
  { path: '/login', component: Login, exact: true },
  { path: '/404', component: NotFound, exact: true },
  { path: '/dashboard', component: Dashboard, exact: true },
  { path: '/project/list', component: ProjectList, exact: true },
  { path: '/project/board', component: ProjectBoard, exact: true },
  { path: '/task/todo', component: TaskTodo, exact: true },
  { path: '/system/dept', component: Dept, exact: true },
  { path: '/system/role', component: Role, exact: true },
  { path: '/system/user', component: User, exact: true },
]

export const routePermissionMap = {
  '/system/user': ['ROLE_ADMIN'],
  '/system/role': ['ROLE_ADMIN'],
  '/system/dept': ['ROLE_ADMIN', 'ROLE_DEPT_MANAGER'],
}

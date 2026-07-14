import { EmptyResponse } from './Common'

// ========== 请求参数 ==========

export interface LoginRequest {
  username: string
  password: string
}

// ========== 响应数据 ==========

export interface LoginSession {
  sessionId: string
  userId: string
  username: string
  name: string
  orgId: string
  orgName: string | null
  extFld: Record<string, unknown>
}

export interface LoginResponse {
  session: LoginSession
  user: UserInfo
}

export interface UserInfo {
  id: string
  username: string
  password: string
  nickName: string
  name: string
  phone: string
  email: string
  avatar: string
  sex: string
  deptId: string
  parentId: string
  roleId: string
  postIds: string
  status: string
  loginIp: string
  loginDate: string | null
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  remark: string
  deptName: string | null
  roleName: string | null
  menuIds: MenuItem[] | null
}

export interface UserInfoResponse {
  sessionId: string
  userId: string
  username: string
  userName: string
  nickName: string
  name: string
  orgId: string
  orgName: string | null
  extFld: Record<string, unknown>
}

export interface MenuItem {
  id: string
  menuName: string
  parentId: string
  menuLevel: number
  menuPath: string
  sortOrder: number
  children?: MenuItem[] | null
}

// ========== 接口函数签名 ==========

export type LoginFn = (data: LoginRequest) => Promise<LoginResponse>
export type LogoutFn = () => Promise<EmptyResponse>
export type GetUserInfoFn = () => Promise<UserInfoResponse>

import { PaginationParams, PaginatedRowsResponse, EmptyResponse, IdParam } from './Common'

// ========== 请求参数 ==========

export interface UserListParams extends PaginationParams {
  deptId?: string | null
  username?: string
  phone?: string
}

export interface AddUserRequest {
  userName: string
  name: string
  deptId: string
  roleId: string
  phone?: string
  email?: string
}

export interface UpdateUserRequest {
  userId?: string
  userName: string
  name: string
  deptId: string
  roleId: string
  phone?: string
  email?: string
}

export interface DeleteUserRequest {
  id: string
}

export type ResetPwdRequest = IdParam

// ========== 响应数据 ==========

export interface UserListItem {
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
  menuIds: null
}

export type UserListResponse = PaginatedRowsResponse<UserListItem>

// ========== 接口函数签名 ==========

export type GetUserListFn = (data: UserListParams) => Promise<UserListResponse>
export type AddUserFn = (data: AddUserRequest) => Promise<EmptyResponse>
export type UpdateUserFn = (data: UpdateUserRequest) => Promise<EmptyResponse>
export type DeleteUserFn = (data: DeleteUserRequest) => Promise<EmptyResponse>
export type ResetPwdFn = (data: ResetPwdRequest) => Promise<EmptyResponse>

import { PaginationParams, PaginatedRowsResponse, EmptyResponse, IdParam } from './Common'
import { MenuItem } from './Auth'

// ========== 请求参数 ==========

export interface RoleListParams extends PaginationParams {
  // 无额外参数
}

export interface AddRoleRequest {
  roleName: string
  status: string
}

export interface UpdateRoleRequest {
  id: string
  roleName: string
  status: string
}

export type DeleteRoleRequest = IdParam

export interface AuthRoleMenuGetRequest {
  roleId: string
  action: 'get'
}

export interface AuthRoleMenuSaveRequest {
  roleId: string
  menuIds: string[]
}

// ========== 响应数据 ==========

export interface RoleListItem {
  id: string
  roleName: string
  dataScope: string
  dataScopeDeptIds: string
  status: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  remark: string
}

export interface MenuTreeNode {
  id: string
  menuName: string
  parentId: string
  menuLevel: number
  menuPath: string
  sortOrder: number
  createBy: string | null
  createTime: string
  updateBy: string | null
  updateTime: string
  remark: string | null
  children?: MenuTreeNode[] | null
}

export type RoleListResponse = PaginatedRowsResponse<RoleListItem>
export type MenuTreeResponse = MenuTreeNode[]
export type AuthRoleMenuResponse = { data: string[] }

// ========== 接口函数签名 ==========

export type GetRoleListFn = (data: RoleListParams) => Promise<RoleListResponse>
export type AddRoleFn = (data: AddRoleRequest) => Promise<EmptyResponse>
export type UpdateRoleFn = (data: UpdateRoleRequest) => Promise<EmptyResponse>
export type DeleteRoleFn = (data: DeleteRoleRequest) => Promise<EmptyResponse>
export type AuthRoleMenuFn = (data: AuthRoleMenuGetRequest | AuthRoleMenuSaveRequest) => Promise<AuthRoleMenuResponse | EmptyResponse>
export type GetMenuTreeFn = (data: Record<string, never>) => Promise<MenuTreeResponse>

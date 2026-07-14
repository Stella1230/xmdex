import { PaginationParams, PaginatedContentResponse, PaginatedRowsResponse, EmptyResponse } from './Common'

// ========== 请求参数 ==========

export interface DeptTreeParams {
  // 空对象
}

export interface DeptListParams extends PaginationParams {
  deptName?: string
  rootId?: string | null
}

export interface DeptDetailParams {
  id: string
}

export interface AddDeptRequest {
  deptName: string
  parentId: string
  remark?: string
}

export interface UpdateDeptRequest {
  id: string
  deptName: string
  remark?: string
}

export interface DeleteDeptRequest {
  id: string
}

// ========== 响应数据 ==========

export interface DeptTreeNode {
  id: string
  deptName: string
  parentId: string
  rootId: string
  deptLevel: number
  status: string
  createBy: string | null
  createTime: string
  updateBy: string | null
  updateTime: string
  remark: string | null
  children?: DeptTreeNode[] | null
}

export type DeptListItem = Omit<DeptTreeNode, 'children'>

export type DeptListResponse = PaginatedContentResponse<DeptListItem>
export type DeptTreeResponse = DeptTreeNode[]
export type DeptDetailResponse = DeptListItem

// ========== 接口函数签名 ==========

export type GetDeptTreeFn = (data: DeptTreeParams) => Promise<DeptTreeResponse>
export type GetDeptListFn = (data: DeptListParams) => Promise<DeptListResponse>
export type GetDeptDetailFn = (data: DeptDetailParams) => Promise<DeptDetailResponse>
export type AddDeptFn = (data: AddDeptRequest) => Promise<EmptyResponse>
export type UpdateDeptFn = (data: UpdateDeptRequest) => Promise<EmptyResponse>
export type DeleteDeptFn = (data: DeleteDeptRequest) => Promise<EmptyResponse>

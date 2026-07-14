// 通用分页请求参数
export interface PaginationParams {
  pageNum: number
  pageSize: number
}

// 通用分页响应（rows格式）
export interface PaginatedRowsResponse<T> {
  rows: T[]
  total: number
}

// 通用分页响应（content格式）
export interface PaginatedContentResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  last: boolean
  number: number
  size: number
  sort: { sorted: boolean; unsorted: boolean; empty: boolean }
  numberOfElements: number
  first: boolean
  empty: boolean
}

// 通用树节点
export interface TreeNode {
  id: string
  children?: TreeNode[] | null
}

// 通用操作响应
export type EmptyResponse = Record<string, never>

// 通用ID参数
export interface IdParam {
  id: string
}

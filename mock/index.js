// ✅ REAP规范适配 - 目录调整：mock数据拆分到根目录 mock/ 下
// 本目录保留原有mock数据，按模块拆分便于维护

// 统一导出mock接口（兼容原有引用方式）
// 实际数据仍从 src/api/mock.js 导入，保持现有逻辑不变
export { default as mockApi } from '../src/api/mock'

// 模块化mock数据（待扩展）
// - mock/user.js      - 用户相关mock
// - mock/department.js - 部门相关mock
// - mock/todo.js      - 待办相关mock
// - mock/project.js   - 项目相关mock
// - mock/role.js      - 角色相关mock
// - mock/menu.js      - 菜单相关mock
// - mock/dict.js      - 字典相关mock
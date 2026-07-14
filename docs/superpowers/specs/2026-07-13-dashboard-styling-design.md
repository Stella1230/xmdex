# Dashboard 样式设计方案

## 设计决策

| 决策项 | 选择 | 原因 |
|--------|------|------|
| 布局风格 | 分区式 | 用背景色/分割线区分区域，层次清晰 |
| 配色方案 | 深色导航+渐变指标卡 | 专业稳重，指标卡视觉突出 |
| 图表布局 | 主次分明 | 左大右小，突出核心数据 |
| 待办列表 | 紧凑表格+状态标签 | 快速浏览，信息密度高 |
| 样式实现 | 内联样式+共享常量 | 与现有代码风格一致，改动最小 |

## 整体布局

```
┌─────────────────────────────────────────────────────────┐
│ [深色背景欢迎区]                                          │
│ 上午好，王部门 [部门负责人]              [本周|本月] [刷新] │
├─────────────────────────────────────────────────────────┤
│ [渐变指标卡区域 - 浅灰背景 #f0f2f5]                        │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                │
│ │ 项目 │ │ 待办 │ │ 进行 │ │ 逾期 │ │ 完成 │  (管理员5张)  │
│ │ 总数 │ │ 总数 │ │  中  │ │     │ │  率  │                │
│ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                │
├───────────────────────────────┬─────────────────────────┤
│ [主图表 - 50%]                │ [次图表 - 50%]           │
│ 状态分布饼图                   │ 部门对比柱状图            │
│ (圆环图，带图例)               │ (柱状图，带坐标轴)        │
├───────────────────────────────┴─────────────────────────┤
│ [项目完成度 - 100%]                                      │
│ 项目A ████████░░ 80%  项目B ██████░░░░ 60%              │
├─────────────────────────────────────────────────────────┤
│ [最近待办表格 - 紧凑模式]                                  │
│ 任务标题 | 所属项目 | 负责人 | 状态 | 操作                   │
│ ─────────────────────────────────────────────────────── │
│ 完成登录页  Xmdex系统  张三  [进行中] [查看][编辑]           │
└─────────────────────────────────────────────────────────┘
```

## 指标卡渐变色定义

```javascript
const gradientColors = {
  ROLE_ADMIN: [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',  // 项目总数 - 紫蓝
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',  // 待办总数 - 粉红
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',  // 进行中 - 蓝青
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',  // 已逾期 - 粉黄
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',  // 已完成 - 青粉
  ],
  ROLE_DEPT_MANAGER: [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ],
  ROLE_GROUP_LEADER: [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ],
  ROLE_EMPLOYEE: [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ]
}
```

## 欢迎区样式

- 背景：`linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)` 深色渐变
- 文字：白色，字号20px，font-weight 600
- 角色标签：Ant Design Tag，颜色对应角色
- 右侧按钮组：白色边框按钮

## 指标卡样式

- 背景：渐变色（见上表）
- 文字：白色
- 数值：32px，font-weight 700
- 标题：14px，opacity 0.9
- 趋势：12px，上箭头绿色/下箭头红色
- 图标：右侧，48px，opacity 0.3
- 圆角：8px
- 阴影：`0 4px 12px rgba(0,0,0,0.15)`
- 悬停：`transform: translateY(-2px)` 微上浮

## 图表区样式

- 背景：白色卡片
- 标题：16px，font-weight 600， borderBottom: 1px solid #f0f0f0
- 高度：320px
- 主图表：左侧 12col (50%)
- 次图表：右侧 12col (50%)
- 图表间距：gutter 24px

## 待办表格样式

- 卡片：白色背景，无额外边框
- 表格：紧凑模式 `size="small"`
- 表头：`#fafafa` 背景，font-weight 600
- 状态标签：
  - 待开始：`color="default"`
  - 进行中：`color="processing"` 蓝色
  - 已完成：`color="success"` 绿色
  - 已逾期：`color="error"` 红色
- 操作按钮：`type="link" size="small"` 图标+文字
- 行悬停：`#e6f7ff` 背景色

## 文件变更清单

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/components/dashboard/DashboardHeader.jsx` | 修改 | 深色背景渐变，白色文字，按钮样式 |
| `src/components/dashboard/StatCards.jsx` | 修改 | 渐变背景卡片，白色文字，悬停动画 |
| `src/components/dashboard/ChartSection.jsx` | 修改 | 主次布局(50/50)，卡片标题样式 |
| `src/components/dashboard/RecentTaskTable.jsx` | 修改 | 紧凑表格，状态标签颜色，行悬停 |
| `src/routes/Dashboard.jsx` | 修改 | 区分式布局结构，背景色分区 |

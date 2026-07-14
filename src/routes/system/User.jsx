import React from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Space, Popconfirm, TreeSelect } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined, SyncOutlined } from '@ant-design/icons'
import { parseTime } from '../../utils/Date'
import DeptTree from '../../components/DeptTree'
import useResizable from '../../common/hooks/UseResizable'
import useUserModel from '../../models/User'

const { Option } = Select

const User = () => {
  const model = useUserModel()
  const {
    loading, data, selectedDept, selectedDeptName, roles, deptMap,
    modalVisible, modalTitle, submitLoading, editingId, form, searchForm,
    pagination, deptTreeData,
    handleDeptSelect, handleSearch, handleReset, handleAdd, handleEdit,
    handleDelete, handleResetPwd, handleSubmit, handlePageChange
  } = model

  const [leftWidth, onResizeStart] = useResizable(240)

  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username', width: 120, ellipsis: true },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 100, ellipsis: true },
    { title: '部门', dataIndex: 'deptId', key: 'deptId', width: 150, render: v => deptMap[v] || v || '-', ellipsis: true },
    { title: '手机', dataIndex: 'phone', key: 'phone', width: 130 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160, render: v => parseTime(v) },
    {
      title: '操作', key: 'action', width: 220,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认重置密码?" onConfirm={() => handleResetPwd(record)}>
            <Button type="link" size="small" icon={<KeyOutlined />}>重置密码</Button>
          </Popconfirm>
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className="resize-layout">
      <div className="resize-left" style={{ width: leftWidth }}>
        <DeptTree
          onSelect={handleDeptSelect}
          selectedKeys={selectedDept ? [selectedDept] : []}
        />
      </div>
      <div
        className="resize-bar"
        onMouseDown={onResizeStart}
        onMouseEnter={(e) => e.currentTarget.style.background = '#1890ff'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#e8e8e8'}
      />
      <div className="resize-right">
        <Card>
          <Form form={searchForm} layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
            <Form.Item name="username" label="用户名"><Input placeholder="请输入" /></Form.Item>
            <Form.Item name="phone" label="手机"><Input placeholder="请输入" /></Form.Item>
            <Form.Item><Button type="primary" htmlType="submit">查询</Button></Form.Item>
            <Form.Item><Button icon={<SyncOutlined />} onClick={handleReset}>重置</Button></Form.Item>
          </Form>
          {selectedDeptName && (
            <div style={{ marginBottom: 16, color: '#666' }}>
              当前选择部门： {selectedDeptName}
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增用户</Button>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: handlePageChange
            }}
          />
        </Card>
      </div>
      <Modal title={modalTitle} open={modalVisible} onOk={handleSubmit} onCancel={() => model.setModalVisible(false)} confirmLoading={submitLoading} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="userId" hidden><Input /></Form.Item>
          <Form.Item name="userName" label="用户名" rules={[{ required: true }]}>
            <Input disabled={!!editingId} />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}><Input /></Form.Item>
          <Form.Item name="deptId" label="所属部门" rules={[{ required: true, message: '请选择部门' }]}>
            <TreeSelect treeData={deptTreeData} placeholder="请选择部门" allowClear treeDefaultExpandAll style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色" allowClear>
              {roles.filter(r => r.id !== 'ROLE_ADMIN').map(r => <Option key={r.id} value={r.id}>{r.roleName}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="手机"><Input /></Form.Item>
          <Form.Item name="email" label="邮箱"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default User

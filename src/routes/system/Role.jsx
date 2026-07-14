import React from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Space, Popconfirm, Tag, Tree, Spin } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons'
import { parseTime } from '../../utils/Date'
import useRoleModel from '../../models/Role'

const { Option } = Select

const Role = () => {
  const model = useRoleModel()
  const {
    loading, data, menuTree, modalVisible, authModalVisible, modalTitle,
    submitLoading, form, currentRole, checkedMenuKeys,
    expandedMenuKeys, menuLoading, pagination,
    handleAdd, handleEdit, handleDelete, handleAuth, handleAuthSubmit,
    handleSubmit, handlePageChange
  } = model

  const columns = [
    { title: '角色ID', dataIndex: 'id', key: 'id', width: 120 },
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName', width: 150 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: v => <Tag color={v === 'ACTIVE' ? 'green' : 'red'}>{v === 'ACTIVE' ? '启用' : '停用'}</Tag> },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160, render: v => parseTime(v) },
    {
      title: '操作', key: 'action', width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<SettingOutlined />} onClick={() => handleAuth(record)}>授权</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增角色</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, onChange: handlePageChange }}
      />
      <Modal title={modalTitle} open={modalVisible} onOk={handleSubmit} onCancel={() => model.setModalVisible(false)} confirmLoading={submitLoading} width={500}>
        <Form form={form} layout="vertical">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="roleName" label="角色名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="status" label="状态" initialValue="ACTIVE">
            <Select><Option value="ACTIVE">启用</Option><Option value="INACTIVE">停用</Option></Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`菜单权限 - ${currentRole?.roleName || ''}`}
        open={authModalVisible}
        onOk={handleAuthSubmit}
        onCancel={() => { model.setAuthModalVisible(false); model.setCurrentRole(null); model.setCheckedMenuKeys([]) }}
        confirmLoading={submitLoading}
        width={500}
      >
        <Spin spinning={menuLoading}>
          <Tree
            checkable
            defaultExpandAll
            expandedKeys={expandedMenuKeys}
            onExpand={(keys) => model.setExpandedMenuKeys(keys)}
            checkedKeys={checkedMenuKeys}
            onCheck={(keys) => model.setCheckedMenuKeys(keys)}
            treeData={menuTree}
          />
        </Spin>
      </Modal>
    </Card>
  )
}

export default Role

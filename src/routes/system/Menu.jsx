import React, { useState, useEffect } from 'react'
import { Card, Tree, Button, Modal, Form, Input, Select, Space, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getMenuTree } from '../../services'

const { Option } = Select
const { TreeNode } = Tree

const Menu = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增菜单')
  const [form] = Form.useForm()
  const [selectedMenu, setSelectedMenu] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getMenuTree()
      setData(res.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = (menu) => {
    setSelectedMenu(menu)
    setModalTitle('新增菜单')
    form.resetFields()
    form.setFieldsValue({ parentId: menu?.menuId || 0, menuType: 'M', orderNum: 0, visible: '0', perms: '', component: '' })
    setModalVisible(true)
  }

  const handleEdit = (menu) => {
    setSelectedMenu(menu)
    setModalTitle('编辑菜单')
    form.setFieldsValue({ ...menu, parentId: menu.parentId || 0 })
    setModalVisible(true)
  }

  const handleDelete = (id) => {
    message.success('删除成功')
    fetchData()
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    try {
      message.success(modalTitle + '成功')
      setModalVisible(false)
      fetchData()
    } catch (e) {
      console.error(e)
    }
  }

  const renderTreeNodes = (menus) => {
    return menus.map(menu => (
      <TreeNode
        key={menu.menuId}
        title={
          <Space style={{ width: '100%' }}>
            <span>{menu.menuName}</span>
            <Tag>{menu.menuType === 'M' ? '目录' : menu.menuType === 'C' ? '菜单' : '按钮'}</Tag>
            <Button type="link" size="small" icon={<PlusOutlined />} onClick={(e) => { e.stopPropagation(); handleAdd(menu) }} />
            <Button type="link" size="small" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); handleEdit(menu) }} />
          </Space>
        }
      >
        {menu.children ? renderTreeNodes(menu.children) : null}
      </TreeNode>
    ))
  }

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd(null)}>新增顶级菜单</Button>
      </div>
      <Tree showIcon defaultExpandAll>
        {renderTreeNodes(data)}
      </Tree>
      <Modal title={modalTitle} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="menuId" hidden><Input /></Form.Item>
          <Form.Item name="parentId" hidden><Input /></Form.Item>
          <Form.Item name="menuType" label="菜单类型">
            <Select><Option value="M">目录</Option><Option value="C">菜单</Option><Option value="F">按钮</Option></Select>
          </Form.Item>
          <Form.Item name="menuName" label="菜单名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="orderNum" label="显示顺序" initialValue={0}><Input type="number" /></Form.Item>
          <Form.Item name="path" label="路由地址"><Input /></Form.Item>
          <Form.Item name="component" label="组件路径"><Input /></Form.Item>
          <Form.Item name="perms" label="权限标识"><Input /></Form.Item>
          <Form.Item name="visible" label="显示状态">
            <Select><Option value="0">显示</Option><Option value="1">隐藏</Option></Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select><Option value="0">正常</Option><Option value="1">停用</Option></Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Menu
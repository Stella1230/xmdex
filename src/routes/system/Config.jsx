import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getConfigList } from '../../services'

const { Option } = Select

const Config = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增参数')
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (params = {}) => {
    setLoading(true)
    try {
      const res = await getConfigList({ ...pagination, ...params })
      setData(res.rows || [])
      setPagination({ ...pagination, total: res.total })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setModalTitle('新增参数')
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setModalTitle('编辑参数')
    form.setFieldsValue(record)
    setModalVisible(true)
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

  const columns = [
    { title: '参数ID', dataIndex: 'configId', key: 'configId', width: 80 },
    { title: '参数名称', dataIndex: 'configName', key: 'configName', width: 200 },
    { title: '参数键名', dataIndex: 'configKey', key: 'configKey', width: 200 },
    { title: '参数值', dataIndex: 'configValue', key: 'configValue', ellipsis: true },
    { title: '系统内置', dataIndex: 'configType', key: 'configType', width: 100, render: v => <Tag color={v === 'Y' ? 'blue' : 'default'}>{v === 'Y' ? '是' : '否'}</Tag> },
    { title: '备注', dataIndex: 'remark', key: 'remark', width: 150 },
    {
      title: '操作', key: 'action', width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除?">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增参数</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="configId"
        loading={loading}
        pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total }}
      />
      <Modal title={modalTitle} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={500}>
        <Form form={form} layout="vertical">
          <Form.Item name="configId" hidden><Input /></Form.Item>
          <Form.Item name="configName" label="参数名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="configKey" label="参数键名" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="configValue" label="参数值" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="configType" label="系统内置" initialValue="N">
            <Select><Option value="Y">是</Option><Option value="N">否</Option></Select>
          </Form.Item>
          <Form.Item name="remark" label="备注"><Input.TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Config
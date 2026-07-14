import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag, Tabs } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getDictTypeList } from '../../services'

const { Option } = Select
const { TabPane } = Tabs

const Dict = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增字典')
  const [form] = Form.useForm()
  const [activeKey, setActiveKey] = useState('type')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (params = {}) => {
    setLoading(true)
    try {
      const res = await getDictTypeList({ ...pagination, ...params })
      setData(res.rows || [])
      setPagination({ ...pagination, total: res.total })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setModalTitle('新增字典类型')
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setModalTitle('编辑字典类型')
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
    { title: '字典ID', dataIndex: 'dictId', key: 'dictId', width: 80 },
    { title: '字典名称', dataIndex: 'dictName', key: 'dictName', width: 150 },
    { title: '字典类型', dataIndex: 'dictType', key: 'dictType', width: 150 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: v => <Tag color={v === '0' ? 'green' : 'red'}>{v === '0' ? '正常' : '停用'}</Tag> },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    {
      title: '操作', key: 'action', width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => setActiveKey('data')}>字典数据</Button>
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
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <TabPane tab="字典类型" key="type">
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增字典类型</Button>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="dictId"
            loading={loading}
            pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total }}
          />
        </TabPane>
        <TabPane tab="字典数据" key="data">
          <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
            请先在左侧选择字典类型
          </div>
        </TabPane>
      </Tabs>
      <Modal title={modalTitle} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={500}>
        <Form form={form} layout="vertical">
          <Form.Item name="dictId" hidden><Input /></Form.Item>
          <Form.Item name="dictName" label="字典名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="dictType" label="字典类型" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="status" label="状态" initialValue="0">
            <Select><Option value="0">正常</Option><Option value="1">停用</Option></Select>
          </Form.Item>
          <Form.Item name="remark" label="备注"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Dict
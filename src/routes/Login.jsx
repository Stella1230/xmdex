import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { login as loginApi } from '../services'
import { useAuth } from '../common/Auth'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const history = useHistory()

  useEffect(() => {
    if (auth.isLogin) {
      history.replace('/dashboard')
    }
  }, [auth.isLogin])

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await loginApi(values)
      const session = res.session || {}
      const user = res.user || {}
      auth.login({
        token: session.sessionId,
        userId: user.id,
        deptId: user.deptId,
        roleId: user.roleId,
        menus: user.menuIds || []
      })
      message.success('登录成功')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <div className="login-title">Xmdex管理系统</div>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login

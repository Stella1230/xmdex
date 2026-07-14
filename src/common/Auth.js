import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'))
  const [deptId, setDeptId] = useState(() => localStorage.getItem('deptId'))
  const [roleId, setRoleId] = useState(() => localStorage.getItem('roleId'))
  const [menus, setMenus] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('menus') || '[]')
    } catch { return [] }
  })

  const isLogin = !!token

  const login = useCallback((data) => {
    const { token: newToken, userId: uid, deptId: did, roleId: rid, menus: menuIds } = data
    localStorage.setItem('token', newToken)
    localStorage.setItem('userId', uid)
    localStorage.setItem('deptId', did)
    localStorage.setItem('roleId', rid)
    localStorage.setItem('menus', JSON.stringify(menuIds || []))
    setToken(newToken)
    setUserId(uid)
    setDeptId(did)
    setRoleId(rid)
    setMenus(menuIds || [])
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('deptId')
    localStorage.removeItem('roleId')
    localStorage.removeItem('menus')
    setToken(null)
    setUserId(null)
    setDeptId(null)
    setRoleId(null)
    setMenus([])
  }, [])

  const hasPermission = useCallback((requiredKeys) => {
    if (roleId === 'ROLE_ADMIN') return true
    if (!requiredKeys || requiredKeys.length === 0) return true
    return requiredKeys.some(key => menus.includes(key))
  }, [roleId, menus])

  return (
    <AuthContext.Provider value={{ token, userId, deptId, roleId, menus, isLogin, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

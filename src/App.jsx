import React from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import { AuthProvider, useAuth } from './common/Auth'
import BasicLayout from './layouts'
import { routeConfig, routePermissionMap } from './routes/config'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isLogin, hasPermission } = useAuth()
  if (!isLogin) return <Redirect to="/login" />
  const requiredRoles = routePermissionMap[rest.path]
  if (requiredRoles && !hasPermission(requiredRoles)) {
    return <Redirect to="/dashboard" />
  }
  return (
    <BasicLayout>
      <Component />
    </BasicLayout>
  )
}

const AppRoutes = () => {
  const { isLogin } = useAuth()
  return (
    <Switch>
      <Route exact path="/" render={() => <Redirect to={isLogin ? '/dashboard' : '/login'} />} />
      {routeConfig.map(({ path, component: Component, exact }) => (
        <Route key={path} exact={exact} path={path} render={(props) => {
          if (path === '/login' || path === '/404') return <Component {...props} />
          return <PrivateRoute component={Component} {...props} />
        }} />
      ))}
      <Route render={() => isLogin ? <Redirect to="/dashboard" /> : <Redirect to="/login" />} />
    </Switch>
  )
}

const App = () => (
  <HashRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </HashRouter>
)

export default App

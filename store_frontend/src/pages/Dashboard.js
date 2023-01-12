import React from 'react'
import UserContext from '../contexts/UserContext'

const Dashboard = () => {
  const {user} = React.useContext(UserContext)
  return (
    <div>Hello, {user?.firstName + ' ' + user?.lastName}</div>
  )
}

export default Dashboard
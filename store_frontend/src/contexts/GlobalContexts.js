import React from 'react'
import { UserProvider } from './UserContext'
import { ThemeProvider } from './ThemeContext'

const GlobalContexts = ({children}) => {
  return (
    <UserProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </UserProvider>
  )
}

export default GlobalContexts
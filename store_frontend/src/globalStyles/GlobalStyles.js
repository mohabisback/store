import React from 'react'
import { ThemeProvider } from 'styled-components'
import Reset from './ResetStyle.js'
import ThemeContext from '../contexts/ThemeContext.js'
import defaultTheme from './themes/defaultTheme'

const GlobalStyles = ({children}) => {
  const {theme, } = React.useContext(ThemeContext)
  return (
    <ThemeProvider theme={theme || defaultTheme}> 
      <Reset/>
      {children}
    </ThemeProvider>
  )
}

export default GlobalStyles
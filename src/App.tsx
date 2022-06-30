import React from 'react';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './context/auth';
import { NavContextProvider } from './context/nav';
import Routes from './routes';
import DefaultTheme from './themes/default_theme'

import { GlobalStyle } from './styles'

const App: React.FC = () => {

  return (
    <ThemeProvider theme={DefaultTheme}>
      <AuthProvider>
        <NavContextProvider>
          <Routes />
          <GlobalStyle />
        </NavContextProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;
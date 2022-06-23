import React from 'react';
import { AuthProvider } from './context/auth';
import { NavContextProvider } from './context/nav';
import Routes from './routes';

import { GlobalStyle } from './styles'

const App: React.FC = () => {

  return (
    <AuthProvider>
      <NavContextProvider>
        <Routes />
        <GlobalStyle />
      </NavContextProvider>
    </AuthProvider> 
  )
}

export default App;
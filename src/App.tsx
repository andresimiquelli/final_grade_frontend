import React from 'react';
import { AuthProvider } from './context/auth';
import Routes from './routes';

import { GlobalStyle } from './styles'

const App: React.FC = () => {

  return (
    <AuthProvider>
      <Routes />
      <GlobalStyle />
    </AuthProvider> 
  )
}

export default App;
import React from 'react';
import { AuthProvider } from './context/auth';

const App: React.FC = () => {

  return (
    <AuthProvider>
      <h1>React vcersion { React.version }</h1>
    </AuthProvider>
  )
}

export default App;
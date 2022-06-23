import React, { createContext, useContext, useState } from 'react';

interface AuthContextProps {
    token: string;
    setToken(token: string): void;
}

interface AuthContextProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

const AuthProvider: React.FC<AuthContextProviderProps> = ({ children }) => {

    const[token,setToken] = useState('')

    return (
        <AuthContext.Provider value={{token,setToken}}>
           { children }
        </AuthContext.Provider>
    )
}

function useAuth(): AuthContextProps {
    const context = useContext(AuthContext)
    return context
}

export { AuthProvider, useAuth }
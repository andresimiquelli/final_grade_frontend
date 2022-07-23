import React, { createContext, useContext, useState } from 'react';
import tokenType from '../services/apiTypes/Token';

interface AuthContextProps {
    token: string;
    setAuth(token: tokenType): void;
}

interface AuthContextProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

const AuthProvider: React.FC<AuthContextProviderProps> = ({ children }) => {

    const[token,setToken] = useState('')
    const[expiresIn,setExpiresIn] = useState(0)

    function setAuth(tokenObject: tokenType) {
        setToken(tokenObject.access_token)
        setExpiresIn(tokenObject.expires_in);
    }

    return (
        <AuthContext.Provider value={{token,setAuth}}>
           { children }
        </AuthContext.Provider>
    )
}

function useAuth(): AuthContextProps {
    const context = useContext(AuthContext)
    return context
}

export { AuthProvider, useAuth }
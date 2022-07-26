import React, { createContext, useContext, useEffect, useState } from 'react';
import tokenType from '../services/apiTypes/Token';
import userType from '../services/apiTypes/User';
import { tokenIsValid } from '../utils/tokenIsValid';
import { useApi } from '../services/api'

interface AuthContextProps {
    token: string;
    tokenUpdatedAt: number;
    tokenExpiresIn: number;
    setAuth(token: tokenType): void;
    currentUser: userType | undefined;
    setCurrentUser(user: userType): void;
}

interface AuthContextProviderProps {
    children: React.ReactNode
}

type storedTokenType = {
    token: tokenType;
    updated_at: number;
}

const storagePrefix = "finalGrade_"

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

const AuthProvider: React.FC<AuthContextProviderProps> = ({ children }) => {

    const api = useApi()

    const[token,setToken] = useState('')
    const[tokenExpiresIn,setTokenExpiresIn] = useState(0)
    const[tokenUpdatedAt,setTokenUpdatedAt] = useState(0)
    const[currentUser,setCurrentUser] = useState<userType | undefined>()

    const[timer,setTimer] = useState<NodeJS.Timeout>()

    useEffect(() => {
        const storedToken = getStoredToken()
        if(storedToken) {
            if(tokenIsValid(storedToken.token.expires_in, storedToken.updated_at)) {
                setToken(storedToken.token.access_token)
                setTokenExpiresIn(storedToken.token.expires_in)
                setTokenUpdatedAt(storedToken.updated_at)
                refreshSchedule(storedToken.token)
            }
        }

        return () => {clearTimeout(timer)}
    },[])

    function setAuth(tokenObject: tokenType) {
        const filledToken  = fillTokenStates(tokenObject)
        storeToken(filledToken)
        refreshSchedule(filledToken.token)
    }

    function fillTokenStates(tokenObject: tokenType): storedTokenType {
        setToken(tokenObject.access_token)
        setTokenExpiresIn(tokenObject.expires_in)

        const updateTime = new Date().getTime()
        setTokenUpdatedAt(updateTime)

        return {token: tokenObject, updated_at: updateTime} as storedTokenType
    }

    function storeToken(filledToken: storedTokenType) {
        localStorage.setItem(storagePrefix+'token', JSON.stringify(filledToken))
    }

    function getStoredToken(): storedTokenType | null {
        const stored = localStorage.getItem(storagePrefix+'token')
        if(stored)
            return JSON.parse(stored) as storedTokenType

        return null
    }

    function refreshToken(lToken: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${lToken}`
        api.post('/auth/refresh')
        .then(
            response => {
                const filledToken = fillTokenStates(response.data)
                storeToken(filledToken)
                refreshSchedule(filledToken.token)
                console.log("Refreshed token.")
            }
        )
    }

    function refreshSchedule(lToken: tokenType) {
        setTimer(() => setTimeout(() => refreshToken(lToken.access_token), (lToken.expires_in-60)*1000))
    }

    return (
        <AuthContext.Provider 
            value={{
                token,
                setAuth,
                tokenUpdatedAt,
                tokenExpiresIn,
                currentUser,
                setCurrentUser}}>
           { children }
        </AuthContext.Provider>
    )
}

function useAuth(): AuthContextProps {
    const context = useContext(AuthContext)
    return context
}

export { AuthProvider, useAuth }
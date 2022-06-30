import React, { createContext, useContext, useState } from "react";

interface NavContextProps {
    selectedMenu: string;
    setSelectedMenu(value: string): void;
}

interface NavContextProviderProps {
    children: React.ReactNode
}

const NavContext = createContext<NavContextProps>({} as NavContextProps)

const NavContextProvider: React.FC<NavContextProviderProps> = ({ children }) => {

    const[selectedMenu, setSelectedMenu] = useState('')

    return  (
        <NavContext.Provider value={{selectedMenu,setSelectedMenu}}>
            { children }
        </NavContext.Provider>
    )
}

function useNav(): NavContextProps {
    const context = useContext(NavContext)
    return context;
}

const MenuKeys = {
    DASHBOARD: 'dashboard',
    STUDENTS: 'students',
    TEACHERS: 'teachers',
    COURSES: 'courses',
    SUBJECTS: 'subjects',
    CLASSES: 'classes',
    PACKS: 'packs',
    USERS: 'users'
}

export {NavContextProvider, useNav, MenuKeys}
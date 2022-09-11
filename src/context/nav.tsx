import React, { createContext, useContext, useState } from "react";
import ContextMessager, {MessageType} from "../components/ContextMessager";
import errorType from "../services/apiTypes/Error";
import { getMessage } from "../utils/errorHandler";

interface NavContextProps {
    selectedMenu: string;
    setSelectedMenu(value: string): void;
    contentTitle: string;
    setContentTitle(value: string): void;
    addErrorMessage(error: errorType): void;
    addSuccesMessage(content: string, title?: string): void;
}

interface NavContextProviderProps {
    children: React.ReactNode
}

const NavContext = createContext<NavContextProps>({} as NavContextProps)

const NavContextProvider: React.FC<NavContextProviderProps> = ({ children }) => {

    const[selectedMenu, setSelectedMenu] = useState('')
    const[contentTitle, setContentTitle] = useState('')
    const[messages, setMessages] = useState<MessageType[]>([])

    function closeMessage(index: number) {
        setMessages(current => current.filter((_,i) => i!==index))
    }

    function addErrorMessage(error: errorType) {        
        setMessages([...messages, {title: 'Ops! :(', content: getMessage(error.type), variant: 'danger'} as MessageType])
    }

    function addSuccesMessage(content: string, title?: string) {
        setMessages([...messages, {title, content, variant: 'success'} as MessageType])
    }

    return  (
        <NavContext.Provider value={{selectedMenu,setSelectedMenu,contentTitle,setContentTitle,addErrorMessage,addSuccesMessage}}>
            { children }
            <ContextMessager messages={messages} onClose={closeMessage}/>
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
    USERS: 'users',
    ENROLLMENTS: 'enrollments',
    LESSONS: 'lessons',
    EVALUATIONS: 'evaluations'
}

export {NavContextProvider, useNav, MenuKeys}
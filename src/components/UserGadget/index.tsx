import React, { useState } from 'react';
import { useAuth } from '../../context/auth';
import ClickAwayListener from 'react-click-away-listener';
import { useApi } from '../../services/api';

import { Avatar, Container, Menu, Name } from './styles';

const UserGadget: React.FC = () => {

    const { currentUser, token, updateUser, setAuth } = useAuth()
    const api = useApi(token)

    const[showMenu,setShowMenu] = useState(false)

    function logout() {
        api.post('/auth/logout')
        .finally(() => setAuth(null))
    }

    return (
        <Container onClick={() => setShowMenu(true)}>
            <Avatar>{ currentUser&& currentUser.name.charAt(0).toUpperCase()}</Avatar>
            <Name>{currentUser?.name}</Name>
            {
                showMenu&&
                <ClickAwayListener onClickAway={() => setShowMenu(false)}>
                    <Menu>
                        <ul>
                            <li>Minha conta</li>
                            <li onClick={logout}>Sair</li>
                        </ul>
                    </Menu>
                </ClickAwayListener> 
            }
            
        </Container>
    );
}

export default UserGadget;
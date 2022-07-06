import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import ContentToolBar from '../../components/ContentToolBar';
import userType, { UserType } from '../../services/apiTypes/User';
import { FaSearch } from 'react-icons/fa';
import FrameModal from '../../components/FrameModal';
import DefaultTable from '../../components/DefaultTable';


interface UserFrameProps {
    show?: boolean;
    handleSelect?(user: userType): void;
    handleClose?(): void;
}

const UserFrame: React.FC<UserFrameProps> = ({ show, handleSelect, handleClose }) => {

    const[users,setUsers] = useState([] as userType[])

    function handleShowResult(lUsers: userType[]) {
        setUsers(lUsers)
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                    </tr>
                </thead>
                <tbody>
                {
                    users.map(user => 
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                        </tr>
                    )
                }
                </tbody>
            </DefaultTable>
        )
    }

    return (
        <FrameModal<userType> 
            show={true} 
            title="Selecionar usuário"
            searchField='name'
            searchOperator='like'
            searchPlaceholder='Buscar usuário'
            endpoint='/users'
            handleShowResult={handleShowResult}
            handleClose={handleClose}
            filterParams={[{field: "type", value: UserType.PROF.value+""}]}>
                { showTable() }
        </FrameModal>
    );
}

export default UserFrame;
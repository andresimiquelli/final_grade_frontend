import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import ContentToolBar from '../../components/ContentToolBar';
import DefaultTable from '../../components/DefaultTable';
import LoadingContainer from '../../components/LodingContainer';
import { useNav, MenuKeys } from '../../context/nav';
import { useApi } from '../../services/api';
import userType, { UserType } from '../../services/apiTypes/User';
import { HiPlus } from 'react-icons/hi';
import { FaUserEdit, FaTrash } from 'react-icons/fa';
import UserForm from './UserForm';

import { TagType } from './styles'

const Users: React.FC = () => {

    const { setSelectedMenu, setContentTitle } = useNav()
    const api = useApi()

    const[isLoading,setIsLoading] = useState(false)
    const[users,setUsers] = useState([] as userType[])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<userType | undefined>(undefined)

    useEffect(() => {
        setSelectedMenu(MenuKeys.USERS)
        setContentTitle('Usuários')
        loadUsers()
    },[])

    function loadUsers() {
        setIsLoading(true)
        api.get('/users')
        .then(
            response => {
                setUsers(response.data.data)
                setTotalPages(response.data.last_page)
                setCurrentPage(response.data.current_page)
            }
        )
        .finally(
            () => setIsLoading(false)
        )
    }

    function editUser(user: userType) {
        setSelected(user)
        setShowForm(true)
    }

    function closeForm() {
        setShowForm(false)
        setSelected(undefined)
    }

    function handleSave(user: userType) {
        setShowForm(false)
        let nUsers = users.map(user => user)
        nUsers.push(user)
        setUsers(nUsers)
    }

    function handleUpdate(nUser: userType) {
        setShowForm(false)
        let nUsers = users.map(user => {
            return user.id === nUser.id?
                nUser : user
        })
        setUsers(nUsers)
    }

    function showTagType(type: number) {

        let text = 'No type'

        switch(type) {
            case UserType.ADMIN.value:
                text = UserType.ADMIN.label
                break
            case UserType.COORD.value:
                text = UserType.COORD.label
                break
            case UserType.PROF.value:
                text = UserType.PROF.label
                break
        }

        return (
            <TagType>
                { text }
            </TagType>
        )
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Tipo</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(user => <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{ showTagType(user.type)}</td>
                            <td>
                                <Button variant='secondary'
                                    onClick={() => editUser(user)}>
                                        <FaUserEdit />
                                </Button> &nbsp;
                                <Button variant='secondary'><FaTrash /></Button>
                            </td>
                        </tr>)
                    }
                </tbody>
            </DefaultTable>
        )
    }

    return (
       <Container className='position-relative'>
            <LoadingContainer show={isLoading} />
            <UserForm 
                show={showForm} 
                handleClose={closeForm}
                user={selected}
                handleSave={handleSave}
                handleUpdate={handleUpdate}/>
            <ContentToolBar>
                <div>
                    &nbsp;
                </div>
                <div>
                    <Button onClick={() => setShowForm(true)}><HiPlus /></Button>
                </div>
            </ContentToolBar>
            <Row>
                <Col className='p-0'>
                    { showTable() }
                </Col>
            </Row>
       </Container>
    );
}

export default Users;
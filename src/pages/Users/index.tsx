import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row, Button, Form } from 'react-bootstrap';
import ContentToolBar from '../../components/ContentToolBar';
import DefaultTable from '../../components/DefaultTable';
import LoadingContainer from '../../components/LodingContainer';
import { useNav, MenuKeys } from '../../context/nav';
import { useApi } from '../../services/api';
import { useAuth } from '../../context/auth';
import userType, { UserType } from '../../services/apiTypes/User';
import { HiPlus, HiSearch } from 'react-icons/hi';
import { FaUserEdit, FaTrash, FaLink } from 'react-icons/fa';
import UserForm from './UserForm';

import { TagType } from './styles'
import ButtonColumn from '../../components/ButtonColumn';
import PaginatorDefault from '../../components/PaginatorDefault';

const Users: React.FC = () => {

    const { setSelectedMenu, setContentTitle } = useNav()
    const { token } = useAuth()
    const api = useApi(token)
    const navigate = useNavigate()

    const[isLoading,setIsLoading] = useState(false)
    const[users,setUsers] = useState([] as userType[])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

    const[searchName,setSearchName] = useState('')
    const[searchEmail,setSearchEmail] = useState('')

    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<userType | undefined>(undefined)

    useEffect(() => {
        setSelectedMenu(MenuKeys.USERS)
        setContentTitle('Usuários')
        loadUsers()
    },[])

    function getFilters(page: number) {
        let filters = '?'
        let fields = ''

        if(searchName.trim().length>0)
            fields += "filters=name:like:"+encodeURI("%"+searchName+"%")

        if(searchEmail.trim().length>0) {
            fields += fields.length>0? ',' : 'filters='
            fields += 'email:like:'+encodeURI("%"+searchEmail+"%")
        }

        filters += fields

        filters += filters.length>1? '&' : ''

        filters += 'page='+page

        return filters
    }

    function loadUsers(page: number = 1) {
        setIsLoading(true)
        api.get('/users'+getFilters(page))
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
                                <ButtonColumn>
                                    {
                                        user.type === UserType.PROF.value&& 
                                            <button className='mr-2' onClick={() => navigate(`/users/${user.id}/assignments`) }>
                                                <FaLink /> <span>Vínculos</span>
                                            </button>
                                    } 
                                    <button className='secondary'
                                        onClick={() => editUser(user)}>
                                            <FaUserEdit />
                                    </button> &nbsp;
                                    <button className='secondary'><FaTrash /></button>
                                    
                                </ButtonColumn>
                            </td>
                        </tr>)
                    }
                </tbody>
            </DefaultTable>
        )
    }

    function search(e: React.FormEvent) {
        e.preventDefault()
        loadUsers()
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
                <Form onSubmit={search}>
                    <Row>
                        <Col sm="5">
                            <Form.Control 
                                type='text'
                                placeholder='Buscar nome'
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}/>
                        </Col>
                        <Col sm="6">
                            <Form.Control 
                                type='email'
                                placeholder='Buscar e-mail'
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}/>
                        </Col>
                        <Col sm="1">
                            <Button
                                type='submit'>
                                <HiSearch />
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <PaginatorDefault
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={(page) => loadUsers(page)} />
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
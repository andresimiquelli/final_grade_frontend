import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DefaultTable from '../../components/DefaultTable';
import LoadingContainer from '../../components/LodingContainer';
import { useNav, MenuKeys } from '../../context/nav';
import { useApi } from '../../services/api';
import userType from '../../services/apiTypes/User';

const Users: React.FC = () => {

    const { setSelectedMenu, setContentTitle } = useNav()
    const api = useApi()

    const[isLoading,setIsLoading] = useState(false)
    const[users,setUsers] = useState([] as userType[])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

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

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(user => <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.type}</td>
                        </tr>)
                    }
                </tbody>
            </DefaultTable>
        )
    }

    return (
       <Container>
            <Row>
                <Col className='p-0'>
                    {isLoading? <LoadingContainer /> : showTable() }
                </Col>
            </Row>
       </Container>
    );
}

export default Users;
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import LoadingContainer from '../../components/LodingContainer';
import { useNav, MenuKeys } from '../../context/nav';
import { useApi } from '../../services/api';
import userType from '../../services/apiTypes/User';

const Users: React.FC = () => {

    const { setSelectedMenu } = useNav()
    const api = useApi()

    const[isLoading,setIsLoading] = useState(false)
    const[users,setUsers] = useState([] as userType[])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

    useEffect(() => {
        setSelectedMenu(MenuKeys.USERS)
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
                console.log(response.data)
            }
        )
        .finally(
            () => setIsLoading(false)
        )
    }

    return (
       <Container>
            <Row>
                <Col>
                    <LoadingContainer />
                </Col>
            </Row>
       </Container>
    );
}

export default Users;
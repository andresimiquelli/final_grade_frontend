import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useAuth } from '../../context/auth';
import { useApi } from '../../services/api';
import teacherType from '../../services/apiTypes/Teacher';
import { useNav, MenuKeys } from '../../context/nav';
import DefaultTable from '../../components/DefaultTable';
import { FaTrash } from 'react-icons/fa'
import { HiPlus } from 'react-icons/hi';
import LoadingContainer from '../../components/LodingContainer';
import ContentToolBar from '../../components/ContentToolBar';
import UserFrame from '../../frames/UserFrame';
import userType from '../../services/apiTypes/User';
import ButtonColumn from '../../components/ButtonColumn';

const Teachers: React.FC = () => {

    const { token } = useAuth()
    const api = useApi(token)
    const { setSelectedMenu, setContentTitle } = useNav()

    const[teachers,setTeachers] = useState([] as teacherType[])
    const[currentPage,setCurrentPage] = useState(1)
    const[totalPages,setTotalPages] = useState(1)

    const[isLoading,setIsloading] = useState(false)
    const[showFrameUsers,setShowFrameUsers] = useState(false)

    useEffect(() => {
        setContentTitle('Professores')
        setSelectedMenu(MenuKeys.TEACHERS)
        loadTeachers()
    },[])

    function loadTeachers() {
        setIsloading(true)
        
        api.get('/teachers')
        .then(
            response => {
                setTeachers(response.data.data)
                setTotalPages(response.data.last_page)
                setCurrentPage(response.data.current_page)
            }
        )
        .finally(
            () => setIsloading(false)
        )
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                {
                    teachers.map(teacher => 
                        <tr key={teacher.id}>
                            <td>{teacher.user.name}</td>
                            <td>{teacher.user.email}</td>
                            <td>
                                <ButtonColumn>
                                   <button className='secondary'><FaTrash /></button> 
                                </ButtonColumn>
                            </td>
                        </tr>
                    )
                }
                    
                </tbody>
            </DefaultTable>
        )
    }

    function create(user: userType) {
        setIsloading(true)
        setShowFrameUsers(false)
        let data = { user_id: user.id}
        api.post('/teachers',data)
        .then(
            response => {
                setTeachers([response.data,...teachers])
            }
        )
        .finally(
            () => setIsloading(false)
        )
    }

    return (
        <Container className='position-relative'>
            <LoadingContainer show={isLoading}/>
            <UserFrame 
                show={showFrameUsers} 
                handleClose={() => setShowFrameUsers(false)}
                handleSelect={create}/>
            <ContentToolBar>
                <div>&nbsp;</div>
                <div>
                    <Button onClick={() => setShowFrameUsers(true)}><HiPlus /></Button>
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

export default Teachers;
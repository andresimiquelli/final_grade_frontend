import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { useNav, MenuKeys } from '../../context/nav';
import userAssignmentType from '../../services/apiTypes/UserAssignment';
import { useApi } from '../../services/api';
import { useAuth } from '../../context/auth';

import { CardWrapper, Card } from './styles';
import LoadingContainer from '../../components/LodingContainer';
import ButtonColumn from '../../components/ButtonColumn';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { TbChecklist } from 'react-icons/tb';
import { GoTasklist } from 'react-icons/go';
import PaginatorDefault from '../../components/PaginatorDefault';
import ContentToolBar from '../../components/ContentToolBar';
import { UserType } from '../../services/apiTypes/User';
import { extractError } from '../../utils/errorHandler';

const MyClasses: React.FC = () => {

    const { token, currentUser } = useAuth()
    const api = useApi(token)
    const { setSelectedMenu, setContentTitle, addErrorMessage } = useNav()
    const navigate = useNavigate()

    const[isLoading,setIsLoading] = useState(false)
    const[assignments,setAssignments] = useState<userAssignmentType[]>([])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

    useEffect(() => {
        setContentTitle('Minhas turmas')
        setSelectedMenu(MenuKeys.DASHBOARD)
        loadAssignments()
    },[])

    function loadAssignments(page: number = 1) {
        setIsLoading(true)
        api.get(`/users/${currentUser?.id}/assignments?page=${page}`)
        .then(
            response => {
                setAssignments(response.data.data)
                setTotalPages(response.data.last_page)
                setCurrentPage(response.data.current_page)
            }
        )
        .finally(() => setIsLoading(false))
        .catch( error => addErrorMessage(extractError(error)))
    }

    return (
        <Container fluid>
            <Row>
                <Col className='p-0'>
                    <LoadingContainer show={isLoading}/>
                    <ContentToolBar variant={currentUser?.type === UserType.PROF.value? 'bordered' : 'default'}>
                        <div></div>
                        <div>
                            <PaginatorDefault 
                                currentPage={currentPage} 
                                totalPages={totalPages}
                                onChange={loadAssignments} />
                        </div>
                        <div></div>
                    </ContentToolBar>
                    <CardWrapper>
                        {
                            assignments.map(assignment => 
                                <Card key={assignment.id}>
                                    <div className='anchor-area'>
                                        <h3 className='card-title'>{assignment.cclass.name}</h3>
                                        <h4 className='card-subtitle'>{assignment.subject.subject.name}</h4>
                                    </div>
                                    <div>
                                        <ButtonColumn>
                                            <button onClick={() => navigate(`/lessons/${assignment.cclass.id}/${assignment.subject.id}`)}>
                                                <FaChalkboardTeacher />
                                                <span>Aulas</span>
                                            </button>
                                            <button onClick={() => navigate(`/evaluations/${assignment.cclass.id}/${assignment.subject.id}`)}>
                                                <TbChecklist />
                                                <span>Avaliações</span>
                                            </button>
                                            <button onClick={() => navigate(`finalgrade/${assignment.cclass.id}/${assignment.subject.id}`)}>
                                                <GoTasklist />
                                                <span>Fechamento</span>
                                            </button>
                                        </ButtonColumn>
                                    </div>
                                </Card>
                            )
                        }
                        
                    </CardWrapper>                    
                </Col>
            </Row>
        </Container>
    );
}

export default MyClasses;
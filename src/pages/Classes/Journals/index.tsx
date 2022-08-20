import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import ContentToolBar from '../../../components/ContentToolBar';
import { useAuth } from '../../../context/auth';
import { useNav, MenuKeys } from '../../../context/nav';
import { useApi } from '../../../services/api';
import journalType from '../../../services/apiTypes/Journal';
import DefaultTable from '../../../components/DefaultTable';
import ButtonColumn from '../../../components/ButtonColumn';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { TbChecklist } from 'react-icons/tb';
import LoadingContainer from '../../../components/LodingContainer';

const Journals: React.FC = () => {

    const { class_id } = useParams()
    const { token } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu } = useNav()
    const navigate = useNavigate()

    const[journals,setJournals] = useState<journalType[]>([])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

    const[isLoading,setIsLoading] = useState(false)

    useEffect(() => {
        setContentTitle("Diários de classe")
        setSelectedMenu(MenuKeys.CLASSES)
        if(class_id)
            loadJournals(class_id)
    },[ class_id ])

    function loadJournals(id: string) {
        setIsLoading(true)

        api.get('/journals/'+id)
        .then(
            response => {
                setJournals(response.data.data)
                setCurrentPage(response.data.current_page)
                setTotalPages(response.data.last_page)
            }
        )
        .finally(() => setIsLoading(false))
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Disciplina</th>
                        <th>Módulo</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                {
                    journals.map(journal =>
                        <tr>
                            <td>{journal.subject_name}</td>
                            <td>{journal.pack_module_name}</td>
                            <td>
                                <ButtonColumn>
                                    <button onClick={() => navigate(`/lessons/${class_id}/${journal.subject_id}`)}>
                                        <FaChalkboardTeacher />
                                        <span>Aulas</span>
                                    </button>
                                    <button onClick={() => navigate(`/evaluations/${class_id}/${journal.subject_id}`)}>
                                        <TbChecklist />
                                        <span>Avaliações</span>
                                    </button>
                                </ButtonColumn>
                            </td>
                        </tr> 
                    )
                }                    
                </tbody>
            </DefaultTable>
        )
    }

    return (
        <Container className='position-relative'>
            <LoadingContainer show={isLoading} />
            <ContentToolBar>
                <div></div>
                <div></div>
            </ContentToolBar>
            <Row>
                <Col className='p-0'>
                    { showTable() }
                </Col>
            </Row>
        </Container>
    );
}

export default Journals;
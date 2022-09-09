import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import ContentToolBar from '../../../components/ContentToolBar';
import { useAuth } from '../../../context/auth';
import { useNav, MenuKeys } from '../../../context/nav';
import { useApi } from '../../../services/api';
import journalType, { JournalStatus } from '../../../services/apiTypes/Journal';
import DefaultTable from '../../../components/DefaultTable';
import ButtonColumn from '../../../components/ButtonColumn';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { TbChecklist } from 'react-icons/tb';
import LoadingContainer from '../../../components/LodingContainer';
import PaginatorDefault from '../../../components/PaginatorDefault';
import { GoTasklist } from 'react-icons/go';
import { RiCheckboxBlankCircleLine, RiCheckboxCircleFill } from 'react-icons/ri';

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
            loadJournals()
    },[ class_id ])

    function getFilters(page: number) {
        return '?page='+page
    }

    function loadJournals(page: number = 1) {
        setIsLoading(true)

        api.get('/journals/'+class_id+getFilters(page))
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
                        <th>Status</th>
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
                                {journal.status===JournalStatus.CLOSED? 
                                <><RiCheckboxCircleFill /> Concluído</> : <><RiCheckboxBlankCircleLine /> Aberto</> }
                            </td>
                            <td>
                                <ButtonColumn>
                                    <button onClick={() => navigate(`/lessons/${class_id}/${journal.pack_module_subject_id}`)}>
                                        <FaChalkboardTeacher />
                                        <span>Aulas</span>
                                    </button>
                                    <button onClick={() => navigate(`/evaluations/${class_id}/${journal.pack_module_subject_id}`)}>
                                        <TbChecklist />
                                        <span>Avaliações</span>
                                    </button>
                                    <button onClick={() => navigate(`/finalgrade/${class_id}/${journal.pack_module_subject_id}`)}>
                                        <GoTasklist />
                                        <span>Relatório</span>
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
        <Container className='position-relative' fluid>
            <LoadingContainer show={isLoading} />
            <ContentToolBar>
                <div></div>
                <PaginatorDefault
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={(page) => class_id&& loadJournals(page)} />
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
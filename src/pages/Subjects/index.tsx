import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import subjectType from '../../services/apiTypes/Subject';
import { useAuth } from '../../context/auth';
import { useApi } from '../../services/api';
import { useNav } from '../../context/nav';
import DefaultTable from '../../components/DefaultTable';
import { FaEdit, FaTrash } from 'react-icons/fa'
import { HiPlus } from 'react-icons/hi';
import LoadingContainer from '../../components/LodingContainer';
import ContentToolBar from '../../components/ContentToolBar';

import { SubjectDescription } from './styles'
import SubjectForm from './SubjctForm';

const Subjects: React.FC = () => {

    const { token } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu } = useNav()

    const[subjects,setSubjects] = useState([] as subjectType[])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)
    const[isLoading,setIsLoading] = useState(false)

    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<subjectType | undefined>(undefined)

    useEffect(() => {
        loadSubjects()
        setContentTitle("Disciplinas")
        setSelectedMenu("subjects")
    },[])

    function loadSubjects() {
        setIsLoading(true)

        api.get('/subjects')
        .then(
            response => {
                setSubjects(response.data.data)
                setTotalPages(response.data.last_page)
                setCurrentPage(response.data.current_page)
            }
        )
        .finally(
            () => setIsLoading(false)
        )
    }

    function editSubject(subject: subjectType) {
        setSelected(subject)
        setShowForm(true)
    }

    function handleFormClose() {
        setSelected(undefined)
        setShowForm(false)
    }

    function handleSave(subject: subjectType) {
        setSubjects([...subjects, subject])
    }

    function handleUpdate(nSubject: subjectType) {
        setSubjects(current => current.map(subject => subject.id===nSubject.id? nSubject : subject ))
    }

    function showTable() {
        return(
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Disciplina</th>
                        <th>Descrição</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                {
                    subjects.map(subject => 
                        <tr key={subject.id}>
                            <td>{subject.name}</td>
                            <td>
                                <SubjectDescription>{subject.description}</SubjectDescription>
                            </td>
                            <td>
                                <Button variant='secondary' onClick={() => editSubject(subject)}>
                                    <FaEdit />
                                </Button> &nbsp;
                                <Button variant='secondary'>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>    
                    )
                }
                </tbody>
            </DefaultTable>
        )
    }

    return (
        <Container>
            <LoadingContainer show={isLoading}/>
            <SubjectForm
                show={showForm}
                subject={selected}
                handleClose={handleFormClose}
                handleSave={handleSave}
                handleUpdate={handleUpdate}/>
            <ContentToolBar>
                <div>&nbsp;</div>
                <div>
                    <Button onClick={() => setShowForm(true)}><HiPlus /></Button>
                </div>
            </ContentToolBar>
            <Row >
                <Col className='p-0'>
                    { showTable() }
                </Col>
            </Row>
        </Container>
    );
}

export default Subjects;
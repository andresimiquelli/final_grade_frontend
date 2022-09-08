import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import subjectType from '../../services/apiTypes/Subject';
import { useAuth } from '../../context/auth';
import { useApi } from '../../services/api';
import { useNav } from '../../context/nav';
import DefaultTable from '../../components/DefaultTable';
import { FaEdit, FaTrash } from 'react-icons/fa'
import { HiPlus, HiSearch } from 'react-icons/hi';
import LoadingContainer from '../../components/LodingContainer';
import ContentToolBar from '../../components/ContentToolBar';

import { SubjectDescription } from './styles'
import SubjectForm from './SubjctForm';
import ButtonColumn from '../../components/ButtonColumn';
import PaginatorDefault from '../../components/PaginatorDefault';

const Subjects: React.FC = () => {

    const { token } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu } = useNav()

    const[subjects,setSubjects] = useState([] as subjectType[])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)
    const[isLoading,setIsLoading] = useState(false)
    const[searchName,setSearchName] = useState('')

    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<subjectType | undefined>(undefined)

    useEffect(() => {
        loadSubjects()
        setContentTitle("Disciplinas")
        setSelectedMenu("subjects")
    },[])

    function getFilters(page: number) {
        let filters = '?'

        if(searchName.trim().length>0)
            filters += "filters=name:like:"+encodeURI("%"+searchName+"%")

        filters += filters.length>1? '&' : ''

        filters += 'page='+page

        return filters
    }

    function loadSubjects(page: number = 1) {
        setIsLoading(true)

        api.get('/subjects'+getFilters(page))
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
                                <ButtonColumn>
                                    <button className='secondary' onClick={() => editSubject(subject)}>
                                        <FaEdit />
                                    </button> &nbsp;
                                    <button className='secondary'>
                                        <FaTrash />
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

    function search(e: React.FormEvent) {
        e.preventDefault()
        loadSubjects()
    }

    return (
        <Container fluid>
            <LoadingContainer show={isLoading}/>
            <SubjectForm
                show={showForm}
                subject={selected}
                handleClose={handleFormClose}
                handleSave={handleSave}
                handleUpdate={handleUpdate}/>
            <ContentToolBar>
                <Form onSubmit={search}>
                    <Row>
                        <Col sm="11">
                            <Form.Control 
                                type='text'
                                placeholder='Buscar disciplina'
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}/>
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
                    onChange={(page) => loadSubjects(page)} />
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
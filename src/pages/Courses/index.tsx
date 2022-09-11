import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useAuth } from '../../context/auth';
import { useApi } from '../../services/api';
import { useNav, MenuKeys } from '../../context/nav';
import courseType, { CourseLevels } from '../../services/apiTypes/Course';
import DefaultTable from '../../components/DefaultTable';
import { FaEdit, FaTrash } from 'react-icons/fa';
import LoadingContainer from '../../components/LodingContainer';
import ContentToolBar from '../../components/ContentToolBar';
import { HiPlus, HiSearch } from 'react-icons/hi';
import CourseForm from './CourseForm';
import { courseLevelRederer } from '../../utils/courseLevelRenderer';
import ButtonColumn from '../../components/ButtonColumn';
import PaginatorDefault from '../../components/PaginatorDefault';
import { extractError, getMessage } from '../../utils/errorHandler';
import ConfirmationModal from '../../components/ConfirmationModal';

const Courses: React.FC = () => {

    const { token } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu, addErrorMessage } = useNav()

    const[courses,setCourses] = useState([] as courseType[])
    const[currentPage,setCurrentPage] = useState(1)
    const[totalPages,setTotalPages] = useState(1)
    const[searchName,setSearchName] = useState('')

    const[isLoading,setIsLoading] = useState(false)
    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<courseType | undefined>(undefined)
    const[showDeleteModal,setShowDeleteModal] = useState(false)

    useEffect(() => {
        setSelectedMenu(MenuKeys.COURSES)
        setContentTitle('Cursos')
        loadCourses()
    },[])

    function getFilters(page: number) {
        let filters = '?'

        if(searchName.trim().length>0)
            filters += "filters=name:like:"+encodeURI("%"+searchName+"%")

        filters += filters.length>1? '&' : ''

        filters += 'page='+page

        return filters
    }

    function loadCourses(page: number = 1) {
        setIsLoading(true)
        api.get('/courses'+getFilters(page))
        .then(
            response => {
                setCourses(response.data.data)
                setCurrentPage(response.data.current_page)
                setTotalPages(response.data.last_page)
            }
        )
        .finally(
            () => setIsLoading(false)
        )
        .catch( error => addErrorMessage(extractError(error)))
    }

    function editCourse(course: courseType) {
        setSelected(course)
        setShowForm(true)
    }

    function handleCloseForm() {
        setSelected(undefined)
        setShowForm(false)
    }

    function handleSave(course: courseType) {
        setCourses([...courses, course])
    }

    function handleUpdate(nCourse: courseType) {
        setCourses(current => current.map(course => nCourse.id===course.id? nCourse : course))
    }

    function deleteCourse(course: courseType) {
        setSelected(course)
        setShowDeleteModal(true)
    }

    function deleteCourseConfirm() {
        setShowDeleteModal(false)
        api.delete(`/courses/${selected?.id}`)
        .then(() => setCourses(current => current.filter(course => course.id!==selected?.id)))
        .catch( error => addErrorMessage(extractError(error)))
    }

    function deleteCourseCancel() {
        setShowDeleteModal(false)
        setSelected(undefined)
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Nível</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                {
                    courses.map(course => 
                    <tr key={course.id}>
                        <td>{course.name}</td>
                        <td>{courseLevelRederer(course.level)}</td>
                        <td>
                            <ButtonColumn>
                                <button className='secondary'
                                    onClick={() => editCourse(course)}>
                                        <FaEdit />
                                </button> &nbsp;
                                <button className='secondary' onClick={() => deleteCourse(course)}><FaTrash /></button>
                            </ButtonColumn>
                        </td>
                    </tr> )
                }
                </tbody>
            </DefaultTable>
        )
    }

    function search(e: React.FormEvent) {
        e.preventDefault()
        loadCourses()
    }

    return (
        <Container className='position-relative' fluid>
            <LoadingContainer show={isLoading} />
            <ConfirmationModal
                title='Excluir curso'
                subtitle={`Deseja confirmar a exclusão de ${selected?.name}?`}
                show={showDeleteModal}
                onCancel={deleteCourseCancel}
                onClose={deleteCourseCancel}
                onConfirm={deleteCourseConfirm}> 
                A exclusão não será possível caso haja resgistros vinculados a este.
            </ConfirmationModal>
            <CourseForm 
                show={showForm}
                course={selected}
                handleClose={handleCloseForm}
                handleSave={handleSave}
                handleUpdate={handleUpdate}/>
            <ContentToolBar>
                <Form onSubmit={search}>
                    <Row>
                        <Col sm="11">
                            <Form.Control 
                                type='text'
                                placeholder='Buscar curso'
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
                    onChange={(page) => loadCourses(page)} />
                <div>
                    <Button onClick={() => setShowForm(true)}><HiPlus /></Button>
                </div>
            </ContentToolBar>
            <Row>
                <Col className='p-0'>
                {
                    showTable()
                }
                </Col>
            </Row>
        </Container>
    );
}

export default Courses;
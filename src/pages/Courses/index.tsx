import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useAuth } from '../../context/auth';
import { useApi } from '../../services/api';
import { useNav, MenuKeys } from '../../context/nav';
import courseType, { CourseLevels } from '../../services/apiTypes/Course';
import DefaultTable from '../../components/DefaultTable';
import { FaEdit, FaTrash } from 'react-icons/fa';
import LoadingContainer from '../../components/LodingContainer';
import ContentToolBar from '../../components/ContentToolBar';
import { HiPlus } from 'react-icons/hi';
import CourseForm from './CourseForm';
import { courseLevelRederer } from '../../utils/courseLevelRenderer';

const Courses: React.FC = () => {

    const { token } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu } = useNav()

    const[courses,setCourses] = useState([] as courseType[])
    const[currentPage,setCurrentPage] = useState(1)
    const[totalPages,setTotalPages] = useState(1)

    const[isLoading,setIsLoading] = useState(false)
    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<courseType | undefined>(undefined)

    useEffect(() => {
        setSelectedMenu(MenuKeys.COURSES)
        setContentTitle('Cursos')
        loadCourses()
    },[])

    function loadCourses() {
        setIsLoading(true)
        api.get('/courses')
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
                            <Button variant='secondary'
                                onClick={() => editCourse(course)}>
                                    <FaEdit />
                            </Button> &nbsp;
                            <Button variant='secondary'><FaTrash /></Button>
                        </td>
                    </tr> )
                }
                </tbody>
            </DefaultTable>
        )
    }

    return (
        <Container className='position-relative'>
            <LoadingContainer show={isLoading} />
            <CourseForm 
                show={showForm}
                course={selected}
                handleClose={handleCloseForm}
                handleSave={handleSave}
                handleUpdate={handleUpdate}/>
            <ContentToolBar>
                <div>&nbsp;</div>
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
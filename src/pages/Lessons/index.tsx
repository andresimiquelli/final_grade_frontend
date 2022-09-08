import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import ContentToolBar from '../../components/ContentToolBar';
import LoadingContainer from '../../components/LodingContainer';
import { useAuth } from '../../context/auth';
import { useNav, MenuKeys } from '../../context/nav';
import { useApi } from '../../services/api';
import lessonType from '../../services/apiTypes/Lesson';
import DefaultTable from '../../components/DefaultTable';
import { dateRenderer } from '../../utils/dateRenderer';
import ButtonColumn from '../../components/ButtonColumn';
import { FaEdit, FaTrash, FaUserCheck } from 'react-icons/fa';
import { HiPlus } from 'react-icons/hi';
import LessonForm from './LessonForm';
import AttendanceForm from './AttendanceForm';
import { UserType } from '../../services/apiTypes/User';
import PaginatorDefault from '../../components/PaginatorDefault';

const Lessons: React.FC = () => {

    const { class_id, subject_id } = useParams()

    const { token, currentUser } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu } = useNav()

    const[lessons,setLessons] = useState<lessonType[]>([])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

    const[isLoading,setIsLoading] = useState(false)
    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<lessonType | undefined>()
    const[showAttendanceForm, setShowAttendanceForm] = useState(false)

    useEffect(() => {
        setContentTitle("Aulas")
        setSelectedMenu(MenuKeys.CLASSES)
        if(class_id && subject_id) {
            loadLessons()
        }
    },[])

    function loadLessons(page: number = 1) {
        setIsLoading(true)
        api.get(`/classes/${class_id}/subjects/${subject_id}/lessons?page=${page}`)
        .then(
            response => {
                setLessons(response.data.data)
                setTotalPages(response.data.last_page)
                setCurrentPage(response.data.current_page)
            }
        )
        .finally(() => setIsLoading(false))
    }

    function closeForm() {
        setSelected(undefined)
        setShowForm(false)
    }

    function handleSave(lesson: lessonType) {
        setLessons([lesson, ...lessons])
    }

    function handleUpdate(nLesson: lessonType) {
        setLessons(current => current.map(lesson => lesson.id === nLesson.id ? nLesson : lesson))
    }

    function editLesson(lesson: lessonType) {
        setSelected(lesson)
        setShowForm(true)
    }

    function attendance(lesson: lessonType) {
        setSelected(lesson)
        setShowAttendanceForm(true)
    }

    function closeAttendanceForm() {
        setSelected(undefined)
        setShowAttendanceForm(false)
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>DATA</th>
                        <th>CONTEÚDO</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                {
                    lessons.map(lesson => 
                        <tr>
                            <td>{dateRenderer(lesson.reference)}</td>
                            <td><small>{lesson.content}</small></td>
                            <td>
                                <ButtonColumn>
                                    <button
                                        onClick={() => attendance(lesson)}>
                                        <FaUserCheck />
                                        <span>Chamada</span>
                                    </button>
                                    <button 
                                        onClick={() => editLesson(lesson)}
                                        className='secondary'>
                                        <FaEdit />
                                    </button>
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

    return (
        <Container className='position-relative' fluid>
            <LoadingContainer show={isLoading} />
            <LessonForm 
                show={showForm} 
                lesson={selected}
                handleClose={closeForm}
                handleSave={handleSave}
                handleUpdate={handleUpdate}
                classId={class_id}
                subjectId={subject_id}/>
            <AttendanceForm 
                show={showAttendanceForm}
                classId={class_id}
                handleClose={closeAttendanceForm}
                lesson={selected}/>
            <ContentToolBar variant={currentUser?.type === UserType.PROF.value? 'bordered' : 'default'}>
                <div></div>
                <div>
                    <PaginatorDefault
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onChange={loadLessons} />
                </div>
                <div>
                    <Button
                        onClick={() => setShowForm(true)}>
                        <HiPlus /> Nova aula
                    </Button>
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

export default Lessons;
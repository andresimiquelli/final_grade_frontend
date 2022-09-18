import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
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
import JournalService, { statusPermissions } from '../../services/JournalService';
import { extractError } from '../../utils/errorHandler';
import ConfirmationModal from '../../components/ConfirmationModal';
import dateCompare from '../../utils/dateCompare';
import ContentToolBarForm from '../../components/ContentToolBarForm';

const Lessons: React.FC = () => {

    const { class_id, subject_id } = useParams()

    const { token, currentUser } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu, addErrorMessage } = useNav()

    const[lessons,setLessons] = useState<lessonType[]>([])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

    const[isLoading,setIsLoading] = useState(false)
    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<lessonType | undefined>()
    const[showAttendanceForm, setShowAttendanceForm] = useState(false)
    const[showDeleteModal,setShowDeleteModal] = useState(false)

    const[isEditable,setIsEditable] = useState<number>(statusPermissions.LOADING)

    const[dateStart,setDateStart] = useState('')
    const[dateEnd,setDateEnd] = useState('')

    useEffect(() => {
        setContentTitle("Aulas")
        setSelectedMenu(MenuKeys.CLASSES)
        if(class_id && subject_id) {
            loadLessons()
            JournalService.getStatus(class_id,subject_id,token)
                .then(status => setIsEditable(status))
                .catch(() => setIsEditable(statusPermissions.ERROR))
        }
    },[])

    function getSearch() {
        let search = ''
        if(dateStart.length===10) {
            search += '&filters=reference:>=:'+dateStart

            if(dateEnd.length===10) {
                search += ',reference:<=:'+dateEnd
            }
        }

        return search
    }

    function loadLessons(page: number = 1) {
        setIsLoading(true)
        api.get(`/classes/${class_id}/subjects/${subject_id}/lessons?page=${page}${getSearch()}`)
        .then(
            response => {
                setLessons(response.data.data)
                setTotalPages(response.data.last_page)
                setCurrentPage(response.data.current_page)
            }
        )
        .finally(() => setIsLoading(false))
        .catch( error => addErrorMessage(extractError(error)))
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

    function deleteLesson(lesson: lessonType) {
        setSelected(lesson)
        setShowDeleteModal(true)
    }

    function deleteLessonConfirm() {
        setShowDeleteModal(false)
        api.delete(`/classes/${class_id}/subjects/${subject_id}/lessons/${selected?.id}`)
        .then(() => setLessons(current => current.filter(lesson => lesson.id!==selected?.id)))
        .catch( error => addErrorMessage(extractError(error)))
    }

    function deleteLessonCancel() {
        setShowDeleteModal(false)
        setSelected(undefined)
    }

    function handleChangeDateStart(date: string) {
        setDateStart(date)
    }

    function handleChangeDateEnd(date: string) {
        if(date.length>0) {
            if(dateCompare(date, dateStart) > -1) {
                setDateEnd(date)
            } else {
                setDateEnd(dateStart)
                addErrorMessage({message: '"A data final não pode ser anterior à data inicial."'})
            }
        } else {
            setDateEnd(date)
        }        
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
                                    {
                                        isEditable===statusPermissions.OPEN&&
                                        <>
                                            <button
                                                onClick={() => editLesson(lesson)}
                                                className='secondary'>
                                                <FaEdit />
                                            </button>
                                            <button className='secondary' onClick={() => deleteLesson(lesson)}>
                                                <FaTrash />
                                            </button>
                                        </>
                                    }
                                    
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
            <ConfirmationModal
                title='Excluir aula'
                subtitle={`Deseja confirmar a exclusão da aula do dia ${dateRenderer(selected?.reference)}`}
                show={showDeleteModal}
                onCancel={deleteLessonCancel}
                onClose={deleteLessonCancel}
                onConfirm={deleteLessonConfirm}> 
                A exclusão não será possível caso haja resgistros vinculados a este.
            </ConfirmationModal>
            <LessonForm 
                show={showForm} 
                lesson={selected}
                handleClose={closeForm}
                handleSave={handleSave}
                handleUpdate={handleUpdate}
                classId={class_id}
                subjectId={subject_id}/>
            <AttendanceForm 
                notEditable={isEditable!==statusPermissions.OPEN}
                show={showAttendanceForm}
                classId={class_id}
                handleClose={closeAttendanceForm}
                lesson={selected}/>
            <ContentToolBar variant={currentUser?.type === UserType.PROF.value? 'bordered' : 'default'}>
                <div>
                    <ContentToolBarForm>
                        <Form.Control 
                            type='date'
                            onChange={(e) => handleChangeDateStart(e.target.value)}
                            value={dateStart}/>
                        <Form.Control 
                            type='date'
                            onChange={(e) => handleChangeDateEnd(e.target.value)}
                            value={dateEnd}
                            disabled={dateStart.length===0}/>
                        <Button
                            onClick={() => loadLessons()}>
                            Buscar
                        </Button>
                    </ContentToolBarForm>
                </div>
                <div>
                    <PaginatorDefault
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onChange={loadLessons} />
                </div>
                <div>
                    <Button
                        disabled={isEditable!==statusPermissions.OPEN}
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
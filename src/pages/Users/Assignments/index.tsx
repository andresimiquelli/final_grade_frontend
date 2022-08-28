import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useAuth } from '../../../context/auth';
import { useApi } from '../../../services/api';
import { useNav, MenuKeys } from '../../../context/nav';
import errorType from '../../../services/apiTypes/Error';
import { extractError } from '../../../utils/errorHandler';
import ContentToolBar from '../../../components/ContentToolBar';
import { HiPlus } from 'react-icons/hi';
import LoadingContainer from '../../../components/LodingContainer';
import DefaultTable from '../../../components/DefaultTable';
import { dateRenderer } from '../../../utils/dateRenderer';
import ButtonColumn from '../../../components/ButtonColumn';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ClassFrame from '../../../frames/ClassFrame';
import classType from '../../../services/apiTypes/Class';
import packModuleSubjectType from '../../../services/apiTypes/PackModuleSubject';
import PackSubjectFrame from '../../../frames/PackSubjectFrame';
import AssignmentForm from './AssignmentForm';
import userType from '../../../services/apiTypes/User';
import userAssignmentType from '../../../services/apiTypes/UserAssignment';

const Assignments: React.FC = () => {

    const { teacher_id } = useParams()
    const { token } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu } = useNav()

    const[teacher,setTeacher] = useState<userType>({} as userType)
    const[assignments,setAssignments] = useState<userAssignmentType[]>([])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

    const[isLoading,setIsLoading] = useState(false)
    const[hasError,setHasError] = useState(false)
    const[error,setError] = useState<errorType | undefined>()

    const[showClassFrame,setShowClassFrame] = useState(false)
    const[selectedClass,setSelectedClass] = useState<classType | undefined>()
    const[showSubjectFrame,setShowSubjectFrame] = useState(false)
    const[selectedSubject,setSelectedSubject] = useState<packModuleSubjectType | undefined>()
    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<userAssignmentType | undefined>()

    useEffect(() => {
        if(teacher_id)
            loadTeacher(teacher_id)
    
        setContentTitle("Vínculos")
        setSelectedMenu(MenuKeys.USERS)
        
    },[teacher_id])

    function loadTeacher(id: string | number) {
        setIsLoading(true)
        api.get('/users/'+id)
        .then(
            response => {
                setTeacher(response.data)
                loadAssignments()
            }
        )
        .catch(
            error => {
                setHasError(true)
                setError(extractError(error))
                setIsLoading(false)
            }
        )
    }

    function loadAssignments() {
        setIsLoading(true)
        api.get(`/users/${teacher_id}/assignments`)
        .then(
            response => {
                setAssignments(response.data.data)
                setTotalPages(response.data.last_page)
                setCurrentPage(response.data.current_page)
            }
        )
        .finally(
            () => setIsLoading(false)
        )
        .catch(
            error => {
                setHasError(true)
                setError(extractError(error))
            }
        )
    }

    function selectClass(cclass: classType) {
        setSelectedClass(cclass)
        setShowClassFrame(false)
        setShowSubjectFrame(true)
    }

    function selectSubject(subject: packModuleSubjectType) {
        setSelectedSubject(subject)
        setShowSubjectFrame(false)
        setShowForm(true)
    }

    function closeFrame() {
        setShowClassFrame(false)
        setShowSubjectFrame(false)
        setSelectedClass(undefined)
        setSelectedSubject(undefined)
    }

    function editAssignment(assignment: userAssignmentType) {
        setSelected(assignment)
        setSelectedClass(assignment.cclass)
        setSelectedSubject(assignment.subject)
        setShowForm(true)
    }

    function closeForm() {
        setSelected(undefined)
        setShowForm(false)
        closeFrame()
    }

    function handleSave(assignment: userAssignmentType) {
        setAssignments([assignment, ...assignments])
    }

    function handleUpdate(nAssignment: userAssignmentType) {
        setAssignments(current => current.map(assignment => assignment.id === nAssignment.id? nAssignment : assignment))
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Turma</th>
                        <th>Disciplina</th>
                        <th>Início</th>
                        <th>Término</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {
                   assignments.map(assignment => 
                    <tr key={assignment.id}>
                        <td>{assignment.cclass.name}</td>
                        <td>{assignment.subject.subject.name}</td>
                        <td>{dateRenderer(assignment.start_at)}</td>
                        <td>{dateRenderer(assignment.end_at)}</td>
                        <td>
                            <ButtonColumn>
                                <button className='secondary' onClick={() => editAssignment(assignment)}><FaEdit /></button>
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

    return (
        <Container className='position-relative'>
            <LoadingContainer show={isLoading}/>
            <ClassFrame 
                show={showClassFrame} 
                handleClose={closeFrame} 
                handleSelect={selectClass}/>
            <PackSubjectFrame
                pack={selectedClass?.pack}
                show={showSubjectFrame} 
                handleClose={closeFrame} 
                handleSelect={selectSubject} />
            <AssignmentForm 
                show={showForm}
                handleClose={closeForm}
                handleSave={handleSave}
                handleUpdate={handleUpdate}
                cclass={selectedClass}
                subject={selectedSubject}
                teacher={teacher}
                assignment={selected}/>
            <ContentToolBar>
                <div></div>
                <div>
                    <Button onClick={() => setShowClassFrame(true)}><HiPlus /></Button>
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

export default Assignments;
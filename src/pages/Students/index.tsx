import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNav, MenuKeys } from '../../context/nav';
import { useAuth } from '../../context/auth';
import { useApi } from '../../services/api';
import studentType from '../../services/apiTypes/Student';
import { Button, Col, Container, Row } from 'react-bootstrap';
import ContentToolBar from '../../components/ContentToolBar';
import { HiPlus } from 'react-icons/hi';
import { FaUserEdit, FaTrash, FaLink } from 'react-icons/fa';
import DefaultTable from '../../components/DefaultTable';
import StudentForm from './StudentForm';
import LoadingContainer from '../../components/LodingContainer';
import ButtonColumn from '../../components/ButtonColumn';

const Students: React.FC = () => {

    const { setSelectedMenu } = useNav()
    const { token } = useAuth()
    const api = useApi(token)
    const navigate = useNavigate()

    const[isLoading,setIsLoading] = useState(false)
    const[students,setStudents] = useState([] as studentType[])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<studentType | undefined>(undefined)

    useEffect(() => {
        setSelectedMenu(MenuKeys.STUDENTS)
        loadStudents()
    },[])

    function loadStudents() {
        api.get('/students')
        .then(
            response => {
                setStudents(response.data.data)
                setTotalPages(response.data.last_page)
                setCurrentPage(response.data.current_page)
            }
        )
        .finally(
            () => setIsLoading(false)
        )
    }

    function editStudent(student: studentType) {
        setSelected(student)
        setShowForm(true)
    }

    function handleCloseForm() {
        setShowForm(false)
        setSelected(undefined)
    }

    function handleSave(student: studentType) {
        setStudents([...students, student])
    }

    function handleUpdate(nStudent: studentType) {
        setStudents(students.map(student => {
            return nStudent.id === student.id?
                nStudent : student
        }))
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        students.map(student => <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.phone}</td>
                            <td>
                                <ButtonColumn>
                                    <button className='mr-2' onClick={() => navigate(`/students/${student.id}/enrollments`)}>
                                        <FaLink /> <span>Matrículas</span>
                                    </button>
                                    <button className='secondary'
                                        onClick={() => editStudent(student)}>
                                            <FaUserEdit />
                                    </button> &nbsp;
                                    <button className='secondary'><FaTrash /></button>
                                </ButtonColumn>
                            </td>
                        </tr>)
                    }
                </tbody>
            </DefaultTable>
        )
    }

    return (
        <Container className='position-relative'>
            <LoadingContainer show={isLoading}/>
            <StudentForm 
                show={showForm} 
                student={selected} 
                handleClose={handleCloseForm}
                handleSave={handleSave}
                handleUpdate={handleUpdate}/>
            <ContentToolBar>
                <div>
                    &nbsp;
                </div>
                <div>
                    <Button onClick={() => setShowForm(true)}><HiPlus /></Button>
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

export default Students;
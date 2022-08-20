import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { HiPlus } from 'react-icons/hi';
import LoadingContainer from '../../../components/LodingContainer';
import { useAuth } from '../../../context/auth';
import { useApi } from '../../../services/api';
import { useNav, MenuKeys } from '../../../context/nav';
import evaluationType from '../../../services/apiTypes/Evaluation';
import DefaultTable from '../../../components/DefaultTable';
import ButtonColumn from '../../../components/ButtonColumn';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ContentToolBar from '../../../components/ContentToolBar';
import { MdChecklist } from 'react-icons/md';
import GradeForm from './GradeForm';
import EvaluationForm from './EvaluationForm';

const Evaluations: React.FC = () => {

    const { token } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu } = useNav()
    const { class_id, subject_id} = useParams()

    const[evaluations,setEvaluations] = useState<evaluationType[]>([])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

    const[isLoading,setIsLoading] = useState(false)
    const[selected,setSelected] = useState<evaluationType | undefined>()
    const[showGradeForm,setShowGradeForm] = useState(false)
    const[showEvaluationForm,setShowEvaluationForm] = useState(false)

    useEffect(() => {
        setContentTitle("Avaliações")
        setSelectedMenu(MenuKeys.CLASSES)
        loadEvaluations()
    },[])

    function loadEvaluations() {
        setIsLoading(true)
        api.get(`/classes/${class_id}/subjects/${subject_id}/evaluations`)
        .then(
            response => {
                setEvaluations(response.data.data)
                setTotalPages(response.data.last_page)
                setCurrentPage(response.data.current_page)
            }
        )
        .finally(() => setIsLoading(false))
    }

    function edit(evaluation: evaluationType) {
        setSelected(evaluation)
        setShowEvaluationForm(true)
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Valor</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                {
                    evaluations.map(evaluation => 
                        <tr key={evaluation.id}>
                            <td>{evaluation.name}</td>
                            <td>{evaluation.value}</td>
                            <td>
                                <ButtonColumn>
                                    <button onClick={() => grades(evaluation)}>
                                        <MdChecklist/>
                                        <span>Pontuação</span>
                                    </button>
                                    <button 
                                        className='secondary'
                                        onClick={() => edit(evaluation)}>
                                            <FaEdit />
                                    </button>
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

    function grades(evaluation: evaluationType) {
        setSelected(evaluation)
        setShowGradeForm(true)
    }

    function closeGradeForm() {
        setSelected(undefined)
        setShowGradeForm(false)
    }

    function closeEvaluationForm() {
        setSelected(undefined)
        setShowEvaluationForm(false)
    }

    function handleSave(evaluation: evaluationType) {
        setEvaluations([evaluation, ...evaluations])
    }

    function handleUpdate(evaluation: evaluationType) {
        setEvaluations(current => current.map(ceval => ceval.id===evaluation.id? evaluation : ceval))
    }

    return (
        <Container className='position-relative'>            
            <LoadingContainer show={isLoading} />
            <EvaluationForm
                show={showEvaluationForm}
                handleClose={closeEvaluationForm} 
                handleSave={handleSave}
                handleUpdate={handleUpdate}
                classId={class_id? parseInt(class_id) : undefined}
                subjectId={subject_id? parseInt(subject_id) : undefined}
                evaluation={selected}/>
            <GradeForm 
                show={showGradeForm}
                classId={class_id}
                subjectId={subject_id}
                evaluation={selected}
                handleClose={closeGradeForm}/>
            <ContentToolBar>
                <div></div>
                <div>
                    <Button onClick={() => setShowEvaluationForm(true)}><HiPlus /> Nova avaliação</Button>
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

export default Evaluations;
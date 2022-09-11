import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { HiPlus, HiSearch } from 'react-icons/hi';
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
import PaginatorDefault from '../../../components/PaginatorDefault';
import { UserType } from '../../../services/apiTypes/User';
import JournalService, { statusPermissions } from '../../../services/JournalService';
import { extractError } from '../../../utils/errorHandler';
import ConfirmationModal from '../../../components/ConfirmationModal';

const Evaluations: React.FC = () => {

    const { token, currentUser } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu, addErrorMessage } = useNav()
    const { class_id, subject_id} = useParams()

    const[evaluations,setEvaluations] = useState<evaluationType[]>([])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)
    const[searchName,setSearchName] = useState('') 

    const[isLoading,setIsLoading] = useState(false)
    const[selected,setSelected] = useState<evaluationType | undefined>()
    const[showGradeForm,setShowGradeForm] = useState(false)
    const[showEvaluationForm,setShowEvaluationForm] = useState(false)
    const[showDeleteModal,setShowDeleteModal] = useState(false)

    const[isEditable,setIsEditable] = useState<number>(statusPermissions.LOADING)

    useEffect(() => {
        setContentTitle("Avaliações")
        setSelectedMenu(MenuKeys.CLASSES)
        loadEvaluations()
        JournalService.getStatus(class_id,subject_id,token)
            .then(status => setIsEditable(status))
            .catch(() => setIsEditable(statusPermissions.ERROR))
    },[])

    function getFilters(page: number = 1) {
        let filters = '?'

        if(searchName.trim().length>0)
            filters += "filters=name:like:"+encodeURI("%"+searchName+"%")

        filters += filters.length>1? '&' : ''

        filters += 'page='+page

        return filters
    }

    function loadEvaluations(page: number = 1) {
        setIsLoading(true)
        api.get(`/classes/${class_id}/subjects/${subject_id}/evaluations`+getFilters(page))
        .then(
            response => {
                setEvaluations(response.data.data)
                setTotalPages(response.data.last_page)
                setCurrentPage(response.data.current_page)
            }
        )
        .finally(() => setIsLoading(false))
        .catch( error => addErrorMessage(extractError(error)))
    }

    function edit(evaluation: evaluationType) {
        setSelected(evaluation)
        setShowEvaluationForm(true)
    }

    function deleteEvaluation(evaluation: evaluationType) {
        setSelected(evaluation)
        setShowDeleteModal(true)
    }

    function deleteEvaluationConfirm() {
        setShowDeleteModal(false)
        api.delete(`/classes/${class_id}/subjects/${subject_id}/evaluations/${selected?.id}`)
        .then(() => setEvaluations(current => current.filter(evaluation => evaluation.id!==selected?.id)))
        .catch( error => addErrorMessage(extractError(error)))
    }

    function deleteEvaluationCancel() {
        setShowDeleteModal(false)
        setSelected(undefined)
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
                            {
                                isEditable===statusPermissions.OPEN&&
                                    <>
                                        <button 
                                            className='secondary'
                                            onClick={() => edit(evaluation)}>
                                                <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteEvaluation(evaluation)}
                                            className='secondary'>
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

    function search(e: React.FormEvent) {
        e.preventDefault()
        loadEvaluations()
    }

    return (
        <Container className='position-relative' fluid>            
            <LoadingContainer show={isLoading} />
            <ConfirmationModal
                title='Excluir avaliação'
                subtitle={`Deseja confirmar a exclusão de ${selected?.name}?`}
                show={showDeleteModal}
                onCancel={deleteEvaluationCancel}
                onClose={deleteEvaluationCancel}
                onConfirm={deleteEvaluationConfirm}> 
                A exclusão não será possível caso haja resgistros vinculados a este.
            </ConfirmationModal>
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
                notEditable={isEditable!==statusPermissions.OPEN}
                classId={class_id}
                subjectId={subject_id}
                evaluation={selected}
                handleClose={closeGradeForm}/>
            <ContentToolBar variant={currentUser?.type === UserType.PROF.value? 'bordered' : 'default'}>
                <Form onSubmit={search}>
                    <Row>
                        <Col sm='11'>
                            <Form.Control
                                type='text'
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                placeholder='Buscar avaliação' />
                        </Col>
                        <Col sm='1'>
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
                    onChange={(page) => loadEvaluations(page)} />
                <div>
                    <Button 
                        disabled={isEditable!==statusPermissions.OPEN}
                        onClick={() => setShowEvaluationForm(true)}>
                            <HiPlus /> Nova avaliação
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

export default Evaluations;
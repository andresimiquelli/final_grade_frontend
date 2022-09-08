import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNav } from '../../../context/nav';
import { useAuth } from '../../../context/auth';
import { useApi } from '../../../services/api';
import { finalgradeReportType } from '../../../services/apiTypes/Finalgrade';
import LoadingContainer from '../../../components/LodingContainer';
import DefaultTable from '../../../components/DefaultTable';
import ContentToolBar from '../../../components/ContentToolBar';
import { RiCheckboxCircleFill } from 'react-icons/ri';
import ConfirmationModal from '../../../components/ConfirmationModal';
import journalType from '../../../services/apiTypes/Journal';

type dataType = {
    enrollment_id: number;
    pack_module_subject_id: number;
    value: number;
    absences: number;
}

type dataTypeMany = {
    grades: dataType[];
}

const statusPermissions = {
    LOADING: -1,
    OPEN: 0,
    CLOSED: 1,
    ERROR: 2
}

const FinalGrade: React.FC = () => {

    const { class_id, subject_id } = useParams()
    const { setContentTitle } = useNav()
    const { token } = useAuth()
    const api = useApi(token)

    const[isLoading,setIsLoading] = useState(false)
    const[reports,setReports] = useState<finalgradeReportType[]>([])
    const[showConfirmModal,setShowConfirmModal] = useState(false)
    const[isEditable,setIsEditable] = useState<number>(statusPermissions.LOADING)

    useEffect(() => {
        setContentTitle('Fechamento')
        loadData()
    },[])

    function loadData() {
        setIsLoading(true)
        api.get(`/finalgrades/classes/${class_id}/subjects/${subject_id}/report`)
            .then(
                response => {
                    setReports(response.data)
                    loadJournalStatus()
                }
            )
            .finally(() => setIsLoading(false))
    }

    function loadJournalStatus() {
        api.get(`/journals/${class_id}/${subject_id}`)
        .then(
            response => {
                const journal = response.data as journalType;
                setIsEditable(journal.status? journal.status : statusPermissions.ERROR)
            }
        )
        .catch(response => {
            if(response.request.status)
                if(response.request.status === 404)
                    setIsEditable(0)
                else
                    setIsEditable(statusPermissions.ERROR)
        })
    }

    function closeJournal() {
        setIsLoading(true)
        setShowConfirmModal(false)
        const data = {
            grades: reports.map(report => (
                {
                    enrollment_id: report.enrollment_id, 
                    pack_module_subject_id: report.pack_module_subject_id,
                    value: report.grade,
                    absences: report.absences
                } as dataType
            ))
        } as dataTypeMany 

        api.post(`/finalgrades/classes/${class_id}/subjects/${subject_id}`, data)
        .then(() => {
            setIsEditable(statusPermissions.CLOSED)
        })
        .catch()
        .finally(() => setIsLoading(false))
    }

    function getEditPermission() {
        switch(isEditable) {
            case statusPermissions.LOADING:
                return 'Obtendo status ...'
            case statusPermissions.CLOSED:
                return <strong>Diário fechado</strong>
            case statusPermissions.OPEN:
                return <Button
                variant='danger'
                onClick={() => setShowConfirmModal(true)}>
                    <RiCheckboxCircleFill /> Fechar diário
                </Button>
            default: 
                return 'Erro ao carregar status do diário!'
        }
    }

    function table() {
        return <DefaultTable>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Nota computada</th>
                    <th>Faltas computadas</th>
                    <td></td>
                </tr>
            </thead>
            <tbody>
            {
                reports.map(report => 
                    <tr key={report.enrollment_id}>
                        <td>{report.student_name}</td>
                        <td>{report.grade}</td>
                        <td>{report.absences}</td>
                        <td></td>
                    </tr>    
                )
            }
            </tbody>
        </DefaultTable>
    }

    return (
        <Container fluid>
            <LoadingContainer show={isLoading}/>
            <ConfirmationModal
                show={showConfirmModal}
                title={'Fechar diário'}
                subtitle={'Tem certeza que deseja fechar o diário da disciplina?'}
                text={'Após o fechamento não será possível realizar alterações nas notas e frequência.'}
                onClose={() => setShowConfirmModal(false)}
                onCancel={() => setShowConfirmModal(false)}
                onConfirm={closeJournal}
            />
            <ContentToolBar>
                <div></div>
                <div>
                    {getEditPermission()}                    
                </div>
                <div></div>
            </ContentToolBar>
            <Row>
                <Col className='p-0'>
                    { table() }
                </Col>
            </Row>
        </Container>
    );
}

export default FinalGrade;
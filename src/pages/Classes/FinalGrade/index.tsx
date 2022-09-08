import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { useNav } from '../../../context/nav';
import { useAuth } from '../../../context/auth';
import { useApi } from '../../../services/api';
import { finalgradeReportType } from '../../../services/apiTypes/Finalgrade';
import LoadingContainer from '../../../components/LodingContainer';
import DefaultTable from '../../../components/DefaultTable';

const FinalGrade: React.FC = () => {

    const { class_id, subject_id } = useParams()
    const { setContentTitle } = useNav()
    const { token } = useAuth()
    const api = useApi(token)

    const[isLoading,setIsLoading] = useState(false)
    const[reports,setReports] = useState<finalgradeReportType[]>([])

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
                }
            )
            .finally(() => setIsLoading(false))
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
            <Row>
                <Col className='p-0'>
                    { table() }
                </Col>
            </Row>
        </Container>
    );
}

export default FinalGrade;
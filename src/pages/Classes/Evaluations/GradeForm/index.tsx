import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import enrollmentType from '../../../../services/apiTypes/Enrollment';
import { useAuth } from '../../../../context/auth';
import { useApi } from '../../../../services/api';
import evaluationGradeType from '../../../../services/apiTypes/EvaluationGrade';
import evaluationType from '../../../../services/apiTypes/Evaluation';
import DefaultTable from '../../../../components/DefaultTable';
import LoadingContainer from '../../../../components/LodingContainer';

interface GradeFormProps {
    show?: boolean;
    classId?: string;
    subjectId?: string;
    evaluation?: evaluationType;
    handleClose(): void;
}

type gradeData = {
    enrollment_id: number;
    value: number | string;
}

type postGradeData = {
    grades: gradeData[];
}

const GradeForm: React.FC<GradeFormProps> = ({ show, classId, subjectId, evaluation, handleClose }) => {

    const { token } = useAuth()
    const api = useApi(token)

    const[enrollments,setEnrollments] = useState<enrollmentType[]>([])
    const[loadingEnrollments,setLoadingEnrollments] = useState(false)

    const[loadingGrades,setLoadingGrades] = useState(false)
    const[grades,setGrades] = useState<gradeData[]>([])    
    
    const isLoading = useMemo(() => loadingEnrollments || loadingGrades , [loadingEnrollments, loadingGrades])

    useEffect(() => {
        if(classId && subjectId)
            loadEnrollments()
    },[classId, subjectId, evaluation])

    useEffect(() => {
        if(classId && subjectId && evaluation)
            if(!loadingEnrollments)
                loadGrades()
    },[evaluation, loadingEnrollments])

    useEffect(() => {
        if(!show)
            setGrades([])
    },[show])

    function loadEnrollments() {
        setLoadingEnrollments(true)
        api.get(`/enrollments?with=student&filters=class_id:${classId}&paginate=disable`)
        .then(
            response => {
                setEnrollments(response.data)
            }
        )
        .finally(() => setLoadingEnrollments(false))
    }

    function loadGrades() {
        setLoadingGrades(true)
        api.get(`/classes/${classId}/subjects/${subjectId}/evaluations/${evaluation?.id}/grades`)
        .then(
            response => {
                let lGrades = response.data as gradeData[]
                let nGrades = [] as gradeData[]

                enrollments.forEach(enrollment => {                    
                    let fGrade = lGrades.find(g => g.enrollment_id===enrollment.id)
                    let grade = { enrollment_id: enrollment.id, value: fGrade? fGrade.value : ""}
                    nGrades.push(grade)
                })

                setGrades(nGrades)
            }
        )
        .finally(() => setLoadingGrades(false))
    }

    function getGradeValue(id: number) {
        if(grades.length > 0){
            let val = grades.filter(grade => grade.enrollment_id===id)
            if(val.length > 0)
                return val[0].value
        }

        return ""            
    }

    function changeGradeValue(id: number, value: number) {
        setGrades(current => current.map(grade => grade.enrollment_id===id? {enrollment_id: id, value: value} : grade))
    }

    function getData() {
        return { grades: grades.map(grade => {
            if(grade.value === "")
                grade.value = -1
                
            return grade
        }) } as postGradeData
    }

    function save(e: React.FormEvent) {
        e.preventDefault()
        setLoadingGrades(true)
        const data = getData()
        console.log(data)
        api.post(`/evaluations/${evaluation?.id}/grades`, data)
        .then(
            response => {
                console.log(response)
                handleClose()
            }
        )
        .finally(() => setLoadingGrades(false))
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Aluno</th>
                        <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
                {
                    enrollments.map(enrollment => 
                        <tr key={enrollment.id}>
                            <td>{enrollment.student?.name}</td>
                            <td>
                                <Form.Control 
                                    type='number' 
                                    value={getGradeValue(enrollment.id)}
                                    onChange={(e) => changeGradeValue(enrollment.id, parseInt(e.target.value))} />
                            </td>
                        </tr>    
                    )
                }
                </tbody>
            </DefaultTable>
        )
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Notas</Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body>
                    <LoadingContainer show={isLoading}/>
                    { showTable() }
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleClose}
                        variant="secondary">
                        Cancelar
                    </Button>
                    <Button type="submit">
                        Salvar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default GradeForm;
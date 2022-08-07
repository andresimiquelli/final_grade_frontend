import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import DefaultTable from '../../../components/DefaultTable';
import LoadingContainer from '../../../components/LodingContainer';
import { useAuth } from '../../../context/auth';
import { useApi } from '../../../services/api';
import enrollmentType from '../../../services/apiTypes/Enrollment';
import enrollmentAbsenceType from '../../../services/apiTypes/EnrollmentAbsence';
import lessonType from '../../../services/apiTypes/Lesson';
import { dateRenderer } from '../../../utils/dateRenderer';

interface AttendanceFormProps {
    classId?: number | string;
    lesson?: lessonType;
    show?: boolean;
    handleClose?(): void;
    handleSave?(): void;
}

type dataType = {
    include?: number[];
    delete?: number[];
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ classId, show, lesson, ...props }) => {

    const { token } = useAuth()
    const api = useApi(token)

    const[enrollments,setEnrollments] = useState<enrollmentType[]>([])
    const[loadingEnrollments, setLoadingEnrollments] = useState(false)
    const[loadingAbsences, setLoadingAbsences] = useState(false)
    const[initialAbsences,setInitialAbsences] = useState<number[]>([])
    const[finalAbsences,setFinalAbsences] = useState<number[]>([])

    const isLoading = useMemo(() => loadingAbsences || loadingEnrollments, [loadingEnrollments, loadingAbsences])

    useEffect(() => {
        loadEnrollments()
    },[classId])

    useEffect(() => {
        loadAbsences()
    },[lesson])

    function loadEnrollments() {
        setLoadingEnrollments(true)
        api.get(`/enrollments?with=student&filters=class_id:${classId}&paginate=disable`)
        .then(
            response => {
                setEnrollments(response.data)
                loadAbsences()
            }
        )
        .finally(() => setLoadingEnrollments(false))
    }

    function loadAbsences() {
        if(lesson) {
            setLoadingAbsences(true)
            api.get(`/classes/${lesson.class_id}/subjects/${lesson.pack_module_subject_id}/lessons/${lesson.id}?with=absences`)
            .then(
                response => {
                    let lAbsences: enrollmentAbsenceType[] = response.data.absences
                    setInitialAbsences(lAbsences.map(abs => abs.enrollment_id))
                    setFinalAbsences(lAbsences.map(abs => abs.enrollment_id))
                }
            )
            .finally(() => setLoadingAbsences(false))
        }
    }

    function checkAttendance(enrollment: enrollmentType, value: boolean) {
        if(value)
            setFinalAbsences(current => current.filter(abs => abs !== enrollment.id))
        else
            setFinalAbsences([...finalAbsences,enrollment.id])
    }

    function vefAttendance(enrollment_id: number): boolean {
        return finalAbsences.find((id) => id === enrollment_id)? false : true
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Aluno</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                {
                    enrollments.map(enrollment => 
                        <tr key={enrollment.id}>
                            <td>{enrollment.student?.name}</td>
                            <td>
                                <Form.Check
                                    type="switch"
                                    checked={vefAttendance(enrollment.id)}
                                    onChange={(e) => checkAttendance(enrollment, e.target.checked)}/>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </DefaultTable>
        );
    }

    function getData() {
        let toDelete = initialAbsences.filter(id => finalAbsences.indexOf(id) )
        let toInclude = finalAbsences.filter(id => initialAbsences.indexOf(id))

        return { delete: toDelete, include: toInclude } as dataType
    }

    function save(e: React.FormEvent) {
        e.preventDefault()
        setLoadingAbsences(true)
        let data = getData()
        api.post(`/lessons/${lesson?.id}/absences`, data)
        .then(() => {
            props.handleSave&& props.handleSave()
            props.handleClose&& props.handleClose()
        })
        .finally(() => setLoadingAbsences(false))
    }

    return (
        <Modal show={show} onHide={props.handleClose}>
            <Modal.Header>
                <Modal.Title>{dateRenderer(lesson?.reference)}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <LoadingContainer show={isLoading}/>
                    { !isLoading&& showTable() }
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant='secondary'
                        onClick={props.handleClose}>
                        Cancelar
                    </Button>
                    <Button type='submit'>Salvar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AttendanceForm;
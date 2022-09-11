import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import DefaultTable from '../../../components/DefaultTable';
import ErrorScreen from '../../../components/ErrorScreen';
import LoadingContainer from '../../../components/LodingContainer';
import { useAuth } from '../../../context/auth';
import { useApi } from '../../../services/api';
import enrollmentType from '../../../services/apiTypes/Enrollment';
import enrollmentAbsenceType from '../../../services/apiTypes/EnrollmentAbsence';
import errorType from '../../../services/apiTypes/Error';
import lessonType from '../../../services/apiTypes/Lesson';
import { dateRenderer } from '../../../utils/dateRenderer';
import { extractError } from '../../../utils/errorHandler';

interface AttendanceFormProps {
    classId?: number | string;
    lesson?: lessonType;
    show?: boolean;
    notEditable?: boolean;
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

    const[hasError,setHasError] = useState(false)
    const[error,setError] = useState<errorType | undefined>()

    useEffect(() => {
        loadEnrollments()
    },[classId])

    useEffect(() => {
        loadAbsences()
    },[lesson])

    function close() {
        setHasError(false)
        props.handleClose&& props.handleClose()
    }

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
        .catch(
            error => {
                setError(extractError(error))
                setHasError(true)
            }
        )
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
            .catch(
                error => {
                    setError(extractError(error))
                    setHasError(true)
                }
            )
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
                                    disabled={props.notEditable}
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
            close()
        })
        .finally(() => setLoadingAbsences(false))
        .catch(
            error => {
                setError(extractError(error))
                setHasError(true)
            }
        )
    }

    return (
        <Modal show={show} onHide={close}>
            <Modal.Header>
                <Modal.Title>{dateRenderer(lesson?.reference)}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <LoadingContainer show={isLoading}/>
                    <ErrorScreen show={hasError} handleClose={() => setHasError(false)} error={error}/> 
                    { !isLoading&& showTable() }
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant='secondary'
                        onClick={close}>
                        {props.notEditable? 'Fechar' : 'Cancelar'}
                    </Button>
                    <Button 
                        disabled={props.notEditable}
                        type='submit'
                        >Salvar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AttendanceForm;
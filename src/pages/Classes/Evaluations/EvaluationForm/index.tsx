import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import ErrorScreen from '../../../../components/ErrorScreen';
import LoadingContainer from '../../../../components/LodingContainer';
import { useAuth } from '../../../../context/auth';
import { useApi } from '../../../../services/api';
import errorType from '../../../../services/apiTypes/Error';
import evaluationType from '../../../../services/apiTypes/Evaluation';
import { extractError } from '../../../../utils/errorHandler';

interface EvaluationFormProps {
    show?: boolean;
    classId?: number;
    subjectId?: number;
    evaluation?: evaluationType;
    handleClose?(): void;
    handleSave?(evaluation: evaluationType): void;
    handleUpdate?(evaluation: evaluationType): void;
}

type DataType = {
    id?: number;
    name: string;
    value: number;
    user_id?: number;
    class_id?: number;
    pack_module_subject_id?: number;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ( props ) => {

    const { token, currentUser } = useAuth()
    const api = useApi(token)

    const[name,setName] = useState('')
    const[value,setValue] = useState<number>()
    const[isLoading,setIsLoading] = useState(false)
    const[hasError,setHasError] = useState(false)
    const[error,setError] = useState<errorType | undefined>()

    useEffect(() => {
        if(props.evaluation) {
            setName(props.evaluation.name)
            setValue(props.evaluation.value)
        } else {
            setName('')
            setValue(0)
        }
    },[props.evaluation])

    function close() {
        setHasError(false)
        props.handleClose&& props.handleClose()
    }

    function save(e: React.FormEvent) {
        e.preventDefault()

        if(props.evaluation)
            update()
        else
            saveNew()
    }

    function getData(): DataType {
        const data = {
            name,
            value
        } as DataType

        if(props.evaluation) {
            data.id = props.evaluation.id
        } else {
            data.class_id = props.classId
            data.pack_module_subject_id = props.subjectId
            data.user_id = currentUser?.id
        }        

        return data;
    }

    function saveNew() {
        setIsLoading(true)
        const data = getData()
        api.post(`/classes/${props.classId}/subjects/${props.subjectId}/evaluations`, data)
        .then(
            response => {
                props.handleSave&&
                    props.handleSave(response.data)
                close()
            }
        )
        .finally(() => setIsLoading(false))
        .catch(
            error => {
                setError(extractError(error))
                setHasError(true)
            }
        )
    }

    function update() {
        setIsLoading(true)
        const data = getData()
        api.put(`/classes/${props.classId}/subjects/${props.subjectId}/evaluations/${props.evaluation?.id}`, data)
        .then(
            response => {
                props.handleUpdate&&
                    props.handleUpdate(response.data)
                close()
            }
        )
        .finally(() => setIsLoading(false))
        .catch(
            error => {
                setError(extractError(error))
                setHasError(true)
            }
        )
    }

    return (
        <Modal show={props.show} onHide={close}>
            <Modal.Header>
                <Modal.Title>{props.evaluation? 'Editar avaliação' : 'Nova avaliação'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <ErrorScreen show={hasError} handleClose={() => setHasError(false)} error={error}/>  
                    <LoadingContainer show={isLoading} />
                    <Form.Group className='mb-2'>
                        <Form.Control
                            type="text"
                            maxLength={191}
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome da avaliação"/>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Control
                            type="integer"
                            required
                            value={value}
                            onChange={(e) => setValue(e.target.value===''? 0 : parseInt(e.target.value))}
                            placeholder="Valor" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='secondary'
                        onClick={close}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit">
                        Salvar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default EvaluationForm;
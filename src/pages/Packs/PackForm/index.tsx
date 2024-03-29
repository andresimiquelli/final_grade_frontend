import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import courseType from '../../../services/apiTypes/Course';
import packType from '../../../services/apiTypes/Pack';
import { useAuth } from '../../../context/auth';
import { useApi } from '../../../services/api';
import LoadingContainer from '../../../components/LodingContainer';
import errorType from '../../../services/apiTypes/Error';
import ErrorScreen from '../../../components/ErrorScreen';
import { extractError } from '../../../utils/errorHandler';

interface PackFormProps {
    show?: boolean;
    course?: courseType;
    pack?: packType;
    handleClose?(): void;
    handleSave?(pack: packType): void;
    handleUpdate?(pack: packType): void;
}

type dataType = {
    name: string;
    description?: string;
    course_id?: number;
}

const PackForm: React.FC<PackFormProps> = ( props ) => {

    const { token } = useAuth()
    const api = useApi(token)

    const[name,setName] = useState('')
    const[description,setDescription] = useState('')
    const[isLoading,setIsLoading] = useState(false)

    const[hasError,setHasError] = useState(false)
    const[error,setError] = useState<errorType | undefined>()

    useEffect(() => {
        if(props.pack) {
            setName(props.pack.name)
            setDescription(props.pack.description)
        } else {
            clear()
        }
    },[props.pack])

    function close() {
        clear()
        setHasError(false)
        props.handleClose&& props.handleClose()
    }

    function clear() {
        setName('')
        setDescription('')
    }

    function getData(): dataType {
        let data = {
            name: name
        } as dataType

        if(description.trim().length > 0)
            data.description = description

        if(!props.pack)
            data.course_id = props.course?.id

        return data;
    }

    function save(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        if(props.pack)
            update()
        else
            saveNew()
    }

    function saveNew() {
        let data = getData()
        api.post('/packs', data)
        .then(
            response => {
                props.handleSave&& props.handleSave(response.data)
                close()
            }
        )
        .finally(
            () => setIsLoading(false)
        )
        .catch(
            error => {
                setError(extractError(error))
                setHasError(true)
            }
        )
    }

    function update() {
        let data = getData()
        api.put('/packs/'+props.pack?.id, data)
        .then(
            response => {
                props.handleUpdate&& props.handleUpdate(response.data)
                close()
            }
        )
        .finally(
            () => setIsLoading(false)
        )
        .catch(
            error => {
                setError(extractError(error))
                setHasError(true)
            }
        )
    }

    return (
        <Modal 
            onHide={close}
            show={props.show}>
            <Modal.Header>
                <Modal.Title>{ props.pack? 'Editar pacote didático' : 'Novo pacote didático'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <LoadingContainer show={isLoading}/>
                    <ErrorScreen show={hasError} handleClose={() => setHasError(false)} error={error}/> 
                    <Form.Group>
                        <h5>{props.course?.name}</h5>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Control 
                            type='text' 
                            required
                            minLength={5}
                            maxLength={191}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Nome'/>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Control
                            as='textarea'
                            rows={3}
                            maxLength={256}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Descrição'/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant='secondary'
                        onClick={close}>
                            Cancelar
                    </Button>
                    <Button type='submit'>Salvar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default PackForm;
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import packModuleType from '../../../../services/apiTypes/PackModule';
import { useAuth } from '../../../../context/auth';
import { useApi }  from '../../../../services/api';
import packType from '../../../../services/apiTypes/Pack';
import LoadingContainer from '../../../../components/LodingContainer';

interface ModuleFormProps {
    show?: boolean;
    module?: packModuleType;
    pack?: packType;
    handleClose?(): void;
    handleSave?(module: packModuleType): void;
    handleUpdate?(module: packModuleType): void;
}

type DataType = {
    name: string;
    description?: string;
}

const ModuleForm: React.FC<ModuleFormProps> = ( props ) => {

    const { token } = useAuth()
    const api = useApi(token)

    const[name,setName] = useState('')
    const[description,setDescription] = useState('')
    const[isLoading,setIsLoading] = useState(false)

    useEffect(() => {
        if(props.module) {
            setName(props.module.name)
            if(props.module.description)
                setDescription(props.module.description)
        } else {
            clearForm()
        }
    }, [props.module])

    function getData(): DataType {
        let data = { name: name } as DataType
        if(description.trim().length > 0)
            data.description = description

        return data;
    }

    function save(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        if(props.module)
            update()
        else
            saveNew()
    }

    function saveNew() {
        const data = getData()
        api.post(`/packs/${props.pack?.id}/modules`, data)
        .then(
            response => {
                props.handleSave&& props.handleSave(response.data)
                close()
            }
        )
        .catch()
        .finally(() => setIsLoading(false))
    }

    function update() {
        const data = getData()
        api.put(`/packs/${props.pack?.id}/modules/${props.module?.id}`, data)
        .then(
            response => {
                props.handleUpdate&& props.handleUpdate(response.data)
                close()
            }
        )
        .catch()
        .finally(() => setIsLoading(false))
    }

    function close() {
        props.handleClose&& props.handleClose()
    }

    function clearForm() {
        setName('')
    }

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header>
                <Modal.Title>
                    { props.module? 'Editar módulo' : 'Novo módulo' }
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <LoadingContainer show={isLoading}/>
                    <Form.Group className='mb-2'>
                        <h5>{ props.pack?.name }</h5>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Control 
                            type='text'
                            placeholder='Nome'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength={191}/>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Control 
                            type='text'
                            placeholder='Descrição'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={256}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant='secondary'
                        onClick={close}>
                        Cancelar
                    </Button>
                    <Button 
                        type='submit'>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ModuleForm;
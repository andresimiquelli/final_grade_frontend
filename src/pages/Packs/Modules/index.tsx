import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useAuth } from '../../../context/auth';
import { useApi } from '../../../services/api';
import { useNav, MenuKeys } from '../../../context/nav';
import packModuleType from '../../../services/apiTypes/PackModule';
import DefaultTable from '../../../components/DefaultTable';
import ButtonColumn from '../../../components/ButtonColumn';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaAddressBook } from 'react-icons/fa'; 
import LoadingContainer from '../../../components/LodingContainer';
import ContentToolBar from '../../../components/ContentToolBar';
import { HiPlus } from 'react-icons/hi';
import packType from '../../../services/apiTypes/Pack';
import ModuleForm from './ModuleForm';
import PaginatorDefault from '../../../components/PaginatorDefault';
import { extractError } from '../../../utils/errorHandler';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import uuid from 'react-uuid';
import { CgArrowsExchangeAltV } from 'react-icons/cg';

const Modules: React.FC = () => {

    const { pack_id } = useParams()
    const { token } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu, addErrorMessage } = useNav()
    const navigate = useNavigate()

    const[modules,setModules] = useState([] as packModuleType[])
    const[pack,setPack] = useState<packType>()
    const[currentPage,setCurrentPage] = useState(1)
    const[totalPages,setTotalPages] = useState(1)

    const[isLoading,setIsLoading] = useState(false)
    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<packModuleType | undefined>()
    const[showDeleteModal,setShowDeleteModal] = useState(false)

    useEffect(() => {
        setContentTitle("Módulos")
        setSelectedMenu(MenuKeys.PACKS)
        loadPack()
    },[])

    function loadPack() {
        setIsLoading(true)
        api.get(`/packs/${pack_id}`)
        .then(
            response => {
                setPack(response.data)
                loadModules()
            }
        )
        .catch(
            error => {
                setIsLoading(false)
                addErrorMessage(extractError(error))
            }
        )
    }

    function getFilters(page: number = 1) {
        return '?page='+page
    }

    function loadModules(page: number = 1) {
        setIsLoading(true)
        api.get(`/packs/${pack_id}/modules`+getFilters(page))
        .then(
            response => {
                setModules(response.data.data)
                setCurrentPage(response.data.current_page)
                setTotalPages(response.data.last_page)
            }
        )
        .finally(
            () => setIsLoading(false)
        )
        .catch( error => addErrorMessage(extractError(error)))
    }

    function handleSave(module: packModuleType) {
        setModules([module, ...modules])
    }

    function handleUpdate(nModule: packModuleType) {
        setModules(current => current.map(module => module.id === nModule.id? nModule : module))
    }

    function closeForm() {
        setShowForm(false)
    }

    function editModule(module: packModuleType) {
        setSelected(module)
        setShowForm(true)
    }

    function deleteModule(module: packModuleType) {
        setSelected(module)
        setShowDeleteModal(true)
    }

    function deleteModuleConfirm() {
        setShowDeleteModal(false)
        api.delete(`/packs/${pack_id}/modules/${selected?.id}`)
        .then(() => setModules(current => current.filter(module => module.id!==selected?.id)))
        .catch( error => addErrorMessage(extractError(error)))
    }

    function deleteModuleCancel() {
        setShowDeleteModal(false)
        setSelected(undefined)
    }

    function onDrag(result: DropResult) {
        const from = result.source.index
        const to = result.destination? result.destination.index : from
        
        if(from !== to ) {
           let ids: number[] = []
           let nModules = modules 
           nModules.splice(to,0,nModules.splice(from,1)[0])
           nModules.forEach((m,i) => {ids.push(m.id); m.order = i+1})
           setIsLoading(true)
           api.post(`/reorder/modules`, {ids: ids})
             .then(() => setModules(nModules))
             .catch(error => addErrorMessage(error))
             .finally(() => setIsLoading(false))
        }
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ordem</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <DragDropContext onDragEnd={onDrag}>
                    <Droppable droppableId={uuid()}>
                        {(provided, _) => (
                            <tbody 
                                ref={provided.innerRef}
                                {...provided.droppableProps}>
                            {
                                modules.map((module, index) => (
                                    <Draggable 
                                        key={module.id} 
                                        index={index} 
                                        draggableId={`d_${module.id}`}>
                                        {(p, _) => (
                                            <tr 
                                                ref={p.innerRef}  
                                                {...p.draggableProps}>
                                                <td>{module.name}</td>
                                                <td>{module.description}</td>
                                                <td {...p.dragHandleProps}>{module.order} <CgArrowsExchangeAltV /></td>
                                                <td>
                                                    <ButtonColumn>
                                                        <button 
                                                            className='secondary'
                                                            onClick={() => editModule(module)}>
                                                                <FaEdit/>
                                                        </button>
                                                        <button className='secondary' onClick={() => deleteModule(module)}><FaTrash/></button>
                                                        <button
                                                            className='ml-1'
                                                            onClick={() => { navigate(`/packs/${pack_id}/modules/${module.id}/subjects`) }}>
                                                            <FaAddressBook /><span>Disciplinas</span>
                                                        </button>
                                                    </ButtonColumn>
                                                </td>
                                            </tr> 
                                        )}
                                    </Draggable>
                                )
                                )
                            }
                                                         
                            </tbody>
                        )}
                    </Droppable>
                </DragDropContext>
            </DefaultTable>
        )
    }

    return (
        <Container className='position-relative' fluid>
            <LoadingContainer show={isLoading}/>
            <ConfirmationModal
                title='Excluir módulo'
                subtitle={`Deseja confirmar a exclusão de ${selected?.name}?`}
                show={showDeleteModal}
                onCancel={deleteModuleCancel}
                onClose={deleteModuleCancel}
                onConfirm={deleteModuleConfirm}> 
                A exclusão não será possível caso haja resgistros vinculados a este.
            </ConfirmationModal>
            <ModuleForm 
                show={showForm}
                pack={pack}
                module={selected}
                handleSave={handleSave}
                handleUpdate={handleUpdate}
                handleClose={closeForm}/>
            <ContentToolBar>
                <div></div>
                <PaginatorDefault
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={(page) => loadModules(page)} />
                <div>
                    <Button
                        onClick={() => setShowForm(true)}>
                            <HiPlus />
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

export default Modules;
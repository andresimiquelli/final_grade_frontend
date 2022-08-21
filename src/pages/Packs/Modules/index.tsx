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

const Modules: React.FC = () => {

    const { pack_id } = useParams()
    const { token } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu } = useNav()
    const navigate = useNavigate()

    const[modules,setModules] = useState([] as packModuleType[])
    const[pack,setPack] = useState<packType>()
    const[currentPage,setCurrentPage] = useState(1)
    const[totalPages,setTotalPages] = useState(1)

    const[isLoading,setIsLoading] = useState(false)
    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<packModuleType | undefined>()

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
                console.log(error)
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
                <tbody>
                {
                    modules.map(module => 
                        <tr key={module.id}>
                            <td>{module.name}</td>
                            <td>{module.description}</td>
                            <td>{module.order}</td>
                            <td>
                                <ButtonColumn>
                                    <button 
                                        className='secondary'
                                        onClick={() => editModule(module)}>
                                            <FaEdit/>
                                    </button>
                                    <button className='secondary'><FaTrash/></button>
                                    <button
                                        className='ml-1'
                                        onClick={() => { navigate(`/packs/${pack_id}/modules/${module.id}/subjects`) }}>
                                        <FaAddressBook /><span>Disciplinas</span>
                                    </button>
                                </ButtonColumn>
                            </td>
                        </tr>    
                    )
                }
                </tbody>
            </DefaultTable>
        )
    }

    return (
        <Container className='position-relative'>
            <LoadingContainer show={isLoading}/>
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
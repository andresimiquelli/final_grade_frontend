import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { HiPlus, HiSearch } from 'react-icons/hi';
import ContentToolBar from '../../components/ContentToolBar';
import { useNav, MenuKeys } from '../../context/nav';
import classType from '../../services/apiTypes/Class';
import { useAuth } from '../../context/auth';
import { useApi } from '../../services/api';
import DefaultTable from '../../components/DefaultTable';
import ButtonColumn from '../../components/ButtonColumn';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { RiBookletFill } from 'react-icons/ri';
import { dateRenderer } from '../../utils/dateRenderer';
import LoadingContainer from '../../components/LodingContainer';
import PackFrame from '../../frames/PackFrame';
import packType from '../../services/apiTypes/Pack';
import ClassForm from './ClassForm';
import PaginatorDefault from '../../components/PaginatorDefault';
import { extractError } from '../../utils/errorHandler';

const Classes: React.FC = () => {

    const navigate = useNavigate()
    const {setContentTitle, setSelectedMenu, addErrorMessage} = useNav()
    const { token } = useAuth()
    const api = useApi(token)

    const[classes,setClasses] = useState<classType[]>([])
    const[currentPage,setCurrentPage] = useState(1)
    const[totalPages,setTotalPages] = useState(1)
    const[searchName,setSearchName] = useState('')

    const[isLoading,setIsLoading] = useState(false)
    const[showPackFrame,setShowPackFrame] = useState(false)
    const[selectedPack,setSelectedPack] = useState<packType | undefined>()
    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<classType | undefined>()

    useEffect(() => {
        setContentTitle("Turmas")
        setSelectedMenu(MenuKeys.CLASSES)
        loadClasses()
    },[])

    function getFilters(page: number = 1) {
        let filters = '?'

        if(searchName.trim().length>0)
            filters += "filters=name:like:"+encodeURI("%"+searchName+"%")

        filters += filters.length>1? '&' : ''

        filters += 'page='+page

        return filters
    }

    function loadClasses(page: number = 1) {
        setIsLoading(true)

        api.get('/classes'+getFilters(page))
        .then(
            response => {
                setClasses(response.data.data)
                setTotalPages(response.data.last_page)
                setCurrentPage(response.data.current_page)
            }
        )
        .finally(
            () => setIsLoading(false)
        )
        .catch( error => addErrorMessage(extractError(error)))
    }

    function showTable() { 
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Pacote</th>
                        <th>Início</th>
                        <th>Final</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {
                    classes.map(cclass => 
                        <tr key={cclass.id}>
                            <td>{cclass.name}</td>
                            <td>{cclass.pack?.name}</td>
                            <td>{dateRenderer(cclass.start_at)}</td>
                            <td>{dateRenderer(cclass.end_at)}</td>
                            <td>
                                <ButtonColumn>
                                    <button onClick={() => navigate(`/journals/${cclass.id}`)}>
                                        <RiBookletFill />
                                        <span>Diários</span>
                                    </button>
                                    <button 
                                        className='secondary'
                                        onClick={() => editClass(cclass)}>
                                        <FaEdit />
                                    </button>
                                    <button className='secondary'><FaTrash /></button>
                                </ButtonColumn>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </DefaultTable>
        )
    }

    function selectPack(pack: packType) {
        setSelectedPack(pack)
        setShowPackFrame(false)
        setShowForm(true)
    }

    function closePackFrame() {
        setShowPackFrame(false)
        setSelectedPack(undefined)
    }

    function editClass(cClass: classType) {
        setSelected(cClass)
        setShowForm(true)
    }

    function handleSave(cClass: classType) {
        setClasses([cClass, ...classes])
    }

    function handleUpdate(nClass: classType) {
        setClasses(current => current.map(cclass => cclass.id===nClass.id? nClass : cclass))
    }

    function closeForm() {
        setSelected(undefined)
        setSelectedPack(undefined)
        setShowForm(false)
    }

    function search(e: React.FormEvent) {
        e.preventDefault()
        loadClasses()
    }

    return (
        <Container className='position-relative' fluid>
            <LoadingContainer show={isLoading}/>
            <PackFrame 
                show={showPackFrame}
                handleSelect={selectPack}
                handleClose={closePackFrame}/>
            <ClassForm 
                show={showForm}
                cClass={selected}
                handleClose={closeForm}
                handleSave={handleSave}
                handleUpdate={handleUpdate}
                pack={selectedPack}/>
            <ContentToolBar>
                <Form onSubmit={search}>
                    <Row>
                        <Col sm="11">
                            <Form.Control 
                                type='text'
                                placeholder='Buscar turma'
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}/>
                        </Col>
                        <Col sm="1">
                            <Button
                                type='submit'>
                                <HiSearch />
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <PaginatorDefault
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={(page) => loadClasses(page)}/>
                <div>
                    <Button onClick={() => setShowPackFrame(true)}><HiPlus /></Button>
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

export default Classes;
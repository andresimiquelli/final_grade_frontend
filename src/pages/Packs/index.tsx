import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiPlus, HiSearch } from 'react-icons/hi';
import ContentToolBar from '../../components/ContentToolBar';
import DefaultTable from '../../components/DefaultTable';
import LoadingContainer from '../../components/LodingContainer';
import packType from '../../services/apiTypes/Pack';
import { useAuth } from '../../context/auth';
import { useApi } from '../../services/api';
import { useNav, MenuKeys } from '../../context/nav';
import courseType from '../../services/apiTypes/Course';
import PackForm from './PackForm';
import CourseFrame from '../../frames/CourseFrame';
import { IoExtensionPuzzleSharp } from 'react-icons/io5';
import ButtonColumn from '../../components/ButtonColumn';
import PaginatorDefault from '../../components/PaginatorDefault';

const Packs: React.FC = () => {

    const { token } = useAuth()
    const api = useApi(token)
    const { setContentTitle, setSelectedMenu } = useNav()
    const navigate = useNavigate()

    const[packs,setPacks] = useState([] as packType[])
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)
    const[searchName,setSearchName] = useState('')

    const[isLoading,setIsLoading] = useState(false)
    const[showFrameCourses,setShowFrameCourses] = useState(false)
    const[showForm,setShowForm] = useState(false)
    const[selectedCourse,setSelectedCourse] = useState<courseType | undefined>()
    const[seleted,setSelected] = useState<packType | undefined>()

    useEffect(() => {
        setSelectedMenu(MenuKeys.PACKS)
        setContentTitle("Pacotes didáticos")
        loadPacks()
    },[])

    function getFilters(page: number = 1) {
        let filters = '?'

        if(searchName.trim().length>0)
            filters += "filters=name:like:"+encodeURI("%"+searchName+"%")

        filters += filters.length>1? '&' : ''

        filters += 'page='+page

        return filters
    }

    function loadPacks(page: number = 1) {
        setIsLoading(true)
        api.get('/packs'+getFilters(page))
        .then(
            response => {
                setPacks(response.data.data)
                setTotalPages(response.data.last_page)
                setCurrentPage(response.data.current_page)
            }
        )
        .finally(
            () => setIsLoading(false)
        )
    }

    function editPack(pack: packType) {
        setSelected(pack)
        setSelectedCourse(pack.course? pack.course : undefined)
        setShowForm(true)
    }

    function hadleSelect(course: courseType) {
        setSelectedCourse(course)
        setSelected(undefined)
        setShowFrameCourses(false)
        setShowForm(true)
    }

    function toModules(pack_id: number) {
        navigate('/packs/'+pack_id+'/modules')
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Curso</th>
                        <th>Descrição</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                {
                    packs.map(pack => 
                        <tr key={pack.id}>
                            <td>{pack.name}</td>
                            <td>{pack.course?.name}</td>
                            <td>{pack.description}</td>
                            <td>
                                <ButtonColumn>
                                    <button className='secondary' 
                                        onClick={() => editPack(pack)}>
                                            <FaEdit />
                                    </button>
                                    <button className='secondary'><FaTrash /></button>
                                    <button className='ml-1' onClick={() => toModules(pack.id)}>
                                        <IoExtensionPuzzleSharp />
                                        <span>Módulos</span>
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

    function closeFrameCourse() {
        setShowFrameCourses(false)
        setSelectedCourse(undefined)
    }

    function handleSave(pack: packType) {
        setPacks([pack,...packs])
        setShowForm(false)
    }

    function handleUpdate(nPack: packType) {
        setPacks((current) => current.map(pack => nPack.id === pack.id? nPack : pack))
        setShowForm(false)
    }

    function search(e: React.FormEvent) {
        e.preventDefault()
        loadPacks()
    }

    return (
        <Container className='position-relative'>
            <LoadingContainer show={isLoading}/>
            <CourseFrame 
                show={showFrameCourses}
                handleClose={closeFrameCourse}
                handleSelect={hadleSelect}/>
            <PackForm 
                course={selectedCourse}
                pack={seleted}
                show={showForm}
                handleClose={() => setShowForm(false)}
                handleSave={handleSave}
                handleUpdate={handleUpdate}/>
            <ContentToolBar>
                <Form onSubmit={search}>
                    <Row>
                        <Col sm="11">
                            <Form.Control 
                                type='text'
                                placeholder='Buscar pacote didático'
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
                    onChange={(page) => loadPacks(page)}/>
                <div>
                    <Button
                        onClick={() => setShowFrameCourses(true)}>
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

export default Packs;
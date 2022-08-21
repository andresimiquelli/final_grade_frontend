import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useAuth } from '../../../../context/auth';
import { useApi } from '../../../../services/api';
import { useNav, MenuKeys } from '../../../../context/nav';
import packModuleSubjectType from '../../../../services/apiTypes/PackModuleSubject';
import packModuleType from '../../../../services/apiTypes/PackModule';
import LoadingContainer from '../../../../components/LodingContainer';
import ContentToolBar from '../../../../components/ContentToolBar';
import DefaultTable from '../../../../components/DefaultTable';
import ButtonColumn from '../../../../components/ButtonColumn';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { HiPlus } from 'react-icons/hi';
import { subjectLoadRenderer } from '../../../../utils/subjectLoadRenderer';
import SubjectFrame from '../../../../frames/SubjectFrame';
import subjectType from '../../../../services/apiTypes/Subject';
import ModuleSubjectForm from './ModuleSubjectForm';
import PaginatorDefault from '../../../../components/PaginatorDefault';

const ModuleSubjects: React.FC = () => {

    const { setContentTitle, setSelectedMenu } = useNav()
    const { pack_id, module_id } = useParams()
    const { token } = useAuth()
    const api = useApi(token)

    const[subjects,setSubjects] = useState([] as packModuleSubjectType[])
    const[module,setModule] = useState<packModuleType>()
    const[currentPage,setCurrentPage] = useState(1)
    const[totalPages,setTotalPages] = useState(1)

    const[isLoading,setIsLoading] = useState(false)
    const[showSubjectFrame,setShowSubjectFrame] = useState(false)
    const[selectedSubject,setSelectedSubject] = useState<subjectType | undefined>()

    const[showForm,setShowForm] = useState(false)
    const[selected,setSelected] = useState<packModuleSubjectType | undefined>()

    useEffect(() => {
        setContentTitle("Disciplinas")
        setSelectedMenu(MenuKeys.PACKS)
        loadModule()
    },[])

    function loadModule() {
        api.get(`/packs/${pack_id}/modules/${module_id}?with=pack`)
        .then(
            response => {
                setModule(response.data)
                loadSubjects()
            }
        )
        .catch(
            () => {
                setIsLoading(false)
            }
        )
    }

    function getFilters(page: number = 1) {
        return '?page='+page
    }

    function loadSubjects(page: number = 1) {
        setIsLoading(true)
        api.get(`/packs/${pack_id}/modules/${module_id}/subjects`+getFilters(page))
        .then(
            response => {
                setSubjects(response.data.data)
                setCurrentPage(response.data.current_page)
                setTotalPages(response.data.last_page)
            }
        )
        .finally(
            () => setIsLoading(false)
        )
    }

    function selectSubject(subject: subjectType) {
        setSelectedSubject(subject)
        setShowSubjectFrame(false)
        setShowForm(true)
    }

    function closeSubjectFrame() {
        setSelectedSubject(undefined)
        setShowSubjectFrame(false)
        
    }

    function editSubject(subject: packModuleSubjectType) {
        setSelected(subject)
        setShowForm(true)
    }

    function closeForm() {
        setShowForm(false)
        setSelected(undefined)
    }

    function showTable() {
        return (
            <DefaultTable>
                <thead>
                    <tr>
                        <th>Disciplina</th>
                        <th>Carga horária</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                {
                    subjects.map(subject => 
                        <tr key={subject.id}>
                            <td>{subject.subject.name}</td>
                            <td>{subjectLoadRenderer(subject.load)}</td>
                            <td>
                                <ButtonColumn>
                                    <button 
                                        className='secondary'
                                        onClick={() => editSubject(subject)}>
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

    function handleSave(subject: packModuleSubjectType) {
        setSubjects([subject, ...subjects])
    }

    function handleUpdate(nSubject: packModuleSubjectType) {
        setSubjects(current => current.map(subject => nSubject.id===subject.id? nSubject : subject))
    }

    return (
        <Container className='poition-relative'>
            <LoadingContainer show={isLoading}/>
            <SubjectFrame 
                show={showSubjectFrame}
                handleSelect={selectSubject}
                handleClose={closeSubjectFrame}/>
            <ModuleSubjectForm 
                show={showForm} 
                    packModuleId={parseInt(module_id ?? "0")} 
                    packId={parseInt(pack_id ?? "0")}
                    selectedSubject={selectedSubject}
                    moduleSubject={selected}
                    handleClose={closeForm}
                    handleSave={handleSave}
                    handleUpdate={handleUpdate}/>
            <ContentToolBar>
                <div></div>
                <PaginatorDefault
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={(page) => loadSubjects(page)} />
                <div>
                    <Button onClick={() => setShowSubjectFrame(true)}><HiPlus /></Button>
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

export default ModuleSubjects;
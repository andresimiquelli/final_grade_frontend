import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import ContentToolBar from '../ContentToolBar';
import { useAuth } from '../../context/auth';
import { useApi } from '../../services/api';

import { SearchForm } from './styles';
import LoadingContainer from '../LodingContainer';

type filterParamType = {
    field: string;
    value: string;
}

interface FrameModalProps<T> {
    show?: boolean;
    handleClose?(): void;
    title?: string;
    searchPlaceholder?: string;
    searchField?: string;
    searchOperator?: '=' | 'like';
    filterParams?: filterParamType[];
    endpoint: string;
    withFields?: string[];
    handleShowResult(items: T[]): void;
    children: React.ReactNode;
    subheader?: React.ReactNode;
}

function FrameModal<T>(props: FrameModalProps<T>) {

    const { token } = useAuth()
    const api = useApi(token)

    const[searchText,setSearchText] = useState('')
    const[isLoading,setIsLoading] = useState(false)
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

    useEffect(() => {
        if(props.show)
            load()
    },[props.show])

    function load(searchBy: string = '', page: number = 1) {
        let query = "?page="+page
        let filters = getFilterString(searchBy)

        if(filters.length > 0)
            query += "&"+filters

        if(props.withFields) {
            query += "&with="
            props.withFields.forEach((field, index) => {
                query += field
                if(index < ((props.withFields?.length ?? 0) -1)) {
                    query += ","
                }
            })
        }           

        setIsLoading(true)
        api.get(props.endpoint+query)
        .then(
            response => {
                props.handleShowResult(response.data.data)
                setCurrentPage(response.data.current_page)
                setTotalPages(response.data.last_page)
            }
        )
        .finally(
            () => setIsLoading(false)
        )
    }

    function getFilterString(value: string = ""): string {
        let query = ""

        if(props.filterParams) {
            query += "filters="

            props.filterParams.forEach((item,index) => {
                if(index > 0)
                    query += ","

                query += item.field+":"+item.value
            })
        }

        if(props.searchField) {
            if(value.trim().length > 0) {
                if(query.length > 0)
                    query += ","
                else
                    query += "filters="
    
                query += props.searchField+":"
    
                if(props.searchOperator === 'like')
                    query += encodeURI("like:%"+value+"%")
                else
                    query += encodeURI(value)
            }
        }

        return query
    }

    function search(e: React.FormEvent) {
        e.preventDefault()
        load(searchText)
    }

    return (
        <Modal show={props.show} size="lg" onHide={props.handleClose}>
            <Modal.Header>
                <Modal.Title>{props.title? props.title : 'Selecionar'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='position-relative'>
                <LoadingContainer show={isLoading} />
                <ContentToolBar>
                {
                    props.subheader&&
                        <div>
                            { props.subheader }
                        </div>
                }
                    <div>
                    {
                        props.searchField&&
                        <SearchForm onSubmit={search}>
                            <Form.Control 
                                type='text' 
                                placeholder={props.searchPlaceholder? props.searchPlaceholder : 'Buscar'}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}/>
                            &nbsp;<Button type='submit'><FaSearch /></Button>
                        </SearchForm>
                    }                        
                    </div>
                    <div></div>
                </ContentToolBar>
                <div>
                    { props.children }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={props.handleClose}>Fechar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FrameModal;
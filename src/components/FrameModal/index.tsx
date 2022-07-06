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
    handleSelect?(item: T): void;
    handleClose?(): void;
    title?: string;
    searchPlaceholder?: string;
    searchField: string;
    searchOperator?: '=' | 'like';
    filterParams?: filterParamType[];
    endpoint: string;
    handleShowResult(items: T[]): void;
    children: React.ReactNode;
}

function FrameModal<T>(props: FrameModalProps<T>) {

    const { token } = useAuth()
    const api = useApi(token)

    const[searchText,setSearchText] = useState('')
    const[isLoading,setIsLoading] = useState(false)
    const[totalPages,setTotalPages] = useState(1)
    const[currentPage,setCurrentPage] = useState(1)

    useEffect(() => {
        load()
    },[])

    function load(searchBy: string = '', page: number = 1) {
        let query = "?page="+page
        let filters = getFilterString(searchBy)

        if(filters.length > 0)
            query += "&"+filters

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

        if(value.trim().length > 0) {
            if(query.length > 0)
                query += ","
            else
                query += "filters="

            query += props.searchField+":"

            if(props.searchOperator === 'like')
                query += "like:%"+value+"%"
            else
                query += value
        }

        return query
    }

    function search(e: React.FormEvent) {
        e.preventDefault()
        load(searchText)
    }

    function close() {
        setSearchText('')
        props.handleClose&& props.handleClose()
    }

    return (
        <Modal show={props.show} size="lg">
            <Modal.Header>
                <Modal.Title>{props.title? props.title : 'Selecionar'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className='position-relative'>
                <LoadingContainer show={isLoading} />
                <ContentToolBar>
                    <div>
                        <SearchForm onSubmit={search}>
                            <Form.Control 
                                type='text' 
                                placeholder={props.searchPlaceholder? props.searchPlaceholder : 'Buscar'}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}/>
                            &nbsp;<Button type='submit'><FaSearch /></Button>
                        </SearchForm>
                    </div>
                    <div></div>
                </ContentToolBar>
                <div>
                    { props.children }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary'>Fechar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FrameModal;
import React from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import { Container, PageNumber } from './styles';

interface PaginatorDefaultProps {
    totalPages: number;
    currentPage: number;
    onChange(page: number): void;
}

const PaginatorDefault: React.FC<PaginatorDefaultProps> = ({ totalPages, currentPage, onChange }) => {

    function handleChange(page: number) {
        if(page <= totalPages) {
            if(page > 0) {
                onChange(page)
            }
        }
    }

    return (
        <Container>
            <button
                disabled={currentPage<2}
                onClick={() => handleChange(currentPage-1)}>
                <MdKeyboardArrowLeft />
            </button>
            <PageNumber>{currentPage}</PageNumber>
            <button
                disabled={currentPage===totalPages}
                onClick={() => handleChange(currentPage+1)}>
                <MdKeyboardArrowRight />
            </button>
        </Container>
    );
}

export default PaginatorDefault;
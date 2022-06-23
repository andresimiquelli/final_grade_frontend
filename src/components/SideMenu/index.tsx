import React from 'react';
import { useNavigate } from 'react-router-dom'
import { useNav, MenuKeys } from '../../context/nav';

import { Container, Title, Item } from './styles';

import { FaUsers, FaChalkboardTeacher, FaAddressBook, FaUserGraduate, FaBookReader, FaBoxOpen } from 'react-icons/fa';
import { MdSpaceDashboard } from 'react-icons/md'

const SideMenu: React.FC = () => {

    const { selectedMenu } = useNav()
    const navigate = useNavigate()

    function vefSelectedMenu(key: string): string {
        return selectedMenu===key? 'selected' : ''
    }

    function handleSelectMenu(to: string) {
        navigate(to)
    }

    return (
        <Container>
            <Title>Administrativo</Title>
            <Item 
                className={vefSelectedMenu(MenuKeys.DASHBOARD)}
                onClick={() => handleSelectMenu('/')}>
                <div  className='icon'>
                    <MdSpaceDashboard />
                </div>
                <div className='text'>
                    Inicial
                </div>
            </Item>
            <Item 
                className={vefSelectedMenu(MenuKeys.STUDENTS)}
                onClick={() => handleSelectMenu('students')}>
                <div  className='icon'>
                    <FaUserGraduate />
                </div>
                <div className='text'>
                    Alunos
                </div>
            </Item>
            <Item className={vefSelectedMenu(MenuKeys.TEACHERS)}>
                <div  className='icon'>
                    <FaChalkboardTeacher />
                </div>
                <div className='text'>
                    Professores
                </div>
            </Item>
            <Item className={vefSelectedMenu(MenuKeys.SUBJECTS)}>
                <div  className='icon'>
                    <FaAddressBook />
                </div>
                <div className='text'>
                    Disciplinas
                </div>
            </Item>
            <Item className={vefSelectedMenu(MenuKeys.COURSES)}>
                <div  className='icon'>
                    <FaBookReader />
                </div>
                <div className='text'>
                    Cursos
                </div>
            </Item>
            <Item className={vefSelectedMenu(MenuKeys.PACKS)}>
                <div  className='icon'>
                    <FaBoxOpen />
                </div>
                <div className='text'>
                    Pacotes didáticos
                </div>
            </Item>
        </Container>
    );
}

export default SideMenu;
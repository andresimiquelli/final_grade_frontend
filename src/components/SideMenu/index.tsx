import React from "react";
import { useNavigate } from "react-router-dom";
import { useNav, MenuKeys } from "../../context/nav";

import { Container, Title, Item } from "./styles";

import {
  FaUsers,
  FaChalkboardTeacher,
  FaAddressBook,
  FaUserGraduate,
  FaBookReader,
  FaBoxOpen,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { IoPeopleCircleSharp } from "react-icons/io5";

const SideMenu: React.FC = () => {
  const { selectedMenu } = useNav();
  const navigate = useNavigate();

  function vefSelectedMenu(key: string): string {
    return selectedMenu === key ? "selected" : "";
  }

  function handleSelectMenu(to: string) {
    navigate(to);
  }

  return (
    <Container>
      <Title>Administrativo</Title>
      <Item
        className={vefSelectedMenu(MenuKeys.USERS)}
        onClick={() => handleSelectMenu("users")}
      >
        <div className="icon">
          <FaUsers />
        </div>
        <div className="text">Usuários</div>
      </Item>
      <Item
        className={vefSelectedMenu(MenuKeys.STUDENTS)}
        onClick={() => handleSelectMenu("students")}
      >
        <div className="icon">
          <FaUserGraduate />
        </div>
        <div className="text">Alunos</div>
      </Item>
      <Item
        className={vefSelectedMenu(MenuKeys.SUBJECTS)}
        onClick={() => handleSelectMenu("subjects")}
      >
        <div className="icon">
          <FaAddressBook />
        </div>
        <div className="text">Disciplinas</div>
      </Item>
      <Item
        className={vefSelectedMenu(MenuKeys.COURSES)}
        onClick={() => handleSelectMenu(MenuKeys.COURSES)}
      >
        <div className="icon">
          <FaBookReader />
        </div>
        <div className="text">Cursos</div>
      </Item>
      <Item
        className={vefSelectedMenu(MenuKeys.PACKS)}
        onClick={() => handleSelectMenu(MenuKeys.PACKS)}
      >
        <div className="icon">
          <FaBoxOpen />
        </div>
        <div className="text">Pacotes didáticos</div>
      </Item>
      <Item
        className={vefSelectedMenu(MenuKeys.CLASSES)}
        onClick={() => handleSelectMenu(MenuKeys.CLASSES)}
      >
        <div className="icon">
          <IoPeopleCircleSharp />
        </div>
        <div className="text">Turmas</div>
      </Item>
    </Container>
  );
};

export default SideMenu;

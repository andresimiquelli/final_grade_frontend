import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNav, MenuKeys } from "../../context/nav";
import { useAuth } from "../../context/auth";
import { useApi } from "../../services/api";
import studentType from "../../services/apiTypes/Student";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ContentToolBar from "../../components/ContentToolBar";
import { HiPlus, HiSearch } from "react-icons/hi";
import { FaUserEdit, FaTrash, FaLink } from "react-icons/fa";
import DefaultTable from "../../components/DefaultTable";
import StudentForm from "./StudentForm";
import LoadingContainer from "../../components/LodingContainer";
import ButtonColumn from "../../components/ButtonColumn";
import PaginatorDefault from "../../components/PaginatorDefault";
import { extractError } from "../../utils/errorHandler";
import ConfirmationModal from "../../components/ConfirmationModal";
import PageGrid from "../../components/PageGrid";

const Students: React.FC = () => {
  const { setSelectedMenu, addErrorMessage, setContentTitle } = useNav();
  const { token } = useAuth();
  const api = useApi(token);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([] as studentType[]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<studentType | undefined>(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setSelectedMenu(MenuKeys.STUDENTS);
    setContentTitle("Alunos");
    loadStudents();
  }, []);

  function getFilters(page: number) {
    let filters = "?";
    let fields = "";

    if (searchName.trim().length > 0)
      fields += "filters=name:like:" + encodeURI("%" + searchName + "%");

    if (searchEmail.trim().length > 0) {
      fields += fields.length > 0 ? "," : "filters=";
      fields += "email:like:" + encodeURI("%" + searchEmail + "%");
    }

    filters += fields;

    filters += filters.length > 1 ? "&" : "";

    filters += "page=" + page;

    return filters;
  }

  function loadStudents(page: number = 1) {
    setIsLoading(true);
    api
      .get("/students" + getFilters(page))
      .then((response) => {
        setStudents(response.data.data);
        setTotalPages(response.data.last_page);
        setCurrentPage(response.data.current_page);
      })
      .finally(() => setIsLoading(false))
      .catch((error) => addErrorMessage(extractError(error)));
  }

  function editStudent(student: studentType) {
    setSelected(student);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setSelected(undefined);
  }

  function handleSave(student: studentType) {
    setStudents([...students, student]);
  }

  function handleUpdate(nStudent: studentType) {
    setStudents(
      students.map((student) => {
        return nStudent.id === student.id ? nStudent : student;
      })
    );
  }

  function deleteStudent(subject: studentType) {
    setSelected(subject);
    setShowDeleteModal(true);
  }

  function deleteStudentConfirm() {
    setShowDeleteModal(false);
    api
      .delete(`/students/${selected?.id}`)
      .then(() =>
        setStudents((current) =>
          current.filter((student) => student.id !== selected?.id)
        )
      )
      .catch((error) => addErrorMessage(extractError(error)));
  }

  function deleteStudentCancel() {
    setShowDeleteModal(false);
    setSelected(undefined);
  }

  function showTable() {
    return (
      <DefaultTable>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td>
                <ButtonColumn>
                  <button
                    className="mr-2"
                    onClick={() =>
                      navigate(`/students/${student.id}/enrollments`)
                    }
                  >
                    <FaLink /> <span>Matrículas</span>
                  </button>
                  <button
                    className="secondary"
                    onClick={() => editStudent(student)}
                  >
                    <FaUserEdit />
                  </button>{" "}
                  &nbsp;
                  <button
                    className="secondary"
                    onClick={() => deleteStudent(student)}
                  >
                    <FaTrash />
                  </button>
                </ButtonColumn>
              </td>
            </tr>
          ))}
        </tbody>
      </DefaultTable>
    );
  }

  function search(e: React.FormEvent) {
    e.preventDefault();
    loadStudents();
  }

  return (
    <PageGrid>
      <LoadingContainer show={isLoading} />
      <ConfirmationModal
        title="Excluir aluno"
        subtitle={`Deseja confirmar a exclusão de ${selected?.name}?`}
        show={showDeleteModal}
        onCancel={deleteStudentCancel}
        onClose={deleteStudentCancel}
        onConfirm={deleteStudentConfirm}
      >
        A exclusão não será possível caso haja resgistros vinculados a este.
      </ConfirmationModal>
      <StudentForm
        show={showForm}
        student={selected}
        handleClose={handleCloseForm}
        handleSave={handleSave}
        handleUpdate={handleUpdate}
      />
      <div className="fixedTop">
        <ContentToolBar>
          <Form onSubmit={search}>
            <Row>
              <Col sm="5">
                <Form.Control
                  type="text"
                  placeholder="Buscar nome"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </Col>
              <Col sm="6">
                <Form.Control
                  type="email"
                  placeholder="Buscar e-mail"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </Col>
              <Col sm="1">
                <Button type="submit">
                  <HiSearch />
                </Button>
              </Col>
            </Row>
          </Form>
          <PaginatorDefault
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={(page) => loadStudents(page)}
          />
          <div>
            <Button onClick={() => setShowForm(true)}>
              <HiPlus />
            </Button>
          </div>
        </ContentToolBar>
      </div>
      <div className="content">
        <Row>
          <Col className="p-0">{showTable()}</Col>
        </Row>
      </div>
    </PageGrid>
  );
};

export default Students;

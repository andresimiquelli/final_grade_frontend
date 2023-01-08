import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import enrollmentType from "../../../services/apiTypes/Enrollment";
import { useAuth } from "../../../context/auth";
import { useApi } from "../../../services/api";
import { useNav, MenuKeys } from "../../../context/nav";

import LoadingContainer from "../../../components/LodingContainer";
import { Button, Col, Container, Row } from "react-bootstrap";
import ContentToolBar from "../../../components/ContentToolBar";
import { HiPlus } from "react-icons/hi";
import DefaultTable from "../../../components/DefaultTable";
import { dateRenderer } from "../../../utils/dateRenderer";
import ButtonColumn from "../../../components/ButtonColumn";
import { FaEdit, FaTrash } from "react-icons/fa";
import ClassFrame from "../../../frames/ClassFrame";
import classType from "../../../services/apiTypes/Class";
import EnrollmentForm from "./EnrollmentForm";
import studentType from "../../../services/apiTypes/Student";
import { extractError } from "../../../utils/errorHandler";
import PaginatorDefault from "../../../components/PaginatorDefault";
import ConfirmationModal from "../../../components/ConfirmationModal";

const Enrollments: React.FC = () => {
  const { student_id } = useParams();
  const { token } = useAuth();
  const api = useApi(token);
  const {
    setContentTitle,
    setContentSubtitle,
    setSelectedMenu,
    addErrorMessage,
  } = useNav();

  const [student, setStudent] = useState<studentType | undefined>();
  const [enrollments, setEnrollments] = useState<enrollmentType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [showClassFrame, setShowClassFrame] = useState(false);
  const [selectedClass, setSelectedClass] = useState<classType | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<enrollmentType | undefined>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setContentTitle("Matrículas");
    setSelectedMenu(MenuKeys.STUDENTS);
    loadStudent();
  }, []);

  function loadStudent() {
    api
      .get("/students/" + student_id)
      .then((response) => {
        setStudent(response.data);
        loadEnrollments();
        setContentSubtitle(response.data.name);
      })
      .catch((error) => {
        setIsLoading(false);
        addErrorMessage(extractError(error));
      });
  }

  function loadEnrollments(page: number = 1) {
    setIsLoading(true);
    api
      .get(
        `/enrollments?filters=student_id:${student_id}&with=cclass&page=${page}`
      )
      .then((response) => {
        setEnrollments(response.data.data);
        setTotalPages(response.data.last_page);
        setCurrentPage(response.data.current_page);
      })
      .catch((error) => addErrorMessage(extractError(error)))
      .finally(() => setIsLoading(false));
  }

  function deleteEnrollment(enrollment: enrollmentType) {
    setSelected(enrollment);
    setShowDeleteModal(true);
  }

  function deleteEnrollmentConfirm() {
    setShowDeleteModal(false);
    api
      .delete(`/enrollments/${selected?.id}`)
      .then(() =>
        setEnrollments((current) =>
          current.filter((enrollment) => enrollment.id !== selected?.id)
        )
      )
      .catch((error) => addErrorMessage(extractError(error)));
  }

  function deleteEnrollmentCancel() {
    setShowDeleteModal(false);
    setSelected(undefined);
  }

  function showTable() {
    return (
      <DefaultTable>
        <thead>
          <tr>
            <th>Turma</th>
            <th>Início</th>
            <th>Término</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id}>
              <td>{enrollment.cclass?.name}</td>
              <td>{dateRenderer(enrollment.start_at)}</td>
              <td>{dateRenderer(enrollment.end_at)}</td>
              <td>{enrollment.status}</td>
              <td>
                <ButtonColumn>
                  <button className="secondary">
                    <FaEdit onClick={() => editEnrollment(enrollment)} />
                  </button>
                  <button
                    className="secondary"
                    onClick={() => deleteEnrollment(enrollment)}
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

  function closeClassFrame() {
    setShowClassFrame(false);
    setSelectedClass(undefined);
  }

  function selectClass(cclass: classType) {
    setSelectedClass(cclass);
    setShowClassFrame(false);
    setShowForm(true);
  }

  function newEnrollment() {
    setShowClassFrame(true);
  }

  function closeForm() {
    setSelectedClass(undefined);
    setSelected(undefined);
    setShowForm(false);
  }

  function handleSave(enrollment: enrollmentType) {
    setEnrollments([enrollment, ...enrollments]);
  }

  function handleUpdate(enrollment: enrollmentType) {
    setEnrollments((current) =>
      current.map((cEnrollment) =>
        cEnrollment.id === enrollment.id ? enrollment : cEnrollment
      )
    );
  }

  function editEnrollment(enrollment: enrollmentType) {
    setSelected(enrollment);
    setShowForm(true);
  }

  return (
    <Container className="position-relative" fluid>
      <LoadingContainer show={isLoading} />
      <ConfirmationModal
        title="Excluir matrícula"
        subtitle={`Deseja confirmar a exclusão de ${selected?.student?.name}?`}
        show={showDeleteModal}
        onCancel={deleteEnrollmentCancel}
        onClose={deleteEnrollmentCancel}
        onConfirm={deleteEnrollmentConfirm}
      >
        A exclusão não será possível caso haja resgistros vinculados a este.
      </ConfirmationModal>
      <ClassFrame
        show={showClassFrame}
        handleClose={closeClassFrame}
        handleSelect={selectClass}
      />
      <EnrollmentForm
        show={showForm}
        handleClose={closeForm}
        handleSave={handleSave}
        handleUpdate={handleUpdate}
        enrollment={selected}
        student={student}
        cclass={selectedClass}
      />
      <ContentToolBar>
        <div></div>
        <div>
          <PaginatorDefault
            totalPages={totalPages}
            currentPage={currentPage}
            onChange={loadEnrollments}
          />
        </div>
        <div>
          <Button onClick={newEnrollment}>
            <HiPlus />
          </Button>
        </div>
      </ContentToolBar>
      <Row>
        <Col className="p-0">{showTable()}</Col>
      </Row>
    </Container>
  );
};

export default Enrollments;

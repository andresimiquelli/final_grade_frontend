import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useAuth } from "../../../../context/auth";
import { useApi } from "../../../../services/api";
import { useNav, MenuKeys } from "../../../../context/nav";
import packModuleSubjectType from "../../../../services/apiTypes/PackModuleSubject";
import packModuleType from "../../../../services/apiTypes/PackModule";
import LoadingContainer from "../../../../components/LodingContainer";
import ContentToolBar from "../../../../components/ContentToolBar";
import DefaultTable from "../../../../components/DefaultTable";
import ButtonColumn from "../../../../components/ButtonColumn";
import { FaEdit, FaTrash } from "react-icons/fa";
import { HiPlus } from "react-icons/hi";
import { subjectLoadRenderer } from "../../../../utils/subjectLoadRenderer";
import SubjectFrame from "../../../../frames/SubjectFrame";
import subjectType from "../../../../services/apiTypes/Subject";
import ModuleSubjectForm from "./ModuleSubjectForm";
import PaginatorDefault from "../../../../components/PaginatorDefault";
import { extractError } from "../../../../utils/errorHandler";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import uuid from "react-uuid";
import PageGrid from "../../../../components/PageGrid";

const ModuleSubjects: React.FC = () => {
  const { setContentTitle, setSelectedMenu, addErrorMessage } = useNav();
  const { pack_id, module_id } = useParams();
  const { token } = useAuth();
  const api = useApi(token);

  const [subjects, setSubjects] = useState([] as packModuleSubjectType[]);
  const [module, setModule] = useState<packModuleType>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [showSubjectFrame, setShowSubjectFrame] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<
    subjectType | undefined
  >();

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<packModuleSubjectType | undefined>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setContentTitle("Disciplinas");
    setSelectedMenu(MenuKeys.PACKS);
    loadModule();
  }, []);

  function loadModule() {
    api
      .get(`/packs/${pack_id}/modules/${module_id}?with=pack`)
      .then((response) => {
        setModule(response.data);
        loadSubjects();
      })
      .catch((error) => {
        setIsLoading(false);
        addErrorMessage(extractError(error));
      });
  }

  function getFilters(page: number = 1) {
    return "?page=" + page;
  }

  function loadSubjects(page: number = 1) {
    setIsLoading(true);
    api
      .get(`/packs/${pack_id}/modules/${module_id}/subjects` + getFilters(page))
      .then((response) => {
        setSubjects(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
      })
      .finally(() => setIsLoading(false))
      .catch((error) => addErrorMessage(extractError(error)));
  }

  function selectSubject(subject: subjectType) {
    setSelectedSubject(subject);
    setShowSubjectFrame(false);
    setShowForm(true);
  }

  function closeSubjectFrame() {
    setSelectedSubject(undefined);
    setShowSubjectFrame(false);
  }

  function editSubject(subject: packModuleSubjectType) {
    setSelected(subject);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setSelected(undefined);
  }

  function deleteSubject(subject: packModuleSubjectType) {
    setSelected(subject);
    setShowDeleteModal(true);
  }

  function deleteSubjectConfirm() {
    setShowDeleteModal(false);
    api
      .delete(`/packs/${pack_id}/modules/${module_id}/subjects/${selected?.id}`)
      .then(() =>
        setSubjects((current) =>
          current.filter((subject) => subject.id !== selected?.id)
        )
      )
      .catch((error) => addErrorMessage(extractError(error)));
  }

  function deleteSubjectCancel() {
    setShowDeleteModal(false);
    setSelected(undefined);
  }

  function onDrag(result: DropResult) {
    const from = result.source.index;
    const to = result.destination ? result.destination.index : from;

    if (from !== to) {
      let ids: number[] = [];
      let nSubjects = subjects;
      nSubjects.splice(to, 0, nSubjects.splice(from, 1)[0]);
      nSubjects.forEach((subject, index) => {
        ids.push(subject.id);
        subject.order = index + 1;
      });
      setIsLoading(true);
      api
        .post(`/reorder/subjects`, { ids: ids })
        .then(() => setSubjects(nSubjects))
        .catch((error) => addErrorMessage(error))
        .finally(() => setIsLoading(false));
    }
  }

  function showTable() {
    return (
      <DefaultTable>
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Carga horária</th>
            <th>Ordem</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <DragDropContext onDragEnd={onDrag}>
          <Droppable droppableId={uuid()}>
            {(provided, _) => (
              <tbody ref={provided.innerRef} {...provided.droppableProps}>
                {subjects.map((subject, index) => (
                  <Draggable
                    key={subject.id}
                    index={index}
                    draggableId={`d_${subject.id}`}
                  >
                    {(provided, _) => (
                      <tr ref={provided.innerRef} {...provided.draggableProps}>
                        <td>{subject.subject.name}</td>
                        <td>{subjectLoadRenderer(subject.load)}</td>
                        <td {...provided.dragHandleProps}>
                          {subject.order} <CgArrowsExchangeAltV />
                        </td>
                        <td>
                          <ButtonColumn>
                            <button
                              className="secondary"
                              onClick={() => editSubject(subject)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="secondary"
                              onClick={() => deleteSubject(subject)}
                            >
                              <FaTrash />
                            </button>
                          </ButtonColumn>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
              </tbody>
            )}
          </Droppable>
        </DragDropContext>
      </DefaultTable>
    );
  }

  function handleSave(subject: packModuleSubjectType) {
    setSubjects([subject, ...subjects]);
  }

  function handleUpdate(nSubject: packModuleSubjectType) {
    setSubjects((current) =>
      current.map((subject) =>
        nSubject.id === subject.id ? nSubject : subject
      )
    );
  }

  return (
    <PageGrid>
      <LoadingContainer show={isLoading} />
      <ConfirmationModal
        title="Excluir disciplina"
        subtitle={`Deseja confirmar a exclusão de ${selected?.subject.name}?`}
        show={showDeleteModal}
        onCancel={deleteSubjectCancel}
        onClose={deleteSubjectCancel}
        onConfirm={deleteSubjectConfirm}
      >
        A exclusão não será possível caso haja resgistros vinculados a este.
      </ConfirmationModal>
      <SubjectFrame
        show={showSubjectFrame}
        handleSelect={selectSubject}
        handleClose={closeSubjectFrame}
      />
      <ModuleSubjectForm
        show={showForm}
        packModuleId={parseInt(module_id ?? "0")}
        packId={parseInt(pack_id ?? "0")}
        selectedSubject={selectedSubject}
        moduleSubject={selected}
        handleClose={closeForm}
        handleSave={handleSave}
        handleUpdate={handleUpdate}
      />
      <div className="fixedTop">
        <ContentToolBar>
          <div></div>
          <PaginatorDefault
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={(page) => loadSubjects(page)}
          />
          <div>
            <Button onClick={() => setShowSubjectFrame(true)}>
              <HiPlus />
            </Button>
          </div>
        </ContentToolBar>
      </div>
      <div className="content">{showTable()}</div>
    </PageGrid>
  );
};

export default ModuleSubjects;

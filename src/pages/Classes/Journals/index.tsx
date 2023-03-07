import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import ContentToolBar from "../../../components/ContentToolBar";
import { useAuth } from "../../../context/auth";
import { useNav, MenuKeys } from "../../../context/nav";
import { useApi } from "../../../services/api";
import journalType, { JournalStatus } from "../../../services/apiTypes/Journal";
import DefaultTable from "../../../components/DefaultTable";
import ButtonColumn from "../../../components/ButtonColumn";
import { FaChalkboardTeacher, FaUnlock } from "react-icons/fa";
import { TbChecklist } from "react-icons/tb";
import LoadingContainer from "../../../components/LodingContainer";
import PaginatorDefault from "../../../components/PaginatorDefault";
import { GoTasklist } from "react-icons/go";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import ConfirmationModal from "../../../components/ConfirmationModal";
import PageGrid from "../../../components/PageGrid";

type journalData = {
  class_id: number | undefined;
  pack_module_subject_id: number;
  status: number;
};

const Journals: React.FC = () => {
  const { class_id } = useParams();
  const { token } = useAuth();
  const api = useApi(token);
  const { setContentTitle, setSelectedMenu } = useNav();
  const navigate = useNavigate();

  const [journals, setJournals] = useState<journalType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<journalType>();

  useEffect(() => {
    setContentTitle("Diários de classe");
    setSelectedMenu(MenuKeys.CLASSES);
    if (class_id) loadJournals();
  }, [class_id]);

  function getFilters(page: number) {
    return "?page=" + page;
  }

  function loadJournals(page: number = 1) {
    setIsLoading(true);

    api
      .get("/journals/" + class_id + getFilters(page))
      .then((response) => {
        setJournals(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
      })
      .finally(() => setIsLoading(false));
  }

  function reopenJournal(journal: journalType) {
    setSelectedJournal(journal);
    setShowConfirmationModal(true);
  }

  function reopenJournalCancel() {
    setSelectedJournal(undefined);
    setShowConfirmationModal(false);
  }

  function reopenJournalConfirm() {
    setShowConfirmationModal(false);
    setIsLoading(true);
    const data = {
      class_id: class_id,
      pack_module_subject_id: selectedJournal?.pack_module_subject_id,
      status: JournalStatus.OPEN,
    } as journalData;

    api
      .post(`/journals`, data)
      .then(() => {
        setJournals((current) =>
          current.map((journal) => {
            if (
              journal.pack_module_subject_id ===
              (selectedJournal ? selectedJournal.pack_module_subject_id : 0)
            )
              journal.status = JournalStatus.OPEN;

            return journal;
          })
        );
      })
      .finally(() => setIsLoading(false));
  }

  function showTable() {
    return (
      <DefaultTable>
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Módulo</th>
            <th>Status</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {journals.map((journal) => (
            <tr key={journal.pack_module_subject_id}>
              <td>{journal.subject_name}</td>
              <td>{journal.pack_module_name}</td>
              <td>
                {journal.status === JournalStatus.CLOSED ? (
                  <>
                    <RiCheckboxCircleFill /> Concluído
                  </>
                ) : (
                  <>
                    <RiCheckboxBlankCircleLine /> Aberto
                  </>
                )}
              </td>
              <td>
                <ButtonColumn>
                  {journal.status === JournalStatus.CLOSED && (
                    <button
                      onClick={() => reopenJournal(journal)}
                      className="success"
                    >
                      <FaUnlock />
                      <span>Reabrir</span>
                    </button>
                  )}
                  <button
                    onClick={() =>
                      navigate(
                        `/lessons/${class_id}/${journal.pack_module_subject_id}`
                      )
                    }
                  >
                    <FaChalkboardTeacher />
                    <span>Aulas</span>
                  </button>
                  <button
                    onClick={() =>
                      navigate(
                        `/evaluations/${class_id}/${journal.pack_module_subject_id}`
                      )
                    }
                  >
                    <TbChecklist />
                    <span>Avaliações</span>
                  </button>
                  <button
                    onClick={() =>
                      navigate(
                        `/finalgrade/${class_id}/${journal.pack_module_subject_id}`
                      )
                    }
                  >
                    <GoTasklist />
                    <span>Relatório</span>
                  </button>
                </ButtonColumn>
              </td>
            </tr>
          ))}
        </tbody>
      </DefaultTable>
    );
  }

  return (
    <PageGrid>
      <LoadingContainer show={isLoading} />
      <ConfirmationModal
        title="Reabrir diário"
        subtitle="Deseja reabrir este diário?"
        show={showConfirmationModal}
        onClose={reopenJournalCancel}
        onCancel={reopenJournalCancel}
        onConfirm={reopenJournalConfirm}
      >
        Ao reabrir o diário, as informações de aula, avaliações, notas e
        frequências poderão ser alteradas.
      </ConfirmationModal>
      <div className="fixedTop">
        <ContentToolBar>
          <div></div>
          <PaginatorDefault
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={(page) => class_id && loadJournals(page)}
          />
          <div></div>
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

export default Journals;

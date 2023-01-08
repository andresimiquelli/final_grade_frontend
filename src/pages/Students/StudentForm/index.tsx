import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import LoadingContainer from "../../../components/LodingContainer";
import studentType from "../../../services/apiTypes/Student";
import { useAuth } from "../../../context/auth";
import { useApi } from "../../../services/api";
import errorType from "../../../services/apiTypes/Error";
import ErrorScreen from "../../../components/ErrorScreen";
import { extractError } from "../../../utils/errorHandler";

interface StudentFormProps {
  show?: boolean;
  student?: studentType;
  handleClose(): void;
  handleSave?(student: studentType): void;
  handleUpdate?(student: studentType): void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  student,
  show,
  handleClose,
  handleSave,
  handleUpdate,
}) => {
  const { token } = useAuth();
  const api = useApi(token);

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<errorType | undefined>();

  useEffect(() => {
    if (student) {
      setName(student.name);
      setEmail(student.email);
      setPhone(student.phone);
    } else {
      clear();
    }
  }, [student]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    if (student) update();
    else saveNew();
  }

  function close() {
    clear();
    setHasError(false);
    handleClose();
  }

  function clear() {
    setName("");
    setEmail("");
    setPhone("");
  }

  function saveNew() {
    let data = {
      name: name,
      email: email || "",
      phone: phone || "",
    };

    api
      .post("/students", data)
      .then((response) => {
        handleSave && handleSave(response.data);
        close();
      })
      .finally(() => setIsLoading(false))
      .catch((error) => {
        setError(extractError(error));
        setHasError(true);
      });
  }

  function update() {
    let data = {
      name: name,
      email: email,
      phone: phone,
    };

    api
      .put("/students/" + student?.id, data)
      .then((response) => {
        handleUpdate && handleUpdate(response.data);
        close();
      })
      .finally(() => setIsLoading(false))
      .catch((error) => {
        setError(extractError(error));
        setHasError(true);
      });
  }

  return (
    <Modal show={show}>
      <Modal.Header closeButton>
        <Modal.Title>
          {student ? "Editar estudante" : "Novo estudante"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={save}>
        <Modal.Body className="position-relative">
          <LoadingContainer show={isLoading} />
          <ErrorScreen
            show={hasError}
            error={error}
            handleClose={() => setHasError(false)}
          />
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              placeholder="Nome"
              required
              minLength={5}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              type="email"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Control
              type="tel"
              placeholder="Telefone"
              minLength={10}
              maxLength={15}
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Salvar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StudentForm;

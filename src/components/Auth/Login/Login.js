import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import LoaderButton from "../../../lib/utils/LoaderButton";
import { useFormFields } from "../../../lib/hooksLib";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
        sessionStorage.setItem('userLogin', true);
        navigate('/home');
    } catch (e) {
      //   onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Card className="Card" style={{ width: "18rem" }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group size="lg" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                autoFocus
                type="email"
                value={fields.email}
                onChange={handleFieldChange}
              />
            </Form.Group>
            <Form.Group size="lg" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={fields.password}
                onChange={handleFieldChange}
              />
            </Form.Group>
            <div className="submitBtn">
            <LoaderButton
              block="true"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="format"
              disabled={!validateForm()}
            >
              Login
            </LoaderButton>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

import { Alert, Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useState } from "react";

export function TextUtilsPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function updateOutput(update: () => string) {
    try {
      setError('');
      setOutput(update());
    } catch (e) {
      setError(`${e}`);
      setOutput('');
    }
  }

  const formatJson = () => updateOutput(() => JSON.stringify(JSON.parse(input), null, 2));
  const urlEncode = () => updateOutput(() => encodeURIComponent(input));
  const urlDecode = () => updateOutput(() => decodeURIComponent(input));
  const base64Encode = () => updateOutput(() => btoa(input));
  const base64Decode = () => updateOutput(() => atob(input));
  const lineCount = input.split(/\n+/).length;
  const wordCount = input.split(/\s+/).length;
  const charCount = input.length;

  return (
    <Form>
      <Container>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Input</Form.Label>
              <Form.Control as="textarea" rows={10} value={input} onChange={(e) => setInput(e.currentTarget.value)} />
              <Form.Text className="text-muted">
                Enter your input text
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Output</Form.Label>
              <Form.Control as="textarea" rows={10} readOnly value={output} />
              <Form.Text className="text-muted">
                Output text (read-only)
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
      </Container>
      {error &&
        <Form.Group className="mb-3">
          <Alert variant="danger">{error}</Alert>
        </Form.Group>
      }
      <Form.Group className="mb-3">
        <Button className="ms-1" type="button" onClick={formatJson}>Pretty JSON</Button>
        <Button className="ms-1" type="button" onClick={base64Encode}>Base64 Encode</Button>
        <Button className="ms-1" type="button" onClick={base64Decode}>Base64 Decode</Button>
        <Button className="ms-1" type="button" onClick={urlEncode}>URL Encode</Button>
        <Button className="ms-1" type="button" onClick={urlDecode}>URL Decode</Button>
      </Form.Group>
      <Form.Group className="mb-3">
        <Table>
          <tbody>
            <tr>
              <td>Char count</td>
              <td>{charCount}</td>
            </tr>
            <tr>
              <td>Line count</td>
              <td>{lineCount}</td>
            </tr>
            <tr>
              <td>Word count</td>
              <td>{wordCount}</td>
            </tr>
          </tbody>
        </Table>
      </Form.Group>
    </Form>
  );
}
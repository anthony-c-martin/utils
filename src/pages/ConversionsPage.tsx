import { Alert, Col, Container, Form, Row } from "react-bootstrap";
import { useState } from "react";

enum WeightType {
  Grams = "Grams",
  Ounces = "Ounces"
}

const conversions = {
  [WeightType.Grams]: 1,
  [WeightType.Ounces]: 28.34949,
};

export function ConversionsPage() {
  const [sourceType, setSourceType] = useState<WeightType>(WeightType.Grams);
  const [destType, setDestType] = useState<WeightType>(WeightType.Ounces);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState('');

  const calculate = (source: string) => {
    try {
      setError('');
      setInput(source);
      const inputVal = parseFloat(source);
      const sourceRatio = conversions[sourceType];
      const destRatio = conversions[destType];
      
      const value = (inputVal * sourceRatio) / destRatio;
      setOutput(`${value}`);
    } catch (e) {
      setError(`${e}`);
      setOutput('');
    }
  }

  return (
    <Form>
      <Container>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Source</Form.Label>
              <Form.Select value={sourceType} onChange={(e) => setSourceType(WeightType[e.currentTarget.value as keyof typeof WeightType])}>
                {Object.keys(conversions).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Choose the source
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Destination</Form.Label>
              <Form.Select value={destType} onChange={(e) => setDestType(WeightType[e.currentTarget.value as keyof typeof WeightType])}>
                {Object.keys(conversions).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Choose the destination
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Input</Form.Label>
              <Form.Control value={input} onChange={(e) => calculate(e.currentTarget.value)} />
              <Form.Text className="text-muted">
                Input quantity
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Output</Form.Label>
              <Form.Control readOnly value={output} />
              <Form.Text className="text-muted">
                Output quantity
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
    </Form>
  );
}
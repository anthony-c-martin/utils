import { Alert, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { FC, useEffect, useMemo, useState } from "react";
import { convert, ingredients, Unit, units } from "../helpers/baking";

const floatRegex = /^-?\d+(?:[.,]\d*?)?$/;

type AmountInputProps = {
  unit: Unit,
  readOnly: boolean,
  value: number,
  onValueChange: (value?: number) => void,
}

const AmountInput: FC<AmountInputProps> = ({ unit, readOnly, value, onValueChange }) => {
  const [input, setInput] = useState<string>(value.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    setInput(value.toString());
  }, [value])

  useEffect(() => {
    if (floatRegex.test(input)) {
      const inputVal = parseFloat(input.replace(',', '.'));
      onValueChange(inputVal);
      setError('');
    } else {
      onValueChange(undefined);
      setError(`Value '${input}' is not a valid number!`);
    }
  }, [unit, input, onValueChange]);

  return (
    <>
      <InputGroup className="mb-3">
        <Form.Control value={input} readOnly={readOnly} onChange={(e) => setInput(e.currentTarget.value)} />
        <InputGroup.Text>{unit.shortName}</InputGroup.Text>
      </InputGroup>
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
    </>
  );
};

export function BakingPage() {
  const [ingredientName, setIngredientName] = useState(ingredients[0].name);
  const [sourceName, setSourceName] = useState(units.find(u => u.shortName === 'cups')!.name);
  const [destName, setDestName] = useState(units.find(u => u.shortName === 'g')!.name);
  const [input, setInput] = useState(1);
  const [output, setOutput] = useState(0);

  const ingredient = useMemo(
    () => ingredients.find(x => x.name === ingredientName)!,
    [ingredientName]);
  const sourceUnit = useMemo(
    () => units.find(x => x.name === sourceName)!,
    [sourceName]);
  const destUnit = useMemo(
    () => units.find(x => x.name === destName)!,
    [destName]);

  useEffect(() => {
    setOutput(convert(input, sourceUnit, destUnit, ingredient));
  }, [input, sourceUnit, destUnit, ingredient]);

  return (
    <Form>
      <Container>
        <Row>
          <Form.Group className="mb-3">
            <Form.Label>Ingredient</Form.Label>
            <Form.Select value={ingredientName} onChange={(e) => setIngredientName(e.currentTarget.value)}>
              {ingredients.map((x) => (
                <option key={x.name} value={x.name}>{x.name}</option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Choose the ingredient to convert
            </Form.Text>
          </Form.Group>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Source</Form.Label>
              <Form.Select value={sourceName} onChange={(e) => setSourceName(e.currentTarget.value)}>
                {units.map((x) => (
                  <option key={x.name} value={x.name}>{x.name}</option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Choose the source unit
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Destination</Form.Label>
              <Form.Select value={destName} onChange={(e) => setDestName(e.currentTarget.value)}>
                {units.map((x) => (
                  <option key={x.name} value={x.name}>{x.name}</option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Choose the destination unit
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Input</Form.Label>
              <AmountInput
                unit={sourceUnit}
                readOnly={false}
                value={input}
                onValueChange={x => setInput(x ?? 0)} />
              <Form.Text className="text-muted">
                Input quantity
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Output</Form.Label>
              <AmountInput
                unit={destUnit}
                readOnly={true}
                value={Number(output.toFixed(2))}
                onValueChange={() => { }} />
              <Form.Text className="text-muted">
                Output quantity
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}

import { Alert, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { FC, useEffect, useState } from "react";

const floatRegex = /^-?\d+(?:[.,]\d*?)?$/;

enum ConversionType {
  Weight = "Weight",
  Temperature = "Temperature",
  Volume = "Volume",
  Distance = "Distance",
}

type ConversionEntry = {
  type: ConversionType,
  name: string,
  shortName: string,
  convertTo: (input: number) => number,
  convertFrom: (input: number) => number,
  roundingPlaces: number,
};

const mlsInFlOz = 29.57353;
const gramsInOz = 28.3495231;
const kmsInMile = 1.609344;
const farenheitToCelcius = (f: number) => (f - 32) / 1.8;
const celciusToFarenheit = (c: number) => (c * 1.8) + 32;
const sameToSame = (x: number) => x;

const allConversions: ConversionEntry[] = [
  {
    type: ConversionType.Temperature,
    name: 'Celcius',
    shortName: 'C',
    convertTo: sameToSame,
    convertFrom: sameToSame,
    roundingPlaces: 0,
  },
  {
    type: ConversionType.Temperature,
    name: 'Farenheit',
    shortName: 'F',
    convertTo: celciusToFarenheit,
    convertFrom: farenheitToCelcius,
    roundingPlaces: 0,
  },
  {
    type: ConversionType.Weight,
    name: 'Grams',
    shortName: 'g',
    convertTo: sameToSame,
    convertFrom: sameToSame,
    roundingPlaces: 0,
  },
  {
    type: ConversionType.Weight,
    name: 'Ounces',
    shortName: 'oz',
    convertTo: x => x / gramsInOz,
    convertFrom: x => x * gramsInOz,
    roundingPlaces: 2,
  },
  {
    type: ConversionType.Volume,
    name: 'Milliliters',
    shortName: 'ml',
    convertTo: sameToSame,
    convertFrom: sameToSame,
    roundingPlaces: 2,
  },
  {
    type: ConversionType.Volume,
    name: 'Fluid Ounces (US)',
    shortName: 'floz',
    convertTo: x => x / mlsInFlOz,
    convertFrom: x => x * mlsInFlOz,
    roundingPlaces: 2,
  },
  {
    type: ConversionType.Volume,
    name: 'Cups (US)',
    shortName: 'cups',
    convertTo: x => x / (mlsInFlOz * 8),
    convertFrom: x => x * (mlsInFlOz * 8),
    roundingPlaces: 2,
  },
  {
    type: ConversionType.Volume,
    name: 'Teaspoons (US)',
    shortName: 'tsp',
    convertTo: x => x / (mlsInFlOz / 6),
    convertFrom: x => x * (mlsInFlOz / 6),
    roundingPlaces: 2,
  },
  {
    type: ConversionType.Volume,
    name: 'Tablespoons (US)',
    shortName: 'tbsp',
    convertTo: x => x / (mlsInFlOz / 2),
    convertFrom: x => x * (mlsInFlOz / 2),
    roundingPlaces: 2,
  },
  {
    type: ConversionType.Distance,
    name: 'Kilometers',
    shortName: 'km',
    convertTo: sameToSame,
    convertFrom: sameToSame,
    roundingPlaces: 2,
  },
  {
    type: ConversionType.Distance,
    name: 'Miles',
    shortName: 'mi',
    convertTo: x => x / kmsInMile,
    convertFrom: x => x * kmsInMile,
    roundingPlaces: 2,
  },
]

type ConversionInputProps = {
  entry: ConversionEntry,
  readOnly: boolean,
  value: number,
  onValueChange: (value?: number) => void,
}

const ConversionInput: FC<ConversionInputProps> = ({ entry, readOnly, value, onValueChange }) => {
  const [input, setInput] = useState<string>(value.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    setInput(value.toString());
  }, [value])

  useEffect(() => {
    if (floatRegex.test(input)) {
      const inputVal = parseFloat(input);
      onValueChange(inputVal);
      setError('');
    } else {
      onValueChange(undefined);
      setError(`Value '${input}' is not a valid float!`);
    }
  }, [entry, input, onValueChange]);

  return (
    <>
      <InputGroup className="mb-3">
        <Form.Control value={input} readOnly={readOnly} onChange={(e) => setInput(e.currentTarget.value)} />
        <InputGroup.Text>{entry.shortName}</InputGroup.Text>
      </InputGroup>
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}
    </>
  );
};

export function ConversionsPage() {
  const [conversionType, setConversionType] = useState(allConversions[0].type);
  const conversions = allConversions.filter(x => x.type === conversionType);
  const allConversionTypes = [...new Set(allConversions.map(x => x.type))];
  const [sourceType, setSourceType] = useState(conversions[0]);
  const [destType, setDestType] = useState(conversions[1]);
  const [input, setInput] = useState(0);
  const [output, setOutput] = useState(0);

  useEffect(() => {
    setOutput(destType.convertTo(sourceType.convertFrom(input)));
  }, [input, sourceType, destType]);

  useEffect(() => {
    const conversions = allConversions.filter(x => x.type === conversionType);
    setSourceType(conversions[0]);
    setDestType(conversions[1]);
  }, [conversionType]);

  return (
    <Form>
      <Container>
        <Row>
          <Form.Group className="mb-3">
            <Form.Label>Conversion Type</Form.Label>
            <Form.Select value={conversionType} onChange={(e) => setConversionType(e.currentTarget.value as ConversionType)}>
              {allConversionTypes.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Choose the type of conversion to perform
            </Form.Text>
          </Form.Group>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Source</Form.Label>
              <Form.Select value={sourceType.name} onChange={(e) => setSourceType(conversions.filter(x => x.name === e.currentTarget.value)[0])}>
                {conversions.map((key) => (
                  <option key={key.name} value={key.name}>{key.name}</option>
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
              <Form.Select value={destType.name} onChange={(e) => setDestType(conversions.filter(x => x.name === e.currentTarget.value)[0])}>
                {conversions.map((key) => (
                  <option key={key.name} value={key.name}>{key.name}</option>
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
              <ConversionInput
                entry={sourceType}
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
              <ConversionInput
                entry={destType}
                readOnly={true}
                value={Number(output.toFixed(destType.roundingPlaces))}
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
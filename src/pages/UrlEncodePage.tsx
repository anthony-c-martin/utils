import { Button, ButtonToolbar, Form } from "react-bootstrap";
import { useState } from "react";

export function UrlEncodePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function encode() {
    setOutput(encodeURIComponent(input));
  }
  function decode() {
    setOutput(decodeURIComponent(input));
  }

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>URL</Form.Label>
        <Form.Control placeholder="Enter text string" value={input} onChange={(e) => setInput(e.currentTarget.value)} />
        <Form.Text className="text-muted">
          Enter the text you wish to decode or encode
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <ButtonToolbar>
          <Button onClick={encode}>Encode</Button>
          <Button onClick={decode}>Decode</Button>
        </ButtonToolbar>
      </Form.Group>
      {output &&
        <Form.Group className="mb-3">
          <Form.Control value={output} disabled={true} />
        </Form.Group>}
    </Form>
  );
}
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { OutputControl } from "../components/OutputControl";

const pwChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';
const pwLength = 16;
function getRandomPw() {
  return Array.from(crypto.getRandomValues(new Uint32Array(pwLength)))
    .map((x) => pwChars[x % pwChars.length]).join('');
}

export function GenerationPage() {
  const [output, setOutput] = useState('');

  const generateGuid = () => setOutput(uuidv4());
  const generatePassword = () => setOutput(getRandomPw());

  return (
    <Form>
      <Form.Group className="mb-3">
        <Button className="ms-1" type="button" onClick={generateGuid}>Generate GUID</Button>
        <Button className="ms-1" type="button" onClick={generatePassword}>Generate Password</Button>
      </Form.Group>
      {output &&
      <Form.Group className="mb-3">
        <Form.Label>Output</Form.Label>
        <OutputControl value={output} />
      </Form.Group>}
    </Form>
  );
}

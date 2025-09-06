import { FC, useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Check2, Copy } from 'react-bootstrap-icons';

type OutputControlProps = {
  value: string,
};

export const OutputControl: FC<OutputControlProps> = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <InputGroup>
      <Form.Control readOnly value={value} />
      <Button onClick={handleCopy}>
        {copied ? <Check2 /> : <Copy />}
      </Button>
    </InputGroup>
  );
};
import { Form } from "react-bootstrap";
import { QrCode } from "../components/qrcode";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { OutputControl } from "../components/OutputControl";
import { deflate, inflate } from "pako";

export function QuickSharePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState('');
  const pageLink = `${document.location.href}?data=${encodeURIComponent(encode(input))}`;

  useEffect(() => {
    const searchData = searchParams.get('data');
    if (searchData) {
      setInput(decode(searchData));
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Text</Form.Label>
        <Form.Control as="textarea" rows={10} value={input} onChange={(e) => setInput(e.currentTarget.value)} />
        <Form.Text className="text-muted">
          Add text to generate a shareable link.
        </Form.Text>
      </Form.Group>
      {pageLink &&
      <Form.Group className="mb-3">
        <Form.Label>QR Code</Form.Label>
        <QrCode url={pageLink} />
      </Form.Group>}
      {pageLink &&
      <Form.Group className="mb-3">
        <Form.Label>Link to this page</Form.Label>
        <OutputControl value={pageLink} />
      </Form.Group>}
    </Form>
  );
}

function encode(content: string): string {
  const deflatedData = deflate(new Uint8Array(content.split("").map((c) => c.charCodeAt(0))));
  const deflatedString = String.fromCharCode(...deflatedData);
  const base64Encoded = btoa(deflatedString);

  return base64Encoded;
}

function decode(base64Encoded: string): string {
  const deflatedString = atob(base64Encoded);
  const deflatedData = new Uint8Array(deflatedString.split("").map((c) => c.charCodeAt(0)));
  const content = inflate(deflatedData);

  return String.fromCharCode(...content);
}
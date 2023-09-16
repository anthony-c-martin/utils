import { Form } from "react-bootstrap";
import { QrCode } from "../components/qrcode";
import { useState } from "react";

export function QrCodePage() {
  const [url, setUrl] = useState<string>();

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control placeholder="Enter URL" onChange={(e) => setUrl(e.currentTarget.value)} />
        <Form.Text className="text-muted">
          Enter a URL to generate a QR code.
        </Form.Text>
      </Form.Group>
      {url &&
      <Form.Group className="mb-3">
        <Form.Label>QR Code</Form.Label>
        <QrCode url={url} />
      </Form.Group>}
    </Form>
  );
}

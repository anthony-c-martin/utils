import { Form } from "react-bootstrap";
import { QrCode } from "../components/qrcode";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function QrCodePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [url, setUrl] = useState('');
  const pageLink = `${document.location.href}?url=${encodeURIComponent(url)}`;

  useEffect(() => {
    const searchUrl = searchParams.get('url');
    if (searchUrl) {
      setUrl(searchUrl);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>URL</Form.Label>
        <Form.Control placeholder="Enter URL" value={url} onChange={(e) => setUrl(e.currentTarget.value)} />
        <Form.Text className="text-muted">
          Enter a URL to generate a QR code.
        </Form.Text>
      </Form.Group>
      {url &&
      <Form.Group className="mb-3">
        <Form.Label>QR Code</Form.Label>
        <QrCode url={url} />
      </Form.Group>}
      {url &&
      <Form.Group className="mb-3">
        <Form.Label>Link to this page</Form.Label>
        <Form.Control readOnly value={pageLink} />
      </Form.Group>}
    </Form>
  );
}

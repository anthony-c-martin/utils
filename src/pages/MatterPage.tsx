import { Button, Form, InputGroup, Table } from "react-bootstrap";
import { Check2, Copy } from "react-bootstrap-icons";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { QrCode } from "../components/qrcode";
import { parseMatterIdentifier, toManualPairingCode, describeProduct, describeVendor } from "../helpers/matter";

export function MatterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const searchId = searchParams.get('id');
    if (searchId) {
      setIdentifier(searchId);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const result = useMemo(() => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      return undefined;
    }
    try {
      return { payload: parseMatterIdentifier(trimmed) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }, [identifier]);

  const payload = result && 'payload' in result ? result.payload : undefined;

  const handleCopyUrl = async () => {
    const hashPath = document.location.hash.split('?')[0] || '#/matter';
    const pageLink = `${document.location.origin}${document.location.pathname}${hashPath}?id=${encodeURIComponent(identifier.trim())}`;
    await navigator.clipboard.writeText(pageLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Matter Identifier</Form.Label>
        <InputGroup>
          <Form.Control
            placeholder="Enter a Matter identifier (e.g. MT:...)"
            value={identifier}
            onChange={(e) => setIdentifier(e.currentTarget.value)}
          />
          <Button variant="primary" onClick={handleCopyUrl} disabled={!identifier.trim()} title="Copy link to this page">
            {copied ? <Check2 /> : <Copy />}
          </Button>
        </InputGroup>
        <Form.Text className="text-muted">
          Paste the "MT:..." payload from a Matter device's QR code.
        </Form.Text>
      </Form.Group>

      {result && 'error' in result &&
      <Form.Group className="mb-3">
        <Form.Text className="text-danger">{result.error}</Form.Text>
      </Form.Group>}

      {payload &&
      <>
        <Form.Group className="mb-3">
          <Form.Label>QR Code</Form.Label>
          <QrCode url={identifier.trim()} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Details</Form.Label>
          <Table striped bordered size="sm">
            <tbody>
              <tr>
                <td>Manual Pairing Code</td>
                <td>{toManualPairingCode(payload)}</td>
              </tr>
              <tr>
                <td>Discriminator</td>
                <td>{payload.discriminator.toString(16).toUpperCase()}</td>
              </tr>
              <tr>
                <td>Vendor ID</td>
                <td>{describeVendor(payload.vendorId)}</td>
              </tr>
              <tr>
                <td>Product ID</td>
                <td>{describeProduct(payload.vendorId, payload.productId)}</td>
              </tr>
            </tbody>
          </Table>
        </Form.Group>
      </>}
    </Form>
  );
}

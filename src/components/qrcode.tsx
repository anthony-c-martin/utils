import { toCanvas } from 'qrcode';
import { FC, useEffect, useRef } from 'react';

type QrCodeProps = {
  url: string,
};

export const QrCode: FC<QrCodeProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    toCanvas(canvasRef.current, url, { version: 4, margin: 0, width: 400 });
  }, [url]);

  return (
    <div className='form-control' style={{ width: 'fit-content' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};
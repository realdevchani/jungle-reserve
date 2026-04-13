import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import S from "./style";

const ROOMS = Array.from({ length: 12 }, (_, i) => i + 1);

const QrCodes = () => {
  const [baseUrl, setBaseUrl] = useState(window.location.origin);
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>연습실 QR 코드</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'pretendard', sans-serif; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 24px; }
            .card { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px; border: 2px solid #333; border-radius: 8px; }
            .card h3 { font-size: 20px; }
            .card p { font-size: 12px; color: #666; word-break: break-all; }
            @media print {
              .grid { gap: 16px; padding: 16px; }
              .card { break-inside: avoid; border: 2px solid #000; }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <S.Wrap>
      <S.Title>연습실 QR 코드 관리</S.Title>

      <S.UrlForm>
        <S.InputGroup>
          <S.Label>사이트 주소 (Base URL)</S.Label>
          <S.Input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://your-domain.com"
          />
        </S.InputGroup>
        <S.PrintButton onClick={handlePrint}>전체 인쇄</S.PrintButton>
      </S.UrlForm>

      <S.Hint>각 QR 코드를 스캔하면 해당 방의 입실 확인 페이지로 이동합니다.</S.Hint>

      <div ref={printRef}>
        <S.QrGrid className="grid">
          {ROOMS.map((roomId) => {
            const url = `${baseUrl}/room/${roomId}`;
            return (
              <S.QrCard key={roomId} className="card">
                <S.RoomLabel>{600 + roomId}호</S.RoomLabel>
                <QRCodeSVG value={url} size={160} level="H" />
                <S.QrUrl>{url}</S.QrUrl>
              </S.QrCard>
            );
          })}
        </S.QrGrid>
      </div>
    </S.Wrap>
  );
};

export default QrCodes;

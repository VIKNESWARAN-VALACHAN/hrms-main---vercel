// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { API_BASE_URL } from '../../../config';
// import { toast } from 'react-hot-toast';

// export default function AssetBarcodePage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const assetId = searchParams.get('id');
//   const [barcodeData, setBarcodeData] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const infoRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     async function fetchData() {
//       if (!assetId) return;
//       setLoading(true);
//       setBarcodeData(null);
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}/qrcode-data`);
//         if (!res.ok) throw new Error('Not found');
//         const data = await res.json();
//         setBarcodeData(data);
//       } catch (err) {
//         toast.error('Failed to fetch barcode/QR data');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, [assetId]);

//   const handlePrint = () => {
//     if (!barcodeData) return;
//     const content = infoRef.current?.innerHTML || '';
//     const win = window.open('', '_blank');
//     if (!win) return;
//     win.document.write(`
//       <html>
//       <head><title>Print Asset Barcode/QR</title></head>
//       <body style="text-align:center;padding:2em;">
//         ${content}
//         <script>window.onload = function(){window.print(); window.close();}</script>
//       </body>
//       </html>
//     `);
//     win.document.close();
//   };

//   // Helper to format "qr_data" as key-value pairs
//   const renderQrData = (qrData: any) => {
//     if (!qrData) return <div className="text-gray-400">No QR data.</div>;
//     return (
//       <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left mb-3">
//         {Object.entries(qrData).map(([key, value]) => (
//           <div key={key} className="col-span-2 sm:col-span-1 flex">
//             <span className="font-semibold mr-2 capitalize">{key}:</span>
//             <span>{String(value ?? '-')}</span>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // Show QR code (image if available, otherwise show encoded string)
//   const renderQrCode = () => {
//     if (barcodeData?.qrcode_url) {
//       return (
//         <div className="flex flex-col items-center">
//           <div className="text-xs text-gray-500 mb-1">QR Code</div>
//           <img src={barcodeData.qrcode_url} alt="QR Code" style={{ maxWidth: 160, border: '1px solid #eee', padding: 8, borderRadius: 10, background: '#fff' }} />
//         </div>
//       );
//     }
//     if (barcodeData?.qr_data) {
//       // Show encoded string if image not available
//       return (
//         <div className="flex flex-col items-center">
//           <div className="text-xs text-gray-500 mb-1">QR Data</div>
//           <div className="bg-gray-200 text-sm text-gray-800 p-3 rounded border border-gray-400 select-all max-w-xs break-words">
//             {JSON.stringify(barcodeData.qr_data)}
//           </div>
//         </div>
//       );
//     }
//     return <div className="text-gray-400">No QR code available</div>;
//   };

//   return (
//     <div className="max-w-xl mx-auto py-10">
//       <div className="flex items-center gap-4 mb-4">
//         <button className="btn btn-secondary" onClick={() => router.back()}>
//           Back
//         </button>
//         <h1 className="text-2xl font-bold">Print Asset Barcode/QR</h1>
//       </div>
//       {loading && <div className="p-6 text-center text-lg">Loading...</div>}
//       {!loading && !barcodeData && (
//         <div className="alert alert-error">No barcode/QR data found for this asset.</div>
//       )}
//       {barcodeData && (
//         <div ref={infoRef} className="bg-base-100 rounded-xl shadow p-6 flex flex-col gap-4 items-center print:bg-white print:shadow-none print:rounded-none">
//           <div className="w-full flex flex-col items-center mb-2">
//             <div className="text-lg font-bold">{barcodeData?.serial_number || `Asset #${barcodeData.asset_id}`}</div>
//             {barcodeData?.product_name && <div className="font-medium text-gray-500 mb-1">{barcodeData.product_name}</div>}
//             <div className="text-xs text-gray-400">
//               Generated at: {barcodeData.generated_at || '-'}
//             </div>
//           </div>
//           {renderQrData(barcodeData.qr_data)}
//           <div className="w-full flex justify-center mt-2">
//             <div className="p-2 rounded-lg bg-white border flex flex-col items-center">
//               {renderQrCode()}
//             </div>
//           </div>
//           <button className="btn btn-secondary mt-4 print:hidden" onClick={handlePrint}>
//             Print
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '../../../config';
import { toast } from 'react-hot-toast';

type QrObj = Record<string, unknown>;

type BarcodeData = {
  asset_id?: number | string;
  serial_number?: string;
  product_name?: string;
  generated_at?: string;
  qrcode_url?: string;     // optional: server-generated QR image url
  qr_data?: QrObj | string; // payload to encode as QR
};

export default function AssetBarcodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assetId = searchParams.get('id');

  const [barcodeData, setBarcodeData] = useState<BarcodeData | null>(null);
  const [qrImgSrc, setQrImgSrc] = useState<string | null>(null); // data URL or remote URL for <img>
  const [loading, setLoading] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  // Fetch barcode/QR payload
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      if (!assetId) return;
      setLoading(true);
      setBarcodeData(null);
      setQrImgSrc(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}/qrcode-data`);
        if (!res.ok) throw new Error('Not found');
        const data: BarcodeData = await res.json();
        if (!cancelled) setBarcodeData(data);
      } catch {
        toast.error('Failed to fetch barcode/QR data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [assetId]);

  // Build a QR image (data URL) when we only have a payload
  useEffect(() => {
    let cancelled = false;

    async function makeQr() {
      if (!barcodeData) return;

      // If server already gave us an image, use it
      if (barcodeData.qrcode_url) {
        setQrImgSrc(barcodeData.qrcode_url);
        return;
      }

      // Otherwise, generate a QR code from qr_data on the client
      if (barcodeData.qr_data) {
        try {
          const { toDataURL } = await import('qrcode'); // dynamic import for client only
          const payload =
            typeof barcodeData.qr_data === 'string'
              ? barcodeData.qr_data
              : JSON.stringify(barcodeData.qr_data);

          const url = await toDataURL(payload, {
            errorCorrectionLevel: 'M',
            margin: 1,
            width: 256
          });

          if (!cancelled) setQrImgSrc(url);
        } catch {
          // If QR generation fails, we’ll just render the JSON as a fallback below
          if (!cancelled) setQrImgSrc(null);
        }
      }
    }

    setQrImgSrc(null);
    makeQr();
    return () => { cancelled = true; };
  }, [barcodeData]);

  const handlePrint = () => {
    if (!barcodeData) return;
    const content = infoRef.current?.innerHTML || '';
    const win = window.open('', '_blank');
    if (!win) return;

    // Add a tiny stylesheet so the print:hidden utility works in the popup
    // and give the page a clean print style.
    win.document.write(`
      <html>
        <head>
          <title>Print Asset Barcode/QR</title>
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; padding: 24px; text-align: center; }
            .print\\:hidden { display: none !important; }
            @media print {
              .print\\:hidden { display: none !important; }
            }
            img { image-rendering: pixelated; }
            .qr-box { display: inline-block; padding: 8px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; }
          </style>
        </head>
        <body>
          ${content}
          <script>window.onload = function(){ window.print(); window.close(); };</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  // Nicely render key-value pairs under the header
  const renderQrData = (qrData: any) => {
    if (!qrData) return <div className="text-gray-400">No QR data.</div>;
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left mb-3 w-full">
        {Object.entries(qrData).map(([key, value]) => (
          <div key={key} className="col-span-2 sm:col-span-1 flex">
            <span className="font-semibold mr-2 capitalize">{key}:</span>
            <span>{String(value ?? '-')}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderQrCode = () => {
    if (qrImgSrc) {
      return (
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">QR Code</div>
          <div className="qr-box">
            <img
              src={qrImgSrc}
              alt="QR Code"
              width={160}
              height={160}
              style={{ maxWidth: 160 }}
            />
          </div>
        </div>
      );
    }

    // Fallback: show encoded JSON if for some reason generation failed
    if (barcodeData?.qr_data) {
      return (
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-1">QR Data</div>
          <div className="bg-gray-200 text-sm text-gray-800 p-3 rounded border border-gray-400 select-all max-w-xs break-words">
            {typeof barcodeData.qr_data === 'string'
              ? barcodeData.qr_data
              : JSON.stringify(barcodeData.qr_data)}
          </div>
        </div>
      );
    }
    return <div className="text-gray-400">No QR code available</div>;
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="flex items-center gap-4 mb-4">
        <button className="btn btn-secondary" onClick={() => router.back()}>
          Back
        </button>
        <h1 className="text-2xl font-bold">Print Asset Barcode/QR</h1>
      </div>

      {loading && <div className="p-6 text-center text-lg">Loading...</div>}

      {!loading && !barcodeData && (
        <div className="alert alert-error">No barcode/QR data found for this asset.</div>
      )}

      {barcodeData && (
        <div
          ref={infoRef}
          className="bg-base-100 rounded-xl shadow p-6 flex flex-col gap-4 items-center print:bg-white print:shadow-none print:rounded-none"
        >
          <div className="w-full flex flex-col items-center mb-2">
            <div className="text-lg font-bold">
              {barcodeData?.serial_number || `Asset #${barcodeData.asset_id}`}
            </div>
            {barcodeData?.product_name && (
              <div className="font-medium text-gray-500 mb-1">{barcodeData.product_name}</div>
            )}
            <div className="text-xs text-gray-400">
              Generated at: {barcodeData.generated_at || '-'}
            </div>
          </div>

          {renderQrData(barcodeData.qr_data)}

          <div className="w-full flex justify-center mt-2">
            {renderQrCode()}
          </div>

          <button className="btn btn-secondary mt-4 print:hidden" onClick={handlePrint}>
            Print
          </button>
        </div>
      )}
    </div>
  );
}

import { QRCodeSVG } from 'qrcode.react'; // We'll use a simple img fallback if this fails, but let's try to use a standard approach or just an image API for robustness in this environment.

// Using a public API for QR generation to ensure it works without specific package dependencies in the preview environment if packages are missing.
// However, for a "real" app feel, I will use a simple SVG construction or just the API.
// Let's use the API for simplicity and reliability in the preview.

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
}

export function QRCodeDisplay({ value, size = 150, label }: QRCodeDisplayProps) {
  // Using a reliable QR code API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&color=4A3B32&bgcolor=F5F5F0`;

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-border shadow-sm w-fit mx-auto">
      <img 
        src={qrUrl || "/placeholder.svg"} 
        alt={`QR Code for ${value}`} 
        width={size} 
        height={size}
        className="mix-blend-multiply"
      />
      {label && (
        <span className="text-xs font-mono text-muted-foreground mt-1 text-center max-w-[150px] break-words">
          {label}
        </span>
      )}
    </div>
  );
}

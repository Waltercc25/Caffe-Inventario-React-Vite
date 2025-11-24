import { QRCodeSVG } from 'qrcode.react'

interface QRCodeDisplayProps {
  value: string
  size?: number
  label?: string
}

export function QRCodeDisplay({ value, size = 150, label }: QRCodeDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-border shadow-sm w-fit mx-auto">
      <QRCodeSVG 
        value={value}
        size={size}
        level="H"
        includeMargin={true}
        className="mix-blend-multiply"
      />
      {label && (
        <span className="text-xs font-mono text-muted-foreground mt-1 text-center max-w-[150px] break-words">
          {label}
        </span>
      )}
    </div>
  )
}


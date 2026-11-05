import { useRef, useState, type DragEvent } from 'react'
import { FileUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { SAMPLES } from '@/lib/backend/seed'
import { asset } from '@/lib/asset'

interface DropzoneProps {
  onFile: (file: File) => void
  loading?: boolean
  error?: string | null
  compact?: boolean
}

export function Dropzone({ onFile, loading, error, compact }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed text-center transition-colors',
        compact ? 'px-6 py-10' : 'px-6 py-16 sm:py-20',
        dragging ? 'border-brand bg-blush/60' : 'border-ink/15 bg-mist/60 hover:border-ink/30',
      )}
    >
      <div className={cn('mb-5 flex size-16 items-center justify-center rounded-2xl text-white shadow-lg', dragging ? 'bg-brand' : 'bg-ink')}>
        {loading ? <Loader2 className="size-7 animate-spin" /> : <FileUp className="size-7" />}
      </div>
      <p className="text-xl font-semibold">{loading ? 'Analyzing your model…' : 'Drop your STL file here'}</p>
      <p className="mt-1 text-ink/55">Binary or ASCII STL, up to 50 MB. Your file stays private.</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-ink/10 hover:ring-ink/25"
      >
        Browse files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".stl,model/stl,application/sla"
        className="sr-only"
        aria-label="Upload STL file"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-blush px-3 py-2 text-sm font-medium text-brand">
          {error}
        </p>
      )}
    </div>
  )
}

export function SamplePicker({ onPick, disabled }: { onPick: (file: File) => void; disabled?: boolean }) {
  const [busy, setBusy] = useState<string | null>(null)
  const pick = async (file: string) => {
    setBusy(file)
    try {
      const res = await fetch(asset(`samples/${file}`))
      const blob = await res.blob()
      onPick(new File([blob], file, { type: 'model/stl' }))
    } finally {
      setBusy(null)
    }
  }
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-ink/55">No file handy? Try a sample model:</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SAMPLES.map((s) => (
          <button
            key={s.file}
            type="button"
            disabled={disabled || !!busy}
            onClick={() => pick(s.file)}
            className="group flex flex-col items-start rounded-2xl border border-ink/10 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-md"
          >
            <span className="font-semibold group-hover:text-brand">{s.name}</span>
            <span className="mt-0.5 text-xs text-ink/50 tabular-nums">
              {Math.round(s.metrics.bbox.x)} × {Math.round(s.metrics.bbox.y)} × {Math.round(s.metrics.bbox.z)} mm
            </span>
            {busy === s.file && <Loader2 className="mt-2 size-4 animate-spin text-ink/40" />}
          </button>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/** Accessible modal built on the native <dialog> element. */
export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal?.()
    if (!open && el.open) el.close?.()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(92vw,460px)] rounded-2xl bg-white p-0 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
      aria-labelledby="dialog-title"
    >
      {open && (
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id="dialog-title" className="text-lg font-semibold">
              {title}
            </h2>
            <button onClick={onClose} className="-m-1 rounded-lg p-1 text-ink/50 hover:bg-mist hover:text-ink" aria-label="Close">
              <X className="size-5" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}

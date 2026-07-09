export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm bg-cod-panel border border-cod-border rounded-lg p-5 shadow-xl">
        <h2 className="text-base font-bold text-gray-100 mb-2">{title}</h2>
        <p className="text-sm text-gray-400 mb-5">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded border border-cod-border text-gray-300 hover:bg-cod-panel2"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded bg-red-600 text-white font-semibold hover:bg-red-500"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}

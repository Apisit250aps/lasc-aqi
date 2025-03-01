interface Modal {
  id: string
  children?: React.ReactNode
}

export function closeModal(id: string) {
  const modal = document.getElementById(id) as HTMLDialogElement
  modal.close()
}

export function openModal(id: string) {
  const modal = document.getElementById(id) as HTMLDialogElement
  modal.showModal()
}

export function DialogModal({ children, id }: Modal) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        {children}
      </div>
    </dialog>
  )
}

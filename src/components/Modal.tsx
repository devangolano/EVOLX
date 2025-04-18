interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function Modal({ isOpen, onClose, onConfirm, title, message }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h2 className="text-xl font-semibold text-[#333333] mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-[#FF6B00] text-white rounded-md hover:bg-[#e66000] transition-colors duration-200"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
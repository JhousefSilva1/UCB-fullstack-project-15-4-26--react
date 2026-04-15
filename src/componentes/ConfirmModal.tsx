type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

// function ConfirmModal({ title, message, onConfirm, onCancel }) {
//   return (
//     <div className="modal-overlay">
//       <div className="modal-box">
//         <h2>{title}</h2>
//         <p>{message}</p>

//         <div className="modal-actions">
//           <button className="modal-cancel-btn" onClick={onCancel}>
//             Cancel
//           </button>
//           <button className="modal-delete-btn" onClick={onConfirm}>
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ConfirmModal;
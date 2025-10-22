import React, { useEffect, useState } from "react";
import { Modal, ModalBody, Spinner } from "reactstrap";

interface DeleteModalProps {
  show?: boolean;
  onDeleteClick?: () => void;
  onCloseClick?: () => void;
  recordId?: string;
  showSpinner?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ show, onDeleteClick, onCloseClick, recordId, showSpinner }) => {
  const [showTempSpinner, setShowSpinner] = useState<boolean>(false);

  // Reset the spinner state only when the modal is opened
  useEffect(() => {
    if (showSpinner) {
      setShowSpinner(false);
    }
  }, [showSpinner]);
  const setDeleteData = () => {
    setShowSpinner(true);
    onDeleteClick?.(); // Invoke the onDeleteClick function if defined
  }

  return (
    <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true}
      backdrop="static" // Prevents closing on outside click
    >
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          <i className="ri-delete-bin-line display-5 text-danger"></i>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Are you sure ?</h4>
            <p className="text-muted mx-4 mb-0">
              Are you sure you want to remove this record ?
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-light"
            data-bs-dismiss="modal"
            onClick={onCloseClick}
          >
            Close
          </button>
          <button
            type="button"
            className="btn w-sm btn-danger "
            id="delete-record"
            onClick={() => setDeleteData()}
            disabled={
              showTempSpinner
            } // Disable button when loader is active
          >
            {showTempSpinner && (
              <Spinner
                size="sm"
                className="me-2"
              >
                Loading...
              </Spinner>
            )}
            Yes, Delete It!
          </button>
        </div>
      </ModalBody>
    </Modal>
  ) as unknown as JSX.Element;
};

export default DeleteModal;
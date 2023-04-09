import React, {useCallback} from "react";


// a modal component to confirm deletion
export function DeleteModal({
                                setShow,
                                deleteFunction
                            }: { setShow: (state: boolean) => void, deleteFunction: () => void }): React.ReactElement {
    // function to handle the deletion of a contact
    const handleDelete = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // call the delete function
        deleteFunction();
        // close the modal
        setShow(false);
    }, [deleteFunction, setShow]);
    return (
        <div className={'delete-modal'}>
            <div className="modal-content">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this contact?</p>
                <div className="modal-buttons">
                    <button onClick={() => setShow(false)}>Cancel</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
}
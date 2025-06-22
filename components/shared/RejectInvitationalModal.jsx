import React from "react";

const RejectInvitationalModal = ({ open, title = "Delete Item", message = "Are you sure?", onConfirm, onCancel, onClose, DeleteText="Reject" }) => {

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
                <button

                    className="absolute top-3 right-4 text-gray-800 hover:text-gray-700 cursor-pointer"

                    onClick={onClose}
                >

                    ✕
                </button>
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button

                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"

                        onClick={onCancel || onClose}
                    >

                        Cancel
                    </button>
                    <button

                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"

                        onClick={onConfirm}
                    >

                        {DeleteText}
                    </button>
                </div>
            </div>
        </div>

    );

};

export default RejectInvitationalModal;

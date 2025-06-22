import React from "react";

const InvitationalModal = ({ open, title = "Delete Item", message = "Are you sure?", onConfirm, onCancel, onClose, DeleteText = "Yes", confirmColor = "green-600", confirmColorHover="green-700" }) => {

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 !z-[99]">
            <div className="bg-white rounded-lg shadow-lg p-6 w-60 xs:w-96 3xl:w-110 relative">
                <button
                    className="absolute top-3 right-4 text-gray-800 hover:text-gray-700 cursor-pointer"
                    onClick={onClose}
                >
                    ✕
                </button>
                <h2 className="text-[14px] sm:text-xl 3xl:text-[22px] font-bold mb-4">{title}</h2>
                <p className="text-gray-700 text-[13px] sm:text-[16px] mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 text-[13px] sm:text-[16px] bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                        onClick={onCancel || onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className={`px-4 py-2 text-[13px] sm:text-[16px] bg-${confirmColor} text-white rounded hover:bg-${confirmColorHover} cursor-pointer`}
                        onClick={onConfirm}
                    >
                        {DeleteText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvitationalModal;

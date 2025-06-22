import React from "react";

const DeleteModal = ({ open, title = "Delete Item", message = "Are you sure?", onConfirm, onCancel, onClose, DeleteText = "Delete" }) => {

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
                <h2 className="text-xl font-bold mb-4 2xl:text-[26px] 2xl:font-semibold">{title}</h2>
                <p className="text-gray-700 mb-6 2xl:text-[22px]">{message}</p>
                <div className="flex justify-end gap-3">
                    <button

                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer 2xl:text-[24px]"

                        onClick={onCancel || onClose}
                    >

                        Cancel
                    </button>
                    <button

                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer 2xl:text-[24px]"

                        onClick={onConfirm}
                    >

                        {DeleteText}
                    </button>
                </div>
            </div>
        </div>
    );

};

export default DeleteModal;
// import React from "react";
// import Errorpanel from "./Errorpanel";
// import { Loadingoverlay } from "@nayeshdaggula/tailify";

// const DeleteModal = ({
//     open,
//     title = "Delete Item",
//     message = "Are you sure?",
//     onConfirm,
//     onCancel,
//     onClose,
//     DeleteText = "Delete",
//     errormessage = "",
//     loading = false
// }) => {
//     if (!open) return null;

//     return (
//         <div className="relative">
//             <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//                 <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
//                     <button
//                         className="absolute top-3 right-4 text-gray-800 hover:text-gray-700 cursor-pointer"
//                         onClick={onClose}
//                     >
//                         ✕
//                     </button>
//                     <h2 className="text-xl font-bold mb-4">{title}</h2>
//                     <p className="text-gray-700 mb-6">{message}</p>
//                     <div className="flex justify-end gap-3">
//                         <button
//                             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
//                             onClick={() => (onCancel ? onCancel() : onClose())}
//                             disabled={loading}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer disabled:opacity-50"
//                             onClick={onConfirm}
//                             disabled={loading}
//                         >
//                             {loading ? "Deleting..." : DeleteText}
//                         </button>
//                     </div>
//                     {errormessage && (
//                         <div className="mt-4">
//                             <Errorpanel errorMessages={errormessage} />
//                         </div>
//                     )}
//                     {loading && (
//                         <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex justify-center items-center z-50 rounded-lg">
//                             <Loadingoverlay visible={loading} overlayBg="" />
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DeleteModal;



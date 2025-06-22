'use client'
import Link from 'next/link'
import React from 'react'

function Errorpanel({ errorMessages }) {
    return (
        <div className="bg-red-50 border mt-2 border-red-200 text-sm mx-4 rounded-lg p-4" role="alert">
            <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex flex-col items-center justify-center space-y-1">
                    <p className="font-bold text-red-500">Message</p>
                    <p>{errorMessages?.message}</p>
                </div>
                {(errorMessages?.server_res !== null && errorMessages?.server_res !== undefined) && (
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <p className="font-bold text-red-500">Server Response</p>
                        <pre className="bg-gray-100 text-gray-800 p-2 rounded-md whitespace-pre-wrap break-words text-xs w-full overflow-auto">
                            {JSON.stringify(errorMessages.server_res)}
                        </pre>
                    </div>
                )}
                {(errorMessages?.url !== null && errorMessages?.url !== undefined) && (
                    <Link href={errorMessages.url} className="flex justify-start items-start rounded-lg">
                        <div
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm"
                        >
                            <svg
                                width={16}
                                height={12}
                                viewBox="0 0 16 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.505024 5.50503C0.231657 5.77839 0.231657 6.22161 0.505024 6.49497L4.9598 10.9497C5.23316 11.2231 5.67638 11.2231 5.94975 10.9497C6.22311 10.6764 6.22311 10.2332 5.94975 9.9598L1.98995 6L5.94975 2.0402C6.22311 1.76684 6.22311 1.32362 5.94975 1.05025C5.67638 0.776886 5.23316 0.776886 4.9598 1.05025L0.505024 5.50503ZM16 5.3L0.999999 5.3V6.7L16 6.7V5.3Z"
                                    fill="#101010"
                                />
                            </svg>
                            <p className="text-sm font-medium text-gray-900">Back</p>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Errorpanel
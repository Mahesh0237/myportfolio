'use client'
import React, { useState } from 'react';
import Employeeapi from '@/components/api/Employeeapi';
import { toast } from 'react-toastify';
import { useEmployeDetails } from '@/components/zustand/useEmployeDetails';

function Addnewform({ reloadGetroledata }) {
    const userInfo = useEmployeDetails(state => state.userInfo);
    const access_token = useEmployeDetails(state => state.access_token);
    let user_id = userInfo?.user_id || '';

    const [roleName, setRoleName] = useState('');
    const [roleNameError, setRoleNameError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const updateRoleName = (e) => {
        setRoleName(e.target.value);
        setRoleNameError('');
    };

    const submiteRoleName = async () => {
        setIsLoading(true);

        if (!roleName.trim()) {
            setRoleNameError('Role Name is required');
            setIsLoading(false);
            return;
        }

        if (['super admin', 'superadmin'].includes(roleName.toLowerCase())) {
            setRoleNameError('Role Name is already taken');
            setIsLoading(false);
            return;
        }

        if (roleName === '') {
            setRoleNameError('Role is required');
            setIsLoading(false);
            return false;
        }

        await Employeeapi.post('addnewrole', {
            role_name: roleName,
            user_id: user_id
        }, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        })
            .then((response) => {
                let data = response?.data;
                if (data.status === 'error') {
                    console.log(data?.message);
                    setIsLoading(false);
                    return false;
                }
                if (data?.status === 'success') {
                    toast.success(data?.message);
                    setRoleName('');
                    setIsLoading(false);
                    reloadGetroledata();
                }
            }).catch((error) => {
                console.log(error);
            })
    };

    return (
        <div className="relative self-baseline shadow-sm p-4 rounded-lg bg-transparent border border-gray-300">
            {/* Header Section */}
            <div className="py-2 border-b border-gray-300 bg-white">
                <p className="text-lg font-bold">Add New</p>
            </div>

            {/* Input Section */}
            <div className="py-2 border-b border-gray-300">
                <div className="py-2 flex flex-col">
                    <input
                        type="text"
                        placeholder="Role Name"
                        name="rolename"
                        value={roleName}
                        onChange={updateRoleName}
                        className={`w-full px-4 py-2 border rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#044093] focus:border-none ${roleNameError ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {roleNameError && (
                        <p className="text-red-500 text-sm mt-1">{roleNameError}</p>
                    )}
                </div>
            </div>

            {/* Button Section */}
            <div className="py-2">
                <button
                    onClick={submiteRoleName}
                    disabled={isLoading}
                    className="cursor-pointer flex justify-center w-full items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-[#044093] hover:text-white text-[#044093] border-[0.8px] border-[#044093]"
                >
                    <p className="text-sm font-medium">Add New</p>
                </button>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}

export default Addnewform;






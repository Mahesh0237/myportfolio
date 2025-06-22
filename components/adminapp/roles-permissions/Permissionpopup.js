import { useEmployeDetails } from '@/components/zustand/useEmployeDetails';
import { IconArrowLeft } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const Sharedpermissionlist = dynamic(() => import('./Sharedpermissionlist'), { ssr: false });

function Permissionpopup({ closePermissionsModel, roleId, reloadGetRolesInfo }) {
  const userInfo = useEmployeDetails((state) => state.userInfo);
  const access_token = useEmployeDetails((state) => state.access_token);
  // let user_id = userInfo.user_id;

  const [mainPages, setMainPages] = useState([]);
  const [driversPage, setDriversPage] = useState([]);
  const [bookingsPage, setBookingsPage] = useState([]);
  const [usersPage, setUsersPage] = useState([]);
  const [custromersPage, setCustromersPage] = useState([]);
  const [settingsPage, setSettingsPage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateMainPages = (value) => {
    setMainPages(value);
    setDriversPage(value.includes('drivers_page') ? ['add_driver', 'edit_driver', 'delete_driver', 'view_driver'] : []);
    setBookingsPage(value.includes('bookings_page') ? ['add_booking', 'edit_booking', 'delete_booking', 'view_booking'] : []);
    setUsersPage(value.includes('users_page') ? ['add_user', 'edit_user', 'delete_user', 'view_user', 'change_password'] : []);
    setCustromersPage(value.includes('custromers_page') ? ['add_customer', 'edit_customer', 'delete_customer', 'view_customer'] : []);
    setSettingsPage(
      value.includes('settings_page')
        ? [
          'update_info',
          'update_address',
          'add_contact_person',
          'edit_contact_person',
          'delete_contact_person',
          'update_theme',
          'add_category',
          'edit_category',
          'delete_category',
          'view_billing_history',
        ]
        : []
    );
  };

  const updateDriversPage = (value) => {
    setDriversPage(value);
    toggleMainPage('drivers_page', value.length > 0);
  };

  const updateBookingsPage = (value) => {
    setBookingsPage(value);
    toggleMainPage('bookings_page', value.length > 0);
  };

  const updateUsersPage = (value) => {
    setUsersPage(value);
    toggleMainPage('users_page', value.length > 0);
  };

  const updateCustromersPage = (value) => {
    setCustromersPage(value);
    toggleMainPage('custromers_page', value.length > 0);
  };

  const updateSettingsPage = (value) => {
    setSettingsPage(value);
    toggleMainPage('settings_page', value.length > 0);
  };

  const toggleMainPage = (page, add) => {
    if (add && !mainPages.includes(page)) {
      setMainPages([...mainPages, page]);
    } else if (!add && mainPages.includes(page)) {
      setMainPages(mainPages.filter((p) => p !== page));
    }
  };

  const updatePermissions = (roleId) => {
    setIsLoading(true);
    // Example API logic
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <p className="text-lg text-[#044093] font-bold">Permissions</p>
        <button
          onClick={closePermissionsModel}
          className="group flex items-center px-3 py-2 border border-[0.8PX] border-[#044093] hover:bg-[#044093] hover:text-white text-[#044093] rounded-lg text-sm"
        >
          <IconArrowLeft size={20} className='group-hover:text-white text-[#044093]' />
          <span className="group-hover:text-white">Close</span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="max-h-96 overflow-y-auto">
        <Sharedpermissionlist
          mainPages={mainPages}
          updateMainPages={updateMainPages}
          driversPage={driversPage}
          updateDriversPage={updateDriversPage}
          bookingsPage={bookingsPage}
          updateBookingsPage={updateBookingsPage}
          usersPage={usersPage}
          updateUsersPage={updateUsersPage}
          custromersPage={custromersPage}
          updateCustromersPage={updateCustromersPage}
          settingsPage={settingsPage}
          updateSettingsPage={updateSettingsPage}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t pt-4">
        <button
          className="px-4 py-2 text-white bg-[#044093] rounded-md"
          onClick={() => updatePermissions(roleId)}
        >
          Update Permissions
        </button>
        {isLoading && <div className="ml-4 text-sm text-gray-500">Loading...</div>}
      </div>
    </div>
  );
}

export default Permissionpopup;

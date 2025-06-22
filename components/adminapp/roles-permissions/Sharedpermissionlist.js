'use client';

import React from 'react';

function SharedPermissionList({
    mainPages,
    updateMainPages,
    driversPage,
    updateDriversPage,
    bookingsPage,
    updateBookingsPage,
    usersPage,
    updateUsersPage,
    customersPage,
    updateCustomersPage,
    settingsPage,
    updateSettingsPage,
}) {
    return (
        <div className="py-4 grid grid-cols-6">
            {/* Main Pages */}
            <div className="mb-6 col-span-6">
                <p className="font-bold text-sm border-b-[0.8px] py-2">Main Pages</p>
                <div className="mt-2 space-y-2">
                    {['drivers_page', 'bookings_page', 'users_page', 'customers_page', 'settings_page'].map((value) => (
                        <label key={value} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={value}
                                // checked={mainPages.includes(value)}
                                onChange={() => updateMainPages(value)}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm capitalize">{value.replace('_page', '').replace('_', ' ')}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Drivers Page */}
            <div className="mb-6 col-span-2">
                <p className="font-bold text-sm border-b-[0.8px] py-2">Drivers Page</p>
                <div className="mt-2 space-y-2">
                    {['add_driver', 'edit_driver', 'delete_driver', 'view_driver'].map((value) => (
                        <label key={value} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={value}
                                // checked={driversPage.includes(value)}
                                onChange={() => updateDriversPage(value)}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm capitalize">{value.replace('_', ' ')}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Users Page */}
            <div className="mb-6 col-span-2">
                <p className="font-bold text-sm border-b-[0.8px] py-2">Users Page</p>
                <div className="mt-2 space-y-2">
                    {['add_user', 'edit_user', 'delete_user', 'view_user', 'change_password'].map((value) => (
                        <label key={value} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={value}
                                // checked={usersPage.includes(value)}
                                onChange={() => updateUsersPage(value)}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm capitalize">{value.replace('_', ' ')}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Customers Page */}
            <div className="mb-6 col-span-2">
                <p className="font-bold text-sm border-b-[0.8px] py-2">Customers Page</p>
                <div className="mt-2 space-y-2">
                    {['add_customer', 'edit_customer', 'delete_customer', 'view_customer'].map((value) => (
                        <label key={value} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={value}
                                // checked={customersPage.includes(value)}
                                onChange={() => updateCustomersPage(value)}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm capitalize">{value.replace('_', ' ')}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Settings Page */}
            <div className="mb-6 col-span-6">
                <p className="font-bold text-sm border-b-[0.8px] py-2 mb-2">Settings Page</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Company Info */}
                    <div>
                        <p className="text-sm text-[#000000] mb-2">Company Info</p>
                        {['update_info', 'update_address', 'add_contact_person', 'edit_contact_person', 'delete_contact_person'].map((value) => (
                            <label key={value} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={value}
                                    //   checked={settingsPage.includes(value)}
                                    onChange={() => updateSettingsPage(value)}
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                />
                                <span className="text-sm capitalize">{value.replace('_', ' ')}</span>
                            </label>
                        ))}
                    </div>

                    {/* Theme Settings */}
                    <div>
                        <p className="text-sm font-medium mb-2">Theme Settings</p>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value="update_theme"
                                // checked={settingsPage.includes('update_theme')}
                                onChange={() => updateSettingsPage('update_theme')}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm">Update Theme</span>
                        </label>
                    </div>

                    {/* Categories */}
                    <div>
                        <p className="text-sm font-medium mb-2">Categories</p>
                        {['add_category', 'edit_category', 'delete_category'].map((value) => (
                            <label key={value} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={value}
                                    //   checked={settingsPage.includes(value)}
                                    onChange={() => updateSettingsPage(value)}
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                />
                                <span className="text-sm capitalize">{value.replace('_', ' ')}</span>
                            </label>
                        ))}
                    </div>

                    {/* Billing History */}
                    <div>
                        <p className="text-sm font-medium mb-2">Billing History</p>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value="view_billing_history"
                                // checked={settingsPage.includes('view_billing_history')}
                                onChange={() => updateSettingsPage('view_billing_history')}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm">View Billing History</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SharedPermissionList;
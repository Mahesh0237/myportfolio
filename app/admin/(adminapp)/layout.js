import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardLayoutwrapper from './DashboardLayoutwrapper';

async function DashboardLayout({ children }) {

    const cookieStore = await cookies();
    const isLoggedCookie = cookieStore.get('adminis_logged')?.value;

    if (isLoggedCookie === "false" || !isLoggedCookie) {
        redirect('/admin');
    }

    return (
        <DashboardLayoutwrapper>
            {children}
        </DashboardLayoutwrapper>
    );
}

export default DashboardLayout
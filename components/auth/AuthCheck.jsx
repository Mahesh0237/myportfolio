'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserDetails } from '../zustand/useUserDetails';

export default function AuthCheck({ children, uuid, is_logged, href }) {
    const router = useRouter();
    const resetAuthDetails = useUserDetails((state) => state.resetAuthDetails);

    useEffect(() => {
        if (!uuid || !is_logged) {
            resetAuthDetails();
            if (href) {
                router.push(href || '/login');
            }
        }
    }, [uuid, is_logged, href]);

    return <>{children}</>;
}


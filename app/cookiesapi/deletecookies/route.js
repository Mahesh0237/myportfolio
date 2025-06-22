import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();

    // Remove stored cookies
    cookieStore.delete('access_token');
    cookieStore.delete('is_logged');
    cookieStore.delete('user_type');
    cookieStore.delete('uuid');

    return NextResponse.json({
        message: 'Logged out successfully',
        status: 'success'
    });
}

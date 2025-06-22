import { cookies } from 'next/headers'

export async function POST(request) {
    const body = await request.json();
    const { access_token, is_logged, uuid, user_type } = body;
    const cookieStore = await cookies();

    cookieStore.set({
        name: 'access_token',
        value: access_token,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    cookieStore.set({
        name: 'is_logged',
        value: is_logged,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    cookieStore.set({
        name: 'uuid',
        value: uuid,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    cookieStore.set({
        name: 'user_type',
        value: user_type,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // cookieStore.delete('unregistered_user_token');

    return new Response(JSON.stringify({
        message: 'updated',
        status: 'success'
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
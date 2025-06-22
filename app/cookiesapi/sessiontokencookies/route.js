import { cookies } from 'next/headers'

//route service api nextjs
export async function GET(request) {
    const cookieStore = await cookies()
    const { searchParams } = new URL(request.url);
    let sessionToken = searchParams.get('unregistered_user_token')

    //set cookies
    cookieStore.set({
        name: 'unregistered_user_token',
        value: sessionToken,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    })

    return Response.json({
        message: 'updated',
        status: 'success'
    })
}

export async function POST() {
    const cookieStore = cookies();

    // Remove stored cookies
    cookieStore.delete('anon_session');

    return Response.json({
        message: 'Removed  successfully',
        status: 'success'
    });
}

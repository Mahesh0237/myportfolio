import { cookies } from 'next/headers'

//route service api nextjs
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const adminaccessToken = searchParams.get('adminaccessToken')
    const adminis_logged = searchParams.get('adminis_logged')
    const adminuuid = searchParams.get('adminuuid')
    const adminuser_type = searchParams.get('adminuser_type')

    const cookieStore = await cookies()

    //set cookies
    cookieStore.set({
        name: 'adminaccessToken',
        value: adminaccessToken,
        httpOnly: true,
        path: '/',
    })

    cookieStore.set({
        name: 'adminis_logged',
        value: adminis_logged,
        httpOnly: true,
        path: '/',
    })

    cookieStore.set({
        name: 'adminuuid',
        value: adminuuid,
        httpOnly: true,
        path: '/',
    })

    cookieStore.set({
        name: 'adminuser_type',
        value: adminuser_type,
        httpOnly: true,
        path: '/',
    })

    return Response.json({
        message: 'updated',
        status: 'success'
    })
}

export async function POST() {
    const cookieStore = cookies();

    // Remove stored cookies
    cookieStore.delete('adminaccessToken');
    cookieStore.delete('adminis_logged');
    cookieStore.delete('adminuuid');
    cookieStore.delete('adminuser_type');

    return Response.json({
        message: 'Logged out successfully',
        status: 'success'
    });
}
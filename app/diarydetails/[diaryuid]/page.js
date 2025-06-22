import React, { Suspense } from 'react'
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import Diariesapi from '@/components/api/Diariesapi';
import AuthCheck from '@/components/auth/AuthCheck';
import { randomUUID } from 'crypto';
const Headwrapper = dynamic(() => import('@/components/header/Headwrapper'))
const Footerone = dynamic(() => import('@/components/footer/Footerone'))
const Topbarwrapper = dynamic(() => import('@/components/topbar/Topbarwrapper'))
const Diarydetails = dynamic(() => import('@/components/diarydetails/Diarydetails'))

async function page({ params, searchParams }) {
    const diary_access_token = searchParams?.diary_access_token;
    const sender_uid = searchParams?.sender_uid;
    const { diaryuid } = params;
    const cookieStore = await cookies();
    const uuid = cookieStore.get('uuid')?.value;
    const is_logged = cookieStore.get('is_logged')?.value;

    let sessionToken = cookieStore.get('unregistered_user_token')?.value;

    // if (is_logged === "false" && !sessionToken) {
    //     sessionToken = randomUUID();
    // }

    const getDiarypageContent = await getDiaryPageContent(diaryuid, uuid, sessionToken);
    if (getDiarypageContent.status === 'error') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="bg-red-100 p-4 rounded-lg shadow-md inline-block">
                        <p className="text-red-600 text-lg font-medium">
                            {getDiarypageContent?.message || 'Error fetching diary details. Please try again later.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    const diary_details = getDiarypageContent?.diarydetails;
    const totaldiaryPagesCount = getDiarypageContent?.totaldiaryPagesCount;
    const access_denied = getDiarypageContent?.access_denied;
    return (
        <Suspense>
            <Topbarwrapper />
            <Headwrapper
                uuid={uuid}
            />
            <AuthCheck uuid={uuid} is_logged={is_logged} href={`/diarydetails/${diaryuid}`}>
                <Diarydetails
                    diaryuid={diaryuid}
                    user_uid={uuid}
                    is_logged={is_logged}
                    diarypageno={1}
                    diary_details={diary_details}
                    totaldiaryPagesCount={totaldiaryPagesCount}
                    diaryacestokn={diary_access_token}
                    senderUid={sender_uid}
                    access_denied={access_denied ? access_denied : null}
                    unregisteredusertoken={sessionToken}
                />
            </AuthCheck>
            <Footerone />
        </Suspense>
    )
}

export default page

async function getDiaryPageContent(diaryuid, uuid, sessionToken) {
    try {
        const response = await Diariesapi.get('/getsingledairydata', {
            params: {
                uid: diaryuid,
                page_no: 1,
                user_uid: uuid,
                pageviewcount: true,
                // unregistered_token: sessionToken
            }
        });
        const data = response.data;
        if (data.status === 'error') {
            let finaldata = {
                status: 'error',
                message: data?.message || 'Error fetching diary details',
                diarydetails: {},
                totaldiaryPagesCount: 0,
            }
            return finaldata;
        } else if (data.status === 'access_denied') {
            let finaldata = {
                status: 'access_denied',
                message: 'Access denied to this diary',
                diarydetails: {},
                totaldiaryPagesCount: 0,
                access_denied: data,
            }
            return finaldata;
        }
        let finaldata = {
            status: 'success',
            message: 'diary details fetched successfully',
            diarydetails: data?.diaryPageDetails || {},
            totaldiaryPagesCount: data?.totaldiaryPagesCount,
        }
        return finaldata;
    } catch (error) {
        console.error('Error fetching diary details:', error);
        let finaldata = {
            status: 'error',
            message: 'Error fetching diary details',
            diarydetails: {},
            totaldiaryPagesCount: 0,
        }
        return finaldata;
    }
}

function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function truncateText(text, maxLength = 160) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength).trim() + '...' : text;
}

export async function generateMetadata({ params }) {
    try {
        // Fetch diary details
        const response = await Diariesapi.get('/getdiarydataformetainfo', {
            params: {
                uid: params.diaryuid,
                page_no: 1,
            },
        });
        // const result = await getDiaryPageContent(params.diaryuid);

        if (response.data.status === 'error') {
            return {
                title: 'Diary Not Found',
                description: 'The requested diary could not be found'
            };
        }

        const diary = response.data?.diaryPageDetails;
        const plainTextContent = stripHtml(diary?.content);
        const shortDescription = truncateText(plainTextContent, 160);

        const imageUrl = diary?.diarypage_featured_image || diary?.featured_image_url;

        return {
            title: diary?.name || 'Diary Page',
            description: shortDescription || 'View this detailed diary page',
            openGraph: {
                title: diary?.name || 'Diary Page',
                description: shortDescription,
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: diary?.name,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: diary?.name || 'Diary Page',
                description: shortDescription,
                images: [imageUrl],
            },
        };
    }
    catch (error) {
        return {
            title: 'Diary Page',
            description: 'View this detailed diary page'
        };
    }
}
'use client'
import Userdashboardapi from '@/components/api/Userdashboardapi'
import { useUserDetails } from '@/components/zustand/useUserDetails'
import React, { useEffect, useState } from 'react'
import Latestinvitationrequests from './parts/Latestinvitationrequests'
import Latestcomments from './parts/Latestcomments'
import Latestdashboarddiaries from './parts/Latestdashboarddiaries'
import Latestinvitationdiaries from './parts/Latestinvitationdiaries'

function Dashboardwrapper({ user_uid }) {
    const access_token = useUserDetails((state) => state.access_token)
    const [eerrorMessage, setErrorMessage] = useState('')
    const [latestInvitationRequestsLoading, setLatestInvitationRequestsLoading] = useState(false)
    const [latestInvitationRequests, setLatestInvitationRequests] = useState([])
    async function fetchLatestInvitationRequests(userUid) {
        setLatestInvitationRequestsLoading(true)
        Userdashboardapi.get('getlatestinvitationrequests', {
            params: {
                user_uid: userUid,
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    setLatestInvitationRequestsLoading(false)
                    let finalResponse = {
                        "message": data.message,
                        "server_res": data,
                    }
                    setErrorMessage(finalResponse)
                    return false
                }
                setLatestInvitationRequestsLoading(false)
                setLatestInvitationRequests(data?.latest_invitation_requests || [])
            })
            .catch((error) => {
                console.log('Error:', error);
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        'message': error.message,
                        'server_res': error.response.data
                    };
                } else {
                    finalresponse = {
                        'message': error.message,
                        'server_res': null
                    };
                }
                setErrorMessage(finalresponse);
                setLatestInvitationRequestsLoading(false);
                return false;
            })
    }

    const [latestComments, setLatestComments] = useState([])
    const [latestCommentsLoading, setLatestCommentsLoading] = useState(false)
    async function fetchLatestComments(userUid) {
        setLatestCommentsLoading(true)
        Userdashboardapi.get('getlatestdiarycomments', {
            params: {
                user_uid: userUid,
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    setLatestCommentsLoading(false)
                    let finalResponse = {
                        "message": data.message,
                        "server_res": data,
                    }
                    setErrorMessage(finalResponse)
                    return false
                }
                setLatestCommentsLoading(false)
                setLatestComments(data?.latest_diary_comments || [])
            })
            .catch((error) => {
                console.log('Error:', error);
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        'message': error.message,
                        'server_res': error.response.data
                    };
                } else {
                    finalresponse = {
                        'message': error.message,
                        'server_res': null
                    };
                }
                setErrorMessage(finalresponse);
                setLatestCommentsLoading(false);
                return false;
            })
    }

    const [latestDiries, setLatestDiaries] = useState([])
    const [latestDiriesLoading, setLatestDiariesLoading] = useState(false)
    async function fetchLatestDiaries(userUid) {
        setLatestDiariesLoading(true)
        Userdashboardapi.get('getlatestdiarys', {
            params: {
                user_uid: userUid,
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    setLatestDiariesLoading(false)
                    let finalResponse = {
                        "message": data.message,
                        "server_res": data,
                    }
                    setErrorMessage(finalResponse)
                    return false
                }
                setLatestDiariesLoading(false)
                setLatestDiaries(data?.latest_diaries || [])
            })
            .catch((error) => {
                console.log('Error:', error);
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        'message': error.message,
                        'server_res': error.response.data
                    };
                } else {
                    finalresponse = {
                        'message': error.message,
                        'server_res': null
                    };
                }
                setErrorMessage(finalresponse);
                setLatestDiariesLoading(false);
                return false;
            })
    }

    const [latestInvitationDiries, setLatestInvitationDiries] = useState([])
    const [latestInvitationDiriesLoading, setLatestInvitationDiriesLoading] = useState(false)
    async function fetchLatestInvitationDiries(userUid) {
        setLatestInvitationDiriesLoading(true)
        Userdashboardapi.get('getlatestinviteddiries', {
            params: {
                user_uid: userUid,
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    setLatestInvitationDiriesLoading(false)
                    let finalResponse = {
                        "message": data.message,
                        "server_res": data,
                    }
                    setErrorMessage(finalResponse)
                    return false
                }
                setLatestInvitationDiriesLoading(false)
                setLatestInvitationDiries(data?.latest_invited_diaries || [])
            })
            .catch((error) => {
                console.log('Error:', error);
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        'message': error.message,
                        'server_res': error.response.data
                    };
                } else {
                    finalresponse = {
                        'message': error.message,
                        'server_res': null
                    };
                }
                setErrorMessage(finalresponse);
                setLatestInvitationDiriesLoading(false);
                return false;
            })
    }

    useEffect(() => {
        if (user_uid) {
            fetchLatestInvitationRequests(user_uid)
            fetchLatestComments(user_uid)
            fetchLatestDiaries(user_uid)
            fetchLatestInvitationDiries(user_uid)
        }
    }, [user_uid])

    return (
        <div className='flex flex-col md:flex-row gap-3'>
            <div className=' basis-[100%] md:basis-[65%]'>
                <Latestdashboarddiaries
                    latestDiriesLoading={latestDiriesLoading}
                    latestDiries={latestDiries}
                />
                <Latestinvitationdiaries
                    latestInvitationDiriesLoading={latestInvitationDiriesLoading}
                    latestInvitationDiries={latestInvitationDiries}
                />
            </div>
            <div className='basis-[100%] md:basis-[35%] gap-2 flex flex-col'>
                <Latestinvitationrequests
                    latestInvitationRequestsLoading={latestInvitationRequestsLoading}
                    latestInvitationRequests={latestInvitationRequests}
                />
                <Latestcomments
                    latestCommentsLoading={latestCommentsLoading}
                    latestComments={latestComments}
                />
            </div>
        </div>
    )
}

export default Dashboardwrapper
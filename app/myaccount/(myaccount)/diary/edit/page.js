import Editdiary from '@/components/myaccount/diary/Editdiary'
import React, { Suspense } from 'react'

async function page() {
    return (
        <Suspense>
            <Editdiary />
        </Suspense>
    )
}

export default page
import React from 'react'
import Nav from '../Common/Nav'

const Error404 = () => {
    return (
        <div className='p-3 h-full'>
            <Nav />
            <div className='w-full h-full flex items-center justify-center text-center'>
                <p>You're Not Added In User Management,<br /> Please Contact the Developer.</p>
            </div>
        </div>
    )
}

export default Error404
import React, { useEffect } from 'react'
import { AUTH_URL } from '../Utils/Urls'

const Login = () => {
    return (
        <div className='h-[60%] flex justify-center items-center'>
            <a className="flex bg-black hover:bg-[#1ED760] p-3 rounded-2xl cursor-pointer group relative items-center"
                href={AUTH_URL}
            >
                <img
                    src="../../public/assets/Icons/SpotifyLogo.png"
                    className="mr-3 transition-opacity duration-500 opacity-100 group-hover:opacity-0 absolute left-3"
                    style={{ width: '26px' }}
                />
                <img
                    src="../../public/assets/Icons/SpotifyBlack.png"
                    className="mr-3 transition-opacity duration-500 opacity-0 group-hover:opacity-100 absolute left-3"
                    style={{ width: '26px' }}
                />
                <span className="ml-10">Login</span>
            </a>
        </div>
    )
}

export default Login
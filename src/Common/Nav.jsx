import React, { useContext } from 'react'
import { assets } from '../utils/assets'
import { useLocation, useNavigate } from 'react-router-dom'
import { MusicContext } from '../context/PlayerContext'
import { POST } from '../utils/ApiCall'
import { ForceLogout } from '../utils/AuthHandlers'

const Nav = () => {

    const { isLoggedIn, displayName, isPremiumUser } = useContext(MusicContext);
    const navigate = useNavigate();
    const url = useLocation();
    const isActive = (path) => url.pathname === path;

    async function handleLogout() {
        try {
            const response = await POST('auth/logout')
            if (response.result !== null && response.result.data?.Status == 'Logged Out Successfully') {
                ForceLogout();
            }
        } catch (error) {
            console.error('Error While Logout :', error);
        }
    }

    return (
        <div className='w-full flex justify-between items-center font-semibold'>
            <div className='flex items-center gap-2'>
                <img
                    src={assets.arrow_left}
                    className='w-8 bg-black p-2 rounded-2xl cursor-pointer'
                    onClick={() => navigate(-1)}
                />
                <img
                    src={assets.arrow_right}
                    className='w-8 bg-black p-2 rounded-2xl cursor-pointer'
                    onClick={() => navigate(1)}
                />
            </div>
            <div className='flex items-center gap-4'>
                <img
                    src={assets.search_icon}
                    className={`lg:hidden w-8 cursor-pointer ${isActive('/search') ? 'text-white' : 'text-[#b3b3b3] opacity-50'}`}
                    onClick={() => navigate('/search')}
                />
                {!isPremiumUser && <button className='hidden sm:flex rounded-full px-4 py-1 text-[15px] cursor-pointer text-black bg-white hover:-translate-y-0.5'>
                    Explore Premium
                </button>}
                {isLoggedIn && <button className='hidden sm:flex rounded-full px-3 py-1 text-[15px] cursor-pointer text-white bg-[#0E0E0E] hover:-translate-y-0.5'
                    onClick={handleLogout}
                >
                    Logout
                </button>}
                <img
                    src={assets.bell_icon}
                    className='w-8 bg-[#0E0E0E] p-2 rounded-2xl cursor-pointer hover:-translate-y-0.5'
                />
                <p className='bg-blue-500 text-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer'>
                    {displayName}
                </p>
            </div>
        </div>
    )
}

export default Nav
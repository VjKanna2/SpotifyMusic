import React, { useContext, useEffect, useState } from 'react'
import Nav from '../Common/Nav'
import { assets } from '../utils/assets'
import Login from '../SpotifyPages/Login'
import { MusicContext } from '../context/PlayerContext'
import { POST } from '../utils/ApiCall'
import SongList from '../SpotifyPages/SongList'

const Search = () => {

    const { isLoggedIn, isPremiumUser, device, playSpecific } = useContext(MusicContext);

    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [tracks, setTracks] = useState(null);

    useEffect(() => {
        const apiCallDelay = setTimeout(() => {
            if (searchText.length >= 3) searchSongs(searchText);
            else setTracks(null);
        }, 1000);
        return () => clearTimeout(apiCallDelay);
    }, [searchText]);

    const searchSongs = async (value) => {
        try {
            setLoading(true);
            const response = await POST('spotify/search', { searchTerm: value })
            if (response.result !== null && response.result.data?.Status == "Success") {
                setTracks(response.result?.data?.data);
            }
        } catch (error) {
            console.error('Error While Getting Songs :', error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='px-6 pt-4 bg-[#121212] h-[100%] overflow-y-auto'>
            <Nav />
            <div className='relative w-[75%] sm:w-[40%] [@media(max-width:385px)]:w-[100%] mt-6'>
                <img
                    src={assets.search_icon}
                    className='absolute w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 z-10'
                />
                <input
                    type="text"
                    className='w-full pl-10 p-3 rounded-full bg-[#242424] border-none text-white placeholder-[#757575]'
                    placeholder='What do you want to play?'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    disabled={!isLoggedIn}
                />
            </div>
            {(isLoggedIn && !isPremiumUser) &&
                <p className='text-sm text-[#1ED760] my-4'>
                    <i>* Note: You Need Spotify Premium Subscription to Listen Music Here</i>
                </p>
            }
            {isLoggedIn ?
                (tracks && <SongList
                    tracks={tracks}
                    isPremiumUser={isPremiumUser}
                    device={device}
                    playSpecific={playSpecific}
                />) : <Login />
            }
            {(loading && tracks == null) && <div className='h-[60%] flex justify-center items-center'>
                <p><i>Loading...</i></p>
            </div>}
        </div>
    )
}

export default Search
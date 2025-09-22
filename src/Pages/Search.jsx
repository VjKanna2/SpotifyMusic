import React, { useContext, useEffect, useRef, useState } from 'react'
import Nav from '../Common/Nav'
import { assets } from '../Utils/Assets'
import Login from '../SpotifyPages/Login'
import { MusicContext } from '../Context/PlayerContext'
import { GET, POST } from '../Utils/ApiCall'
import SongList from '../SpotifyPages/SongList'

const Search = () => {

    const { isLoggedIn, setIsLoggedIn, setDisplayName, isPremiumUser, setIsPremiumUser, device, setDeviceId, playSpecific } = useContext(MusicContext);

    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [tracks, setTracks] = useState(null);

    const playerRef = useRef(null);

    useEffect(() => {
        isAuthenticated();
    }, []);

    useEffect(() => {
        const apiCallDelay = setTimeout(() => {
            if (searchText.length >= 3) searchSongs(searchText);
            else setTracks(null);
        }, 1000);
        return () => clearTimeout(apiCallDelay);
    }, [searchText]);

    const isAuthenticated = async () => {
        try {
            const response = await GET('auth/token');
            if (response.result !== null && response.result?.data?.Status == 'Logged In') {
                if (response.result?.data?.DisplayName?.length > 0) {
                    const name = response.result.data.DisplayName.trim();
                    let shortName = name;
                    if (name.length < 3) {
                        shortName = name;
                    } else if (name.includes(' ')) {
                        const parts = name.split(' ').filter(Boolean);
                        if (parts.length >= 2) {
                            shortName = parts[0][0] + parts[1][0];
                        } else {
                            shortName = parts[0][0];
                        }
                    } else {
                        shortName = name[0];
                    }
                    setDisplayName(shortName.toUpperCase());
                    if (response.result?.data?.Premium) {
                        setSDK();
                        setIsPremiumUser(response.result?.data?.Premium)
                    }
                }
                setIsLoggedIn(true);
            } else setIsLoggedIn(false);
        } catch (error) {
            console.error('Error Getting Login Info :', error);
        }
    }

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

    const setSDK = () => {
        window.onSpotifyWebPlaybackSDKReady = async () => {

            const response = await GET('auth/premiumFeature');
            let token = ''
            if (response.result !== null && response.result?.data?.Status == 'Success') {
                token = response.result?.data?.Data
            }

            const player = new window.Spotify.Player({
                name: 'Spotify Clone Web Player',
                getOAuthToken: cb => { cb(token) },
                volume: 0.75
            });

            playerRef.current = player

            player.addListener("ready", ({ device_id }) => {
                setDeviceId(device_id);
                POST('auth/premiumFeature', { deviceId: device_id })
            });

            player.addListener("authentication_error", ({ message }) => {
                console.error("Spotify auth error", message);
            });

            player.addListener("player_state_changed", state => {
                console.log("Player state", state);
            });

            player.connect();
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
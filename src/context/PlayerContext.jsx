import React, { createContext, useEffect, useRef, useState } from 'react'
import { songsData } from '../utils/assets'
import { addLogOutFunc } from '../utils/AuthHandlers';
import { GET, POST } from '../utils/ApiCall';
import Loader from '../Common/Loader';

export const MusicContext = createContext();

const PlayerContext = (props) => {

    const playerRef = useRef(null);
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [loadingCount, setLoadingCount] = useState(0);
    const startLoading = () => setLoadingCount(prev => prev + 1);
    const stopLoading = () => setLoadingCount(prev => Math.max(prev - 1, 0));
    const isLoading = loadingCount > 0;

    const [displayName, setDisplayName] = useState('V');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isPremiumUser, setIsPremiumUser] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState({
        device: "Unknown",
        os: "Unknown",
    });
    const [deviceId, setDeviceId] = useState(null);
    const [isLocal, setIsLocal] = useState(true);

    const [song, setSong] = useState(songsData[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    });

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();

        let device = "Desktop";
        if (/mobile/.test(userAgent)) device = "Mobile";
        else if (/tablet|ipad|playbook|tab/.test(userAgent)) device = "Tablet";

        let os = "Unknown";
        if (/android/.test(userAgent)) os = "Android";
        else if (/iphone|ipad|ipod/.test(userAgent)) os = "iOS";
        else if (/windows/.test(userAgent)) os = "Windows";
        else if (/macintosh|mac os x/.test(userAgent)) os = "MacOS";

        setDeviceInfo({ device, os });
    }, []);

    useEffect(() => {
        isAuthenticated();
    }, []);

    const isAuthenticated = async () => {
        try {
            startLoading();
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
                        setUpSDK();
                        setIsPremiumUser(response.result?.data?.Premium)
                    }
                }
                setIsLoggedIn(true);
            } else setIsLoggedIn(false);
        } catch (error) {
            console.error('Error Getting Login Info :', error);
        } finally {
            stopLoading();
        }
    }

    const setUpSDK = async () => {
        if (window.Spotify) {
            initializePlayer();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = async () => {
            initializePlayer();
        }
    }

    const initializePlayer = async () => {
        startLoading();
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
        stopLoading();
    }

    const logOut = () => {
        setDisplayName('V');
        setIsLoggedIn(false);
        window.location.reload();
    }

    useEffect(() => {
        const removeLogOutFunc = addLogOutFunc(logOut);

        return () => {
            removeLogOutFunc();
        }
    }, []);

    // for song duration and seekbar
    useEffect(() => {
        setTimeout(() => {
            audioRef.current.ontimeupdate = () => {

                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + '%'

                setDuration({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                })
            }
        }, 1000)
    }, [audioRef]);

    const handleTracks = async (action, url) => {
        try {
            startLoading();
            const payload = {
                type: action,
                deviceId: deviceId,
                trackUrl: url ? url : null
            }
            const response = await POST('spotify/handleSong', payload)
            if (response.error == null) {
                if (response.result.data.Status == "Success") {
                    setIsLocal(false);
                    setIsPlaying(action !== 'pause' ? true : false);
                }
            }
        } catch (error) {
            console.error(`Error While ${action}`, error);
        } finally {
            stopLoading();
        }
    }

    // play
    const play = async (type) => {
        if (type === 'premium') {
            await handleTracks('resume');
            return;
        }
        audioRef.current.play()
        setIsPlaying(true);
    }

    // pause
    const pause = async (type) => {
        if (type === 'premium') {
            await handleTracks('pause');
            return;
        }
        audioRef.current.pause()
        setIsPlaying(false);
    }

    // select specific
    const playSpecific = async (id, url) => {
        if (id === 'premium') {
            await handleTracks('play', url);
            return;
        }
        await setSong(songsData[id])
        audioRef.current.play()
        setIsPlaying(true);
    }

    // previous
    const prev = async (id) => {
        if (song.id > 0) {
            await setSong(songsData[id - 1])
            audioRef.current.play()
            setIsPlaying(true);
        }
    }

    // next
    const next = async (id) => {
        if (song.id < songsData.length - 1) {
            await setSong(songsData[id + 1])
            audioRef.current.play()
            setIsPlaying(true);
        }
    }

    // seek bar
    const seek = (e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration)
    }

    const { device, os } = deviceInfo;
    const contextValue = {
        audioRef,
        seekBg,
        seekBar,
        displayName, setDisplayName,
        isLoggedIn, setIsLoggedIn,
        isPremiumUser, setIsPremiumUser,
        device, os,
        startLoading, stopLoading,
        isLocal,
        song, setSong,
        isPlaying, setIsPlaying,
        duration, setDuration,
        play, pause, playSpecific,
        prev, next, seek
    }

    return (
        <>
            <MusicContext.Provider value={contextValue}>
                {props.children}
                <Loader isLoading={isLoading} />
            </MusicContext.Provider>
        </>
    )
}

export default PlayerContext
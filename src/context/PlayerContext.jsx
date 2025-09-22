import React, { createContext, useEffect, useRef, useState } from 'react'
import { songsData } from '../utils/assets'
import { addLogOutFunc } from '../utils/AuthHandlers';
import { POST } from '../utils/ApiCall';

export const MusicContext = createContext();

const PlayerContext = (props) => {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

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

    const logOut = () => {
        setDisplayName('V');
        setIsLoggedIn(false);
        window.location.reload();
    }

    useEffect(() => {
        addLogOutFunc(logOut);
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
            const payload = {
                type: action,
                deviceId: deviceId,
                trackUrl: url ? url : null
            }
            const response = await POST('spotify/handleSong', payload)
            if (response.error == null) {
                setIsLocal(false);
                setIsPlaying(action == 'play' ? true : false);
            }
        } catch (error) {
            console.error(`Error While ${action}`, error);
        }
    }

    // play
    const play = (type) => {
        if (type === 'premium') {
            handleTracks('play');
            return;
        }
        audioRef.current.play()
        setIsPlaying(true)
    }

    // pause
    const pause = (type) => {
        if (type === 'premium') {
            handleTracks('pause');
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
        deviceId, setDeviceId,
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
            </MusicContext.Provider>
        </>
    )
}

export default PlayerContext
import React, { useContext, useMemo, useState } from 'react'
import Nav from '../Common/Nav'
import { assets } from '../utils/assets'
import { useLocation, useParams } from 'react-router-dom'
import { formatSongDuration } from '../utils/Functions'
import { MusicContext } from '../context/PlayerContext'

const LibraryView = () => {

    const { str } = useParams();
    const url = useLocation();
    const { data } = url.state || {};

    const { isPremiumUser, playSpecific } = useContext(MusicContext)

    const bgColor = `linear-gradient(#124D33, #121212)`

    const totalDuration = useMemo(() => {
        const durations = data.songs.map(song => song.duration);
        const total = durations.reduce((acc, curr) => acc + curr, 0);
        return formatSongDuration(total);
    }, [data.songs]);

    return (
        <div className='px-6 pt-4 scroll-smooth' style={{ background: bgColor }}>
            <Nav />
            <div className='mt-10 flex gap-8 flex-col items-center sm:flex-row md:items-end'>
                <img
                    className='w-36 sm:w-40 rounded cursor-pointer'
                    src={data.image}
                    onClick={() => window.open(data.link, "_blank")}
                />
                <div className='flex flex-col items-start'>
                    <p>Album</p>
                    <h2 className='text-2xl w-auto mx-auto font-bold mb-4 md:text-4xl'>{data.name}</h2>
                    <h4 className=''>{data.artist.join(', ')}</h4>
                    <p className='mt-1 hidden sm:block'>
                        <img className='w-5 inline-block -mt-1' src={assets.spotify_logo} />
                        &nbsp;<b>Spotify</b>
                        &nbsp;&#8226; <b>{data.songs.length} Songs,</b>
                        &nbsp;&#8226; {totalDuration}
                    </p>
                </div>
            </div>

            <div className='flex items-center mt-10 mb-4 pl-2 text-[#a7a7a7]'>
                <p className='w-1/12'>#</p>
                <p className='w-10/12'>Title</p>
                <div className='w-1/12'>
                    <img className='w-4' src={assets.clock_icon} />
                </div>
            </div>
            <hr />

            {data.songs.map((song, index) => {
                return (
                    <div key={index}
                        onClick={() => isPremiumUser ? playSpecific('premium', song.play) : window.open(song.url, "_blank")}
                        className='songDiv flex p-2 my-2 items-center text-[#B3B3B3] hover:bg-[#ffffff2b] rounded cursor-pointer'
                    >
                        <p className='w-1/12'>{index + 1}</p>
                        <div className='w-10/12 pr-3 flex items-center overflow-hidden'>
                            {/* <img className='inline mr-5 w-10 rounded' src={data.image} /> */}
                            <div className='w-full overflow-hidden'>
                                <p className='text-white'>{song.name}</p>
                                <p className='marquee-text'>{song.artists.join(', ')}</p>
                            </div>
                        </div>
                        <p className='w-1/12'>{formatSongDuration(song.duration)}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default LibraryView
import React from 'react'
import InfiniteScroll from '../Common/InfiniteScroll'
import './SongListStyle.css'
import { assets } from '../utils/assets'

const SongList = ({ tracks, isPremiumUser, device, playSpecific }) => {
    return (
        <div className='my-3 overflow-y-auto scroll-smooth' style={{ maxHeight: device == 'Mobile' ? '620px' : '450px' }}>

            {tracks.map((track, index) => (
                <div className="songDiv p-2 group relative flex items-center rounded hover:bg-[#242424]" key={`${index}_${track.id}`}>
                    <img alt={track.title}
                        className='mr-3 w-12 sm:w-16'
                        src={track.album.image[0].url}
                        href={track.link}
                    />
                    <div className='w-full overflow-hidden'>
                        <h4 className='text-sm sm:text-base'>
                            {track.title}
                        </h4>
                        <p className='marquee-text text-sm'>
                            {track.artists.map(a => a.artistName).join(", ")} — {track.album.albumName}
                        </p>
                        {track.preview && (
                            <audio controls src={track.preview}></audio>
                        )}
                    </div>
                    <div className='flex absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                        {isPremiumUser ?
                            <a onClick={() => playSpecific('premium', track.play)} href={track.link} target="_blank" className='p-2 bg-[#1ED760] rounded-full ml-3'>
                                <img src={assets.premiumPlay} style={{ width: '30px' }} />
                            </a>
                            :
                            <a href={track.link} target="_blank" className='p-2 bg-[#1ED760] rounded-full'>
                                <img src={assets.loginSpotifyBlack} style={{ width: '30px' }} />
                            </a>
                        }
                    </div>
                </div>
            ))}

            {/* <InfiniteScroll
                containerHeight={device == 'Mobile' ? 630 : 450}
                items={tracks}
                itemHeight={78}
                render={(track, index) => (
                    
                )}
            /> */}
        </div>
    )
}

export default SongList
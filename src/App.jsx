import React, { useContext, useEffect, useRef  } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import SideBar from './SideBar/SideBar'
import DisplayHome from './Pages/DisplayHome'
import AlbumView from './Pages/AlbumView'
import Search from './Pages/Search'
import { albumsData } from './utils/Assets'
import Music from './Pages/Music'
import Podcasts from './Pages/Podcasts'
import MusicPlayer from './Player/MusicPlayer'
import { MusicContext } from './context/PlayerContext'
import LibraryView from './SpotifyPages/LibraryView'

const App = () => {

    const { audioRef, song } = useContext(MusicContext);

    const displayRef = useRef();
    const location = useLocation();
    const isAlbum = location.pathname.includes('album');
    const albumId = isAlbum ? location.pathname.split('/').pop() : '';
    const bgColor = albumsData[Number(albumId)].bgColor;

    useEffect(() => {
        if (isAlbum) {
            displayRef.current.style.background = `linear-gradient(${bgColor},#121212)`;
        } else {
            displayRef.current.style.background = 'linear-gradient(#202020, #121212)'; // #202020 - black, #121212 - dark black
        }
    }, []);

    return (
        <div className="h-screen bg-black">
            <div className='h-[90%] flex'>
                <SideBar />
                <div ref={displayRef} className='w-[100%] m-2 rounded-xl text-white overflow-auto lg:w-[75%] lg:ml-0'>
                    <Routes>
                        <Route path='/' element={<DisplayHome />} />
                        <Route path='/album/:id' element={<AlbumView />} />
                        <Route path='/library/:str' element={<LibraryView />} />
                        <Route path='/search' element={<Search />} />
                        <Route path='/music' element={<Music />} />
                        <Route path='/podcasts' element={<Podcasts />} />
                    </Routes>
                </div>
            </div>
            <MusicPlayer />
            <audio ref={audioRef} src={song.file} preload='auto'></audio>
        </div>
    )
}

export default App
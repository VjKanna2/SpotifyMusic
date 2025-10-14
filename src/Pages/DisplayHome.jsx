import React, { useContext, useEffect, useState } from 'react'
import Nav from '../Common/Nav'
import { albumsData, songsData } from '../utils/assets'
import Albums from '../Common/Albums'
import Songs from '../Common/Songs'
import Nav2 from '../Common/Nav2'
import { GET } from '../utils/ApiCall'
import { MusicContext } from '../context/PlayerContext'
import Library from '../SpotifyPages/Library'

const DisplayHome = () => {

    const { isLoggedIn, startLoading, stopLoading } = useContext(MusicContext);
    const [library, setLibrary] = useState([]);

    useEffect(() => {
        if (isLoggedIn) getAlbums();
    }, [isLoggedIn]);

    const getAlbums = async () => {
        try {
            startLoading();
            const response = await GET('spotify/get/albums');
            if (response.result !== null && response.result?.data?.Status == "Success") {
                setLibrary(response.result?.data?.Data);
            }
        } catch (error) {
            console.error('Error Getting Albums :', error)
        } finally {
            stopLoading();
        }
    }

    return (
        <div className='px-6 pt-4'>
            <Nav />
            <Nav2 />
            {isLoggedIn &&
                <div className='mb-4'>
                    <h1 className='my-5 font-bold text-2xl hover:underline cursor-pointer'>Library</h1>
                    <div className="flex overflow-auto scrollbar-none">
                        {library.length > 0 ? library.map((item, index) => {
                            return <Library
                                key={index}
                                id={item.id}
                                image={item.image}
                                name={item.name}
                                data={item}
                            />
                        }) : <p><i>Empty</i></p>}
                    </div>
                </div>
            }
            <div className='mb-4'>
                <h1 className='my-5 font-bold text-2xl hover:underline cursor-pointer'>Featured Charts</h1>
                <div className="flex overflow-auto scrollbar-none">
                    {albumsData.map((item, index) => {
                        return <Albums
                            key={index}
                            id={item.id}
                            name={item.name}
                            desc={item.desc}
                            image={item.image}
                        />
                    })}
                </div>
            </div>
            <div className='mb-4'>
                <h1 className='my-5 font-bold text-2xl hover:underline cursor-pointer'>Today's hitlist</h1>
                <div className="flex overflow-auto scrollbar-none">
                    {songsData.map((item, index) => {
                        return <Songs
                            key={index}
                            id={item.id}
                            name={item.name}
                            desc={item.desc}
                            image={item.image}
                        />
                    })}
                </div>
            </div>
        </div>
    )
}

export default DisplayHome
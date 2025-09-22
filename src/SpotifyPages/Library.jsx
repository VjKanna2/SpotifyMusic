import React from 'react'
import { useNavigate } from 'react-router-dom'

const Library = ({ id, image, name, data }) => {
    const navigate = useNavigate();
    return (
        <div
            className='max-w-[180px] hover:bg-[#3E3E3E] p-2 px-3 rounded cursor-pointer'
            onClick={() => navigate(`/library/${id}`, { state: { data } })}
        >
            <img className='w-48 rounded' src={image} />
            <p className='font-bold mt-2 mb-1'>{name}</p>
        </div>
    )
}

export default Library
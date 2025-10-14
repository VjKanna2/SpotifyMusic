import React from 'react';
import '../../public/styles/index.css';

const Loader = ({ isLoading }) => {

    if (!isLoading) {
        return null;
    }

    return (
        <div className="loader-overlay">
            <div className="loader"></div>
        </div>
    )
}

export default Loader;
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PlayerContext from './context/PlayerContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import '../public/styles/index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <PlayerContext>
                <App />
            </PlayerContext>
        </BrowserRouter>
    </StrictMode>,
)
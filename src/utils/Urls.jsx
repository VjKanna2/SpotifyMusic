export const BASE_URL = "https://spotifymusic-backend.onrender.com/"
const CLIENT_ID = '1038d92459bb4e88814983e09d77c538'
const REDIRECT_URI = 'https://spotifymusic-backend.onrender.com/auth/callback'
const SCOPES = 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state'
export const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}`

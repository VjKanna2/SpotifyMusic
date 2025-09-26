export const BASE_URL = "https://spotifymusic-backend.onrender.com/"
const CLIENT_ID = 'c1b49c24e40a4bfaba47f56334e35069'
const SCOPES = 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state'
export const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${BASE_URL}auth/callback&scope=${SCOPES}`

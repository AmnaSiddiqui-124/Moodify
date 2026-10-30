import { getSong } from '../services/songs.api'
import { useContext, useState } from 'react'
import { songContext } from '../Song.context'

export const useSong = () => {
    const context = useContext(songContext)

    const { loading, setLoading, song, setSong } = context
    const [error, setError] = useState('')

    async function handleGetSong({mood}) {
        setError('')
        setLoading(true)
        try {
            const data = await getSong({ mood })
            if (!data?.song) {
                throw new Error('No track was found for this mood. Please try again.')
            }
            setSong(data.song)
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : 'Could not load a track. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }
    return { loading, song, error, handleGetSong }
}

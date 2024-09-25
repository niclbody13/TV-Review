import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as filledStar } from '@fortawesome/free-solid-svg-icons'

import noImage from "../assets/no-image.jpg"
import ErrorContainer from '../components/ErrorContainer'
import Spinner from '../components/Spinner'

const PORT = import.meta.env.VITE_PORT
/*
 * handle deleting by clearing the stars and fetching delete endpoint
 * handle submit logic with patch and post  
 * 
 * 

*/

const showStyles = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .showWrapper {
        margin: 0 8rem;
    }

    .showWrapper h1 {
        font-size: 2.25rem;
        margin-bottom: 0;
    }

    .description {
        font-size: 1.35rem;
    }

    #runtime {
        font-size: 1.15rem;
        margin-top: 0;
    }

    img {
      box-shadow: 0 4px 8px 0 black;
    }

    .mainInfo {
        display: flex;
        gap: 4rem;
        align-items: center;
        flex-direction: row;
    }
`

const seasonsStyles = css`
    ul {
        display: flex;
        gap: 1rem;
        overflow-x: scroll;
        width: 85rem;
        list-style: none;
    }

    p {
        font-size: 1.15rem;
        margin: 0.5rem 0;
    }
`

const ratingStyles = css`
    h1 {
       margin-bottom: 1rem !important;
    }

    .starContainer {
        display: flex;
        gap: 0.25rem;
    }

    .star {
        cursor: pointer;
    }

    button {
        margin: 1rem 0;
        margin-right: 1rem;
    }
`

function ShowPage() {
    const [showData, setShowData] = useState(null)
    const [seasonsData, setSeasonsData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [rating, setRating] = useState(0)
    const [isRated, setIsRated] = useState(false)
    let { id } = useParams()

    useEffect(() => {
        const controller = new AbortController()    // used to cancel fetch request

        /* This async function will be used to fetch information about a specific show */
        async function fetchShows() {
            setLoading(true)
            try {
                const response = await fetch(
                    `https://api.tvmaze.com/shows/${id}`,
                    { signal: controller.signal }
                )
                if (!response.ok) {
                    throw new Error('Failed to fetch data')
                }
                const responseBody = await response.json()
                console.log(responseBody)
                setError(null)
                setShowData(responseBody)
            } catch (e) {
                if (e.name === "AbortError") {
                    console.log("HTTP request was aborted")
                } else {
                    console.error("An error has occured: ", e)
                    setError(e)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchShows()

        return () => controller.abort()
    }, [id])

    useEffect(() => {
        if (!showData) return
        const controller = new AbortController()
        async function fetchSeasons() {
            setLoading(true)
            try {
                const response = await fetch(`https://api.tvmaze.com/shows/${id}/seasons`, {
                    signal: controller.signal,
                })
                if (!response.ok) throw new Error('Failed to fetch data')
                const seasonsResponse = await response.json()
                setSeasonsData(seasonsResponse)
                setError(null)
            } catch (e) {
                if (e.name === "AbortError") {
                    console.log("HTTP request was aborted")
                } else {
                    console.error("An error has occurred: ", e)
                    setError(e)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchSeasons()

        return () => controller.abort()
    }, [showData, id])

    useEffect(() => {
        async function fetchUserRating() {
            const userId = 1    // set userId to 1 until login is implemented
            try {
                const response = await fetch(`http://localhost:${PORT}/ratings/${userId}/${id}`)
                if (!response.ok) {
                    const errorData = await response.json()
                    throw errorData
                }
                const ratingData = await response.json()
                setRating(ratingData.rating || 0)
                setIsRated(!!ratingData.rating)
            } catch (e) {
                console.error('Failed to fetch rating: ', e)
            }
        }

        fetchUserRating()
    }, [id])    //may need to add userId here once there are multiple users

    function formatDate(date) {
        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
    }

    const seasons = seasonsData.filter(season => season.premiereDate)

    async function rateShow(showId, rating) {
        const userId = 1    // set userId to 1 until login is implemented
        console.log("Rating: ", rating)
        try {
            const method = isRated ? 'PATCH' : 'POST'
            const response = await fetch(`http://localhost:${PORT}/${isRated ? 'updateRating' : 'rateShow'}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, showId, rating })
            })
            if (!response.ok) {
                const errorData = await response.json()
                throw errorData
            }
            setError(null)
            setIsRated(true)
            alert('Rating saved!')
        } catch (e) {
            console.error("An error has occurred: ", e)
            setError(e.error || 'Failed to rate show')
        }
    }

    async function deleteRating(showId) {
        const userId = 1    // set userId to 1 until login is implemented
        try {
            const response = await fetch(`http://localhost:${PORT}/deleteRating/${userId}/${showId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })
            if (!response.ok) {
                const errorData = await response.json()
                throw errorData
            }
            setError(null)
            setRating(0)
            setIsRated(false)
            alert('Rating deleted!')
        } catch (e) {
            if (e.name === "AbortError") {
                console.log("HTTP request was aborted")
            } else {
                console.error("An error has occurred: ", e)
                setError(e.error || 'Failed to delete rating')
            }
        }
    }

    const toggleStar = (index) => {
        console.log("star clicked: ", index)
        console.log("Port: ", PORT)
        if (index === 0 && rating === 1) {
            setRating(0)
            return
        }
        setRating(index + 1)
    }

    // post and patch will both come from submit button you can tell which it is by seeing if there was already an existing rating by checking if the stars are filled or not

    return (
        <div css={showStyles}>
            {error && <ErrorContainer>Error: {error}</ErrorContainer>}
            {loading && <Spinner />}
            {showData && (
                <div className='showWrapper'>
                    <div className='mainInfo'>
                        <div>
                            <h1>{showData.name}</h1>
                            {seasons.length > 0 && (
                                <div css={seasonsStyles}>
                                    <p>{seasons.length} Seasons</p>
                                    {/* <ul>
                                    {seasons.map(season => (
                                        <li key={season.id}>
                                            <h3>Season {season.number}</h3>
                                            <p>Premiere: {formatDate(season.premiereDate)}</p>
                                            <p>End: {formatDate(season.endDate) || '-'}</p>
                                        </li>
                                    ))}
                                </ul> */}
                                </div>
                            )}
                            <p id='runtime'>({showData.premiered.split('-')[0]} - {showData.ended ? showData.ended.split('-')[0] : ''})</p>
                            {showData.image && (
                                <img src={showData.image.medium} alt={`Poster for ${showData.name}`} />
                            )}
                        </div>
                        <div css={ratingStyles}>
                            {isRated ?
                                <h1>You've rated this show</h1> :
                                <h1>Rate this show</h1>
                            }
                            <div className='starContainer'>
                                {[...Array(5)].map((_, index) => (
                                    <FontAwesomeIcon
                                        key={index}
                                        onClick={() => toggleStar(index)}
                                        className='star'
                                        icon={index < rating ? filledStar : emptyStar}
                                        size='2xl'
                                    />
                                ))}
                            </div>
                            <button onClick={() => rateShow(showData.id, rating)}>Submit Rating</button>
                            <button onClick={() => deleteRating(showData.id)}>Delete Rating</button>
                        </div>
                    </div>
                    <p className='description' dangerouslySetInnerHTML={{ __html: showData.summary }} />
                </div>
            )}
        </div>
    )
}

export default ShowPage
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as filledStar } from '@fortawesome/free-solid-svg-icons'
import { faStarHalfStroke as halfStar } from '@fortawesome/free-regular-svg-icons'
import { Amplify } from 'aws-amplify'
import outputs from '../../amplify_outputs.json'
import { fetchUserAttributes } from 'aws-amplify/auth'

import noImage from "../assets/no-image.jpg"
import ErrorContainer from '../components/ErrorContainer'
import Spinner from '../components/Spinner'

Amplify.configure(outputs)

const PORT = import.meta.env.VITE_PORT
const HOST = import.meta.env.VITE_HOST || 'localhost'

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

    @media(max-width: 760px) {
        .showWrapper {
            margin: 0 1rem;
        }
        
        .showWrapper h1 {
            font-size: 1.25rem;
            margin: 0.25rem 0;
        }

        .mainInfo {
            gap: 1rem;
        }

        .mainInfo p {
            font-size: 1rem;
            margin: 0.25rem;
        }

        #runtime {
            font-size: 1rem;
        }
        
        .description {
            font-size: 1rem;
        }
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

    @media(max-width: 760px) {
        .star {
            font-size: 1.25rem;
        }

        .starContainer {
            margin: 0.5rem;
        }

        button {
            margin: 0.75rem;
        }
    }
`

function ShowPage() {
    const [showData, setShowData] = useState(null)
    const [isShowDataReady, setIsShowDataReady] = useState(false)
    const [seasonsData, setSeasonsData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [isRated, setIsRated] = useState(false)
    let { id } = useParams()
    const [userId, setUserId] = useState(null)
    const [isUserIdReady, setIsUserIdReady] = useState(false)

    useEffect(() => {
        const getUserId = async () => {
            try {
                const attributes = await fetchUserAttributes();
                setUserId(attributes.sub)
                setIsUserIdReady(true)
            } catch (error) {
                console.error("Error fetching user attributes:", error);
            }
        };
        getUserId();
    }, []);

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
                setIsShowDataReady(true)
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
        if (!isShowDataReady) return
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
    }, [isShowDataReady, id])

    useEffect(() => {
        if (!isUserIdReady || !isShowDataReady) return
        async function fetchUserRating() {
            // const userId = 1    // set userId to 1 until login is implemented
            try {
                const response = await fetch(`${import.meta.env.VITE_AWS_GATEWAY_URL}/ratings/${userId}/${id}`)
                if (!response.ok) {
                    const errorData = await response.json()
                    throw errorData
                }
                const ratingData = await response.json()
                setRating(ratingData.body.rating || 0)
                setIsRated(!!ratingData.body.rating)
            } catch (e) {
                console.error('Failed to fetch rating: ', e)
            }
        }

        fetchUserRating()
    }, [userId, isUserIdReady, isShowDataReady, id])    //may need to add userId here once there are multiple users

    function formatDate(date) {
        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
    }

    const seasons = seasonsData.filter(season => season.premiereDate)

    async function rateShow(showId, showName, showImage, rating) {
        // const userId = 1    // set userId to 1 until login is implemented
        console.log("Rating: ", rating)
        try {
            const method = 'POST'
            const response = await fetch(`${import.meta.env.VITE_AWS_GATEWAY_URL}/ratings`, {
                method,
                body: JSON.stringify({ userId: userId, showId, showName, showImage, rating })
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
        // const userId = 1    // set userId to 1 until login is implemented
        try {
            const response = await fetch(`${import.meta.env.VITE_AWS_GATEWAY_URL}/ratings/${userId}/${showId}`, {
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

    const toggleStar = (index, e) => {
        if (index === 0 && rating === 1) {
            setRating(0)
            return
        }

        const starWidth = document.querySelector('.star').getBoundingClientRect().width
        const clickPos = e.nativeEvent.offsetX
        const finalRating = clickPos < starWidth / 2 ? index + 0.5 : index + 1 // Check for half-star condition

        // Check if the clicked position is in the left half of the star
        if (hoverRating % 1 !== 0 && (hoverRating % 1) >= 0.5) {
            setRating(Math.floor(hoverRating) + 0.5)
        } else {
            // Full star logic
            console.log('finalrating: ', finalRating)
            setRating(finalRating)
        }
    }

    const handleStarHover = (index, e) => {
        if (index + 0.5 < rating) {
            return
        }
        const star = e.currentTarget
        const starWidth = star.getBoundingClientRect().width
        const clickPos = e.nativeEvent.offsetX
        if (clickPos < starWidth / 2) {
            setHoverRating(index + 0.5)
        } else {
            setHoverRating(index + 1)
        }
    }

    const resetStarHover = () => {
        console.log("reset hover")
        setHoverRating(0)
    }

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
                            {showData.premiered ? (<p id='runtime'>({showData.premiered.split('-')[0]} - {showData.ended ? showData.ended.split('-')[0] : ''})</p>) : null}
                            {showData.image && (
                                <img src={showData.image.medium} alt={`Poster for ${showData.name}`} />
                            )}
                        </div>
                        <div css={ratingStyles}>
                            {isRated ?
                                <h1>You've rated this show</h1> :
                                <h1>Rate this show</h1>
                            }
                            <div className='starContainer' onMouseLeave={resetStarHover}>
                                {[...Array(5)].map((_, index) => {
                                    const isFilled = hoverRating > 0 && index < Math.floor(hoverRating)
                                    const isHalf = hoverRating > 0 && index === Math.floor(hoverRating) && (hoverRating % 1 !== 0)
                                    const isFinalFilled = rating > 0 && index < Math.floor(rating)
                                    const isFinalHalf = rating > 0 && index === Math.floor(rating) && (rating % 1 !== 0)
                                    const icon = hoverRating > 0
                                        ? (isFilled ? filledStar : (isHalf ? halfStar : emptyStar))
                                        : (isFinalFilled ? filledStar : (isFinalHalf ? halfStar : emptyStar))

                                    // console.log("isFilled: ", isFilled)

                                    return (
                                        <FontAwesomeIcon
                                            key={index}
                                            onClick={(e) => toggleStar(index, e)}
                                            onMouseMove={(e) => handleStarHover(index, e)}
                                            className='star'
                                            icon={icon}
                                            size='2xl'
                                        />
                                    )
                                })}
                            </div>
                            <button onClick={() => rateShow(showData.id, showData.name, showData.image.medium, rating)}>Submit Rating</button>
                            {/* <button onClick={() => rateShow(showData.id, rating)}>Submit Rating</button> */}
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
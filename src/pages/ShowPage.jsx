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
import StarRating from '../components/StarRating'
import noImage from "../assets/no-image.jpg"
import ErrorContainer from '../components/ErrorContainer'
import Spinner from '../components/Spinner'

Amplify.configure(outputs)

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
        /* margin-top: 0; */
    }

    img {
      box-shadow: 0 4px 8px 0 black;
    }

    .mainInfo {
        display: flex;
        gap: 4rem;
        align-items: end;
        /* align-items: center; */
        flex-direction: row;
    }

    @media(max-width: 760px) {
        .showWrapper {
            margin: 1rem;
        }
        
        .showWrapper h1 {
            font-size: 1.3rem;
            margin: 0;
            /* white-space: nowrap; */
            /* overflow: none; */
        }

        .mainInfo {
            gap: 1rem;
            position: relative;
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

    @media(max-width: 480px) {
        .showWrapper {
            /* margin-left: 0; */
            /* margin-right: 0; */
        }

        .showWrapper h1 {
            /* font-size: 1rem; */
        }  
        img {
            height: 14rem;
        }
    }
`

const seasonsStyles = css`
    display: flex;
    flex-direction: row-reverse;
    justify-content: start;
    align-items: center;
    white-space: nowrap;

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
    margin-bottom: 4rem;

    .buttonContainer {
        display: flex;
        gap: 0;
    }

    h1 {
       margin-bottom: 1rem !important;
       font-size: 2rem !important;
    }

    .starContainer {
        display: flex;
        gap: 0.25rem;
        margin-bottom: 1rem;
    }

    .star {
        cursor: pointer;
        font-size: 2.5rem;
        color: #d73f09
    }

    button {
        margin: 0.75rem;
        cursor: pointer;
        color: white;
        background-color: #095109;
        box-shadow: 0 2px 4px 0 #111;
        border-radius: 15px;
        border: 1px solid black;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }

    #delete {
        background-color: #7f0404;
    }

    .MuiRating-iconEmpty {
        color: #111;
    }

    @media(max-width: 760px) {
        .star {
            font-size: 2.25rem;
        }

        .starContainer {
            /* margin: 0.5rem; */
        }
    }

    @media (max-width: 480px) {
        .buttonContainer {
            gap: 0;
        }

        button {
            width: 5rem;
            font-size: 0.9rem;
            color: white;
            margin: 0.25rem;
            border-radius: 15px;
            border: 1px solid black;
            padding: 0.25rem 0;
        }
        
        h1 {
            font-size: 1rem !important;
        }

        .star {
            font-size: 2.25rem;
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
    const [hasShowEnded, setHasShowEnded] = useState(false)

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
                setHasShowEnded(responseBody.ended)
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
            setLoading(true)
            try {
                const response = await fetch(`${import.meta.env.VITE_AWS_GATEWAY_URL}/ratings/${userId}/${id}`)
                if (!response.ok) {
                    const errorData = await response.json()
                    throw errorData
                }
                const ratingData = await response.json()
                console.log("rating:", ratingData.body.rating)
                setRating(ratingData.body.rating || 0)
                setIsRated(!!ratingData.body.rating)
            } catch (e) {
                console.error('Failed to fetch rating: ', e)
            } finally {
                setLoading(false)
            }
        }

        fetchUserRating()
    }, [userId, isUserIdReady, isShowDataReady, id])    //may need to add userId here once there are multiple users

    function formatDate(date) {
        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
    }

    const seasons = seasonsData.filter(season => parseInt(season.premiereDate))

    async function rateShow(showId, showName, showImage, rating) {
        // const userId = 1    // set userId to 1 until login is implemented
        console.log("Rating: ", rating)
        setLoading(true)
        try {
            const method = isRated ? 'PATCH' : 'POST'
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
        } finally {
            setLoading(false)
        }
    }

    async function deleteRating(showId) {
        // const userId = 1    // set userId to 1 until login is implemented
        setLoading(true)
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
        } finally {
            setLoading(false)
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
            {/* {error && <ErrorContainer>Error: {error}</ErrorContainer>} */}
            {/* {loading && <Spinner />} */}
            {loading ? (<div css={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}>
                <Spinner />
            </div>) : (
                <div>
                    {error && <ErrorContainer>Error: {error}</ErrorContainer>}
                    {showData && (
                        <div className='showWrapper'>
                            {/* <div className='mainInfo'> */}
                            <h1>{showData.name}</h1>
                            <div className='mainInfo' style={{ gap: hasShowEnded ? '0' : '1rem' }}>
                                <div>
                                    {seasons.length > 0 && (
                                        <div css={seasonsStyles}>
                                            <p>{seasons.length} {seasons.length === 1 ? 'Season' : 'Seasons'}</p>
                                            {showData.premiered && (
                                                <p id="runtime">
                                                    ({showData.premiered.split('-')[0]} - {showData.ended ? showData.ended.split('-')[0] : ''})
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {showData.image && (
                                        <img src={showData.image.medium} alt={`Poster for ${showData.name}`} />
                                    )}
                                </div>
                                <div className='ratingInput' css={ratingStyles}>
                                    {isRated ?
                                        <h1>You've rated this show</h1> :
                                        <h1>Rate this show</h1>
                                    }
                                    <div className='starContainer' onMouseLeave={resetStarHover}>
                                        <StarRating className='star' value={rating} onChange={(newValue) => {
                                            setRating(newValue)
                                        }} />
                                    </div>
                                    <div className='buttonContainer'>
                                        <button id='delete' onClick={() => deleteRating(showData.id)}>Delete</button>
                                        <button onClick={() => rateShow(showData.id, showData.name, showData.image.medium, rating)}>Submit</button>
                                    </div>
                                </div>
                            </div>
                            <p className='description' dangerouslySetInnerHTML={{ __html: showData.summary }} />
                        </div>
                    )}
                </div>
            )}


        </div>
    )
}

export default ShowPage
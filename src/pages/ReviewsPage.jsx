import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as filledStar } from '@fortawesome/free-solid-svg-icons'
import { faStarHalfStroke as halfStar } from '@fortawesome/free-regular-svg-icons'
import { Amplify } from 'aws-amplify'
import outputs from '../../amplify_outputs.json'
import { fetchUserAttributes } from 'aws-amplify/auth'

import ErrorContainer from '../components/ErrorContainer'
import Spinner from '../components/Spinner'
import noImage from "../assets/no-image.jpg"

Amplify.configure(outputs)

const reviewsPageStyles = css`
    text-align: center;

    ul {
        list-style: none;
        padding: 0;
        margin: 2rem;
        display: grid;
        gap: 1em;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }

    li {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
    }

    li p {
        text-align: center;
        color: white;
        font-size: 1.15rem;
        margin: 0;
    }

    li img{
        border-radius: 10px;
        box-shadow: 0 4px 8px 0 #222;
        cursor: pointer;
    }

    .starContainer {
        display: flex;
        gap: 0.25rem;
        justify-content: center;
    }

    .star {
        font-size: 1rem;
    }

    @media(max-width: 760px) {
        ul {
            margin: 1rem 1rem;
            grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
        }

        li img {
            width: 8rem;
        }
    }
    
    @media(max-width: 480px) {
        ul {
            /* grid-template-columns: repeat(2, minmax(0, 1fr)); */
            grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        li img {
            width: 5rem;
        }

        .star {
            font-size: 0.65rem;
        }
    }
`

function ReviewsPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [reviews, setReviews] = useState([])
    const navigate = useNavigate()
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
        if (!isUserIdReady) return

        async function getReviews() {
            setLoading(true)
            try {
                const response = await fetch(`${import.meta.env.VITE_AWS_GATEWAY_URL}/ratings/${userId}`)
                if (!response.ok) {
                    const errorData = await response.json()
                    throw errorData
                }
                const reviewsData = await response.json()
                setError(null)
                setReviews(reviewsData.body || [])
            } catch (e) {
                console.error('Failed to fetch reviews: ', e)
                setError(e.message || 'Failed to fetch reviews')
            } finally {
                setLoading(false)
            }
        }

        getReviews()
    }, [userId, isUserIdReady])

    return (
        <div css={reviewsPageStyles}>
            {error && <ErrorContainer>Error: {error}</ErrorContainer>}
            {loading && (<div css={{
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
            </div>)}
            {reviews && (
                <ul>
                    {reviews.map(review => (
                        <li key={review.showId}>
                            {review.showImage ?
                                (<img
                                    src={review.showImage}
                                    alt={`Poster for ${review.name}`}
                                    onClick={() => navigate(`/shows/${review.showId}`)} />) :
                                (
                                    <img
                                        className="noImage"
                                        src={noImage}
                                        alt="No image available"
                                        onClick={() => navigate(`/shows/${review.showId}`)}
                                    />
                                )}
                            <div className='starContainer'>
                                {[...Array(5)].map((_, index) => {
                                    let icon
                                    if (review.rating >= index + 1) {
                                        icon = filledStar
                                    } else if (review.rating > index && review.rating < index + 1) {
                                        icon = halfStar
                                    } else {
                                        icon = emptyStar
                                    }

                                    return (
                                        <FontAwesomeIcon
                                            key={index}
                                            className='star'
                                            icon={icon}
                                            size='2xl'
                                        />
                                    )
                                })}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default ReviewsPage
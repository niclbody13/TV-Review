import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import ErrorContainer from '../components/ErrorContainer'
import Spinner from '../components/Spinner'

const PORT = import.meta.env.VITE_PORT
const userId = 1    // set to 1 until login is implemented

const reviewsPageStyles = css`
    text-align: center;

    li {
        list-style: none;
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
`

function ReviewsPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [reviews, setReviews] = useState([])
    useEffect(() => {
        async function getReviews() {
            setLoading(true)
            try {
                const response = await fetch(`http://localhost:${PORT}/ratings/${userId}`)
                if (!response.ok) {
                    const errorData = await response.json()
                    throw errorData
                }
                const reviewsData = await response.json()
                setError(null)
                setReviews(reviewsData || [])
            } catch (e) {
                console.error('Failed to fetch reviews: ', e)
                setError(e.message || 'Failed to fetch reviews')
            } finally {
                setLoading(false)
            }
        }

        getReviews()
    }, [])

    return (
        <div css={reviewsPageStyles}>
            {error && <ErrorContainer>Error: {error}</ErrorContainer>}
            {loading && <Spinner />}
            {reviews && (
                <ul>
                    {reviews.map(review => (
                        <li key={review.showId}>
                            <p>
                                <strong>Show: </strong>
                                {review.showId}
                            </p>
                            <p>
                                <strong>Rating: </strong>
                                {review.rating}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default ReviewsPage
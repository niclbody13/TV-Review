import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import noImage from "../assets/no-image.jpg"
import ErrorContainer from '../components/ErrorContainer'
import Spinner from '../components/Spinner'

const showStyles = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .showWrapper {
        margin: 0 8rem;
    }

    .showWrapper h1 {
        font-size: 2.5rem;
        margin-bottom: 0;
    }

    .showWrapper p {
        font-size: 1.35rem;
    }

    #runtime {
        font-size: 1.15rem;
        margin-top: 0;
    }
`

function ShowPage() {
    const [showData, setShowData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
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
                    throw new Error('Failed to fetch data');
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

    return (
        <div css={showStyles}>
            {error && <ErrorContainer>Error: {error.message}</ErrorContainer>}
            {loading && <Spinner />}
            {showData && (
                <div className='showWrapper'>
                    <h1>{showData.name}</h1>
                    <p id='runtime'>({showData.premiered.split('-')[0]} - {showData.ended ? showData.ended.split('-')[0] : ''})</p>
                    {showData.image && (
                        <img src={showData.image.medium} alt={`Poster for ${showData.name}`} />
                    )}
                    <p dangerouslySetInnerHTML={{ __html: showData.summary }} />
                </div>
            )}
        </div>
    )
}

export default ShowPage
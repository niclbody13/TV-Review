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

function ShowPage() {
    const [showData, setShowData] = useState(null)
    const [seasonsData, setSeasonsData] = useState([])
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

    function formatDate(date) {
        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
    }

    const seasons = seasonsData.filter(season => season.premiereDate)

    return (
        <div css={showStyles}>
            {error && <ErrorContainer>Error: {error.message}</ErrorContainer>}
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
                    </div>
                    <p className='description' dangerouslySetInnerHTML={{ __html: showData.summary }} />
                </div>
            )}
        </div>
    )
}

export default ShowPage
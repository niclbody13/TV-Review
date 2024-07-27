import { css } from '@emotion/react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import logo from "../assets/television.svg"
import noImage from "../assets/no-image.jpg"
import ErrorContainer from '../components/ErrorContainer'
import Spinner from '../components/Spinner'

const homePageStyles = css`
    .App {
        text-align: center;
    }

    .App-logo {
        height: 40vmin;
        pointer-events: none;
    }

    @media (prefers-reduced-motion: no-preference) {
        .App-logo {
        animation: App-logo-spin infinite 10s linear;
        }
    }

    .App-header {
        background-color: #282c34;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: calc(10px + 2vmin);
        color: white;
    }

    .App-link {
        color: #61dafb;
    }

    @keyframes App-logo-spin {
        from {
        transform: rotateY(0deg);
        }
        to {
        transform: rotateY(360deg);
        }
    }

    form {
        display: flex;
        justify-content: center;
        gap: 1em;
        margin: 2rem;
    }

    input {
        width: 24rem;
        border-radius: 15px;
        border: none;
        height: 2rem;
        font-size: 1.25rem;
        padding: 0 1rem;
    }

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
        gap: 0.25rem;
    }

    li a {
        text-align: center;
        color: white;
        font-size: 1.15rem;
    }

    @media (max-width: 480px) {
        ul {
            grid-template-columns: repeat(2, 1fr);
            margin: 0;
            gap: 0;
            justify-content: center;
        }
        
        li {
            scale: 0.75;
        }

        li a {
            font-size: 1.5rem;
        }
    }
`

function HomePage() {
    const [ searchParams, setSearchParams ] = useSearchParams()
    const query = searchParams.get("q")
    const [ inputQuery, setInputQuery ] = useState(query || "")
    const [ shows, setShows ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(null)

    useEffect(() => {
        const controller = new AbortController()    // used to cancel fetch request

        /* This async function will be used to fetch a list of shows based on the user's search query */
        async function fetchShows() {
            setLoading(true)
            try {
                const response = await fetch(
                    `https://api.tvmaze.com/search/shows?q=${query}`,
                    { signal: controller.signal }
                )
                const responseBody = await response.json()
                console.log(responseBody)
                setLoading(false)
                setError(null)
                setShows(responseBody || [])
            } catch(e) {
                if (e.name === "AbortError") {
                    console.log("HTTP request was aborted")
                } else {
                    console.error("An error has occured: ", e)
                    setError(e)
                }
            }
        }
        if(query) {
            fetchShows()
        }
        return () => controller.abort()
    }, [query])

    return (
        <div className="App" css={homePageStyles}>
            <div className="searchBar">
            {/* Set the params based on the user input and pass it into the api endpoint */}
            <form onSubmit={e => {
                e.preventDefault()
                setSearchParams({ q: inputQuery })
            }}>
                <input value={inputQuery} onChange={e => setInputQuery(e.target.value)} />
                <button type="submit">Search</button>
            </form>
            </div>
            {error && <ErrorContainer>Error: {error.message}</ErrorContainer>}
            {loading && <Spinner />}
            <ul>
                {shows.map(show => (
                    <li key={show.show.id}>
                        {show.show.image ?
                         (<img src={show.show.image.medium} alt={`Poster for ${show.show.name}`} />) :
                          (
                            <img className="noImage" src={noImage} alt="" />
                          )}
                        <br />
                        <a href={show.show.url}>{show.show.name}</a>
                    </li>
                ))}
            </ul>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    🚧 Under Development 🚧
                </p>
            </header>
        </div>
    )
}


export default HomePage
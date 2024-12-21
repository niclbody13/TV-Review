import { css } from '@emotion/react'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import logo from "../assets/television.svg"
import noImage from "../assets/no-image.jpg"
import ErrorContainer from '../components/ErrorContainer'
import Spinner from '../components/Spinner'

const homePageStyles = css`
    .App {
        text-align: center;
        position: relative;
    }

    .searchBar {
        /* display: flex; */
        /* justify-content: center; */
    }

    .searchIcon {
        color: black;
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

    li p {
        text-align: center;
        color: white;
        font-size: 1.25rem;
        margin: 0;
    }

    li img{
        border-radius: 10px;
        box-shadow: 0 4px 8px 0 #222;
        cursor: pointer;
    }

    @media (max-width: 480px) {
        ul {
            /* grid-template-columns: repeat(3, 1fr); */
            grid-template-columns: repeat(3, minmax(0, 1fr));
            margin: 0;
            /* gap: 2rem; */
            justify-content: center;
            margin: 1rem;
        }

        li a {
            font-size: 1.5rem;
        }

        li p {
            font-size: 0.9rem;
        }

        input {
            font-size: 16px;
        }
    }
`

const formStyles = css`
    display: flex;
    justify-content: center;
    gap: 1em;
    margin: 2rem;
    
    .inputContainer {
        position: relative;
        display: inline-block;
    }

    input {
        padding-right: 30px;
        width: 20rem;
        border-radius: 10px;
        border: none;
        height: 2rem;
        font-size: 1rem;
        padding: 0 1rem;
        padding-left: 1.5rem;
        box-shadow: 0 2px 4px 0 #111;
    }

    #clearTextButton {
        position: absolute;
        top: 50%;
        right: 5px;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        color: #333;
        padding: 0;
    }

    #clearTextButton:hover {
        color: red;
    }

    #searchIcon {
        font-size: 0.8rem;
        position: absolute;
        color: #666;
        top: 50%; 
        left: 5px;
        transform: translateY(-50%);
    }

`

const logoStyles = css`
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 40%;
    
    .App-logo {
        height: 50vmin;
        pointer-events: none;
        max-height: 18rem;
    }

    @media (prefers-reduced-motion: no-preference) {
        .logoContainer {
        animation: App-logo-spin infinite 6s linear;
        }
    }

    .App-header {
        background-color: #282c34;
        min-height: 75vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: calc(10px + 2vmin);
        color: white;
        position: relative;
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

    p {
        position: absolute;
        top: 50%;
        right: 43%;
        font-family: "Anton", sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: 5vmin; /* Use vmin so it scales with the logo */
        font-size: clamp(0.1rem, 5vmin, 2rem);
        line-height: 1.2; /* Adjust the line height */
        z-index: 2; /* So it stays on top of the logo */
        color: white; /* Ensure the text is visible */
        /* color: black; */
        margin: 0;
    }

    @media(min-width: 700px) {
        .logoContainer {
            display: none;
        }
    }
`

function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const query = searchParams.get("q")
    const [inputQuery, setInputQuery] = useState(query || "")
    const [shows, setShows] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const inputRef = useRef(null)
    const [hasSearched, setHasSearched] = useState(false)

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
                if (!response.ok) {
                    throw new Error('Failed to fetch data')
                }
                const responseBody = await response.json()
                console.log(responseBody)
                setError(null)
                setShows(responseBody || [])
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
        if (query) {
            fetchShows()
        }
        return () => controller.abort()
    }, [query])

    useEffect(() => {
        if (searchParams.toString()) {
            setHasSearched(true);
        }
    }, [searchParams]);

    return (
        <div className="App" css={homePageStyles}>
            <div className="searchBar">
                <form
                    css={formStyles}
                    onSubmit={(e) => {
                        e.preventDefault();
                        setSearchParams({ q: inputQuery });
                        inputRef.current.blur()
                        setHasSearched(true)
                    }}
                >
                    <div className='inputContainer'>
                        <FontAwesomeIcon id='searchIcon' icon={faMagnifyingGlass} />
                        <input
                            value={inputQuery}
                            placeholder="Search for a show"
                            onChange={(e) => setInputQuery(e.target.value)}
                            ref={inputRef}
                        />
                        {inputQuery && (
                            <button
                                id='clearTextButton'
                                type="button"
                                onClick={() => {
                                    setInputQuery('')
                                    setSearchParams({})
                                    setShows([])
                                    setHasSearched(false)
                                }}
                            >
                                &times;
                            </button>
                        )}
                    </div>
                </form>
            </div>
            {error && <ErrorContainer>Error: {error.message}</ErrorContainer>}
            {loading && <Spinner />}
            {!hasSearched && (
                <header css={logoStyles} className="App-header">
                    <div className='logoContainer'>
                        <p>Welcome to <br></br> ShowList!</p>
                        <img src={logo} className="App-logo" alt="logo" />
                    </div>
                </header>
            )}
            <ul>
                {shows.map(show => (
                    <li className='showList' key={show.show.id}>
                        {show.show.image ?
                            (<img
                                src={show.show.image.medium}
                                alt={`Poster for ${show.show.name}`}
                                onClick={() => navigate(`shows/${show.show.id}`)} />) :
                            (
                                <img
                                    className="noImage"
                                    src={noImage}
                                    alt="No image available"
                                    onClick={() => navigate(`shows/${show.show.id}`)}
                                />
                            )}
                        <p>{show.show.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}


export default HomePage
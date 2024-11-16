import { css } from '@emotion/react'
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import noImage from "../assets/no-image.jpg"
import ErrorContainer from '../components/ErrorContainer'
import Spinner from '../components/Spinner'

const homePageStyles = css`
    .App {
        text-align: center;
    }

    .searchBar {
        /* display: flex; */
        /* justify-content: center; */
    }

    .searchIcon {
        color: black;
    }

    form {
        display: flex;
        justify-content: center;
        gap: 1em;
        margin: 2rem;
        /* background-color: #fff; */
    }

    input {
        width: 24rem;
        border-radius: 15px;
        border: none;
        height: 2rem;
        font-size: 1.25rem;
        padding: 0 1rem;
    }

    button {

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
            gap: 0;
            justify-content: center;
        }
        
        li {
            scale: 0.75;
        }

        li a {
            font-size: 1.5rem;
        }

        input {
            font-size: 16px;
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
    const navigate = useNavigate()

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
            } catch(e) {
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
                <input value={inputQuery} placeholder='Search for a show' onChange={e => setInputQuery(e.target.value)} />
                {/* <button type="submit">Search</button> */}
                {/* <FontAwesomeIcon className='searchIcon' onClick={console.log('clicked')} icon={faMagnifyingGlass} /> */}
            </form>
            </div>
            {error && <ErrorContainer>Error: {error.message}</ErrorContainer>}
            {loading && <Spinner />}
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
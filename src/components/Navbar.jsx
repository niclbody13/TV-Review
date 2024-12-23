import { css } from '@emotion/react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseChimney, faListUl, faUserGroup, faAddressCard } from '@fortawesome/free-solid-svg-icons'

const navbarStyles = css`
    display: flex;
    justify-content: space-around;
    font-size: calc(5.5px + 2vmin);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(13, 13, 13, 0.9);
    
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        gap: 2em;
    }

    li {
        display: inline;
        display: flex;        
        justify-content: center;
        align-items: center;
    }

    li a {
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    li p {
        padding: 0;
        margin: 0;
        font-size: 0.75rem;
    }

    a.active {
        background-color: #444;
    }

    a {
        color: white;
        text-decoration: none;
        padding: 0.5em 1em;
        border-radius: 15px;
        &:hover {
            background-color: #777;
        }
    }

    .svg-inline--fa {
        font-size: 1.3rem;
    }
`

function Navbar() {
    return (
        <nav css={navbarStyles}>
            <ul>
                <ActiveLink to="/">
                    <FontAwesomeIcon icon={faHouseChimney} />
                    <p>Home</p>
                </ActiveLink>
                <ActiveLink to="/reviews">
                    <FontAwesomeIcon icon={faListUl} />
                    <p>My List</p>
                </ActiveLink>
                <ActiveLink to="/friends">
                    <FontAwesomeIcon icon={faUserGroup} />
                    <p>Friends</p>
                </ActiveLink>
                <ActiveLink to="/account">
                    <FontAwesomeIcon icon={faAddressCard} />
                    <p>Account</p>
                </ActiveLink>
            </ul>
        </nav>
    )
}

function ActiveLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
        <li>
            <Link to={to} className={isActive ? "active" : ""} {...props}>
                {children}
            </Link>
        </li>
    )
}

export default Navbar
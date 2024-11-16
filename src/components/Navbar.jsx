import { css } from '@emotion/react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'

const navbarStyles = css`
    display: flex;
    justify-content: center;
    padding: 1rem;
    margin-top: 1rem;
    font-size: calc(5.5px + 2vmin);
    
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        gap: 1em;
    }

    li {
        display: inline;
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
`

function Navbar() {
    return (
        <nav css={navbarStyles}>
            <ul>
                <ActiveLink to="/">Home</ActiveLink>
                <ActiveLink to="/reviews">My Reviews</ActiveLink>
                <ActiveLink to="/friends">Friends</ActiveLink>
                <ActiveLink to="/account">Account</ActiveLink>
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
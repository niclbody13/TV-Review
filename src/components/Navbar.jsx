/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const navbarStyles = css`
    display: flex;
    justify-content: center;
    padding: 1em;
    position: absolute;
    top: 0;
    font-size: calc(5px + 2vmin);
    width: 100%;

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

    a {
        color: white;
        text-decoration: none;
        padding: 0.5em 1em;
        border-radius: 15px;
        &:hover {
            background-color: #333;
        }
    }
`;

function Navbar() {
    return (
        <nav css={navbarStyles}>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#reviews">My Reviews</a></li>
                <li><a href="#friends">Friends</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;

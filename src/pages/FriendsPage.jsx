import { css } from '@emotion/react'
import logo from "../assets/television.svg"

const friendsPageStyles = css`
    text-align: center;

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
        min-height: 75vh;
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
`

function FriendsPage() {
    return (
        <div css={friendsPageStyles}>
            <h1>Coming Soon!</h1>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    🚧 Under Development 🚧
                </p>
            </header>
        </div>
    )
}

export default FriendsPage
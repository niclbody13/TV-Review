import { css } from '@emotion/react'

const friendsPageStyles = css`
    text-align: center;
`

function FriendsPage() {
    return (
        <div css={friendsPageStyles}>
            <h1>Friends</h1>
        </div>
    )
}

export default FriendsPage
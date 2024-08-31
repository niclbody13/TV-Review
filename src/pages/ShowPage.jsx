import { css } from '@emotion/react'

const showStyles = css`
    display: flex;
    justify-content: center;
    align-items: center;
`

function ShowPage() {
    return (
        <div css={showStyles}>
            <h1>Show Page</h1>
        </div>
    )
}

export default ShowPage
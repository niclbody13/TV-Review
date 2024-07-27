import { css } from '@emotion/react'

const errorContainerStyles = css`
    padding: 10px;
    background-color: #ff7c7c;
    color: #fff;
`

export default function ErrorContainer({ children }) {
    return <div className="error-container" css={errorContainerStyles}>{children}</div>
}
import { css } from "@emotion/react"

const errorStyles = css`
    text-align: center;
`

function ErrorPage() {
    return (
        <>
            <h1 css={errorStyles}>404 Error - Page Not Found</h1>
        </>
    )
  }

  
export default ErrorPage
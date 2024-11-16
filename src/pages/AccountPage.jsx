import { css } from '@emotion/react'
import { Amplify } from 'aws-amplify'
import outputs from '../../amplify_outputs.json'
import { signOut, fetchUserAttributes } from 'aws-amplify/auth'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

Amplify.configure(outputs)

const accountStyles = css`
    text-align: center;    

    button {
        width: 8rem;
        font-size: 0.9rem;
        color: white;
        background-color: #333;
        border-radius: 15px;
        border: 1px solid black;
    }
`

function AccountPage() {
    const [userAttributes, setUserAttributes] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        const getUserData = async () => {
            try {
                const attributes = await fetchUserAttributes();
                setUserAttributes(attributes)
            } catch (error) {
                console.error("Error fetching user attributes:", error);
            }
        };
        getUserData();
    }, []);

    async function handleSignOut() {
        await signOut()
        navigate('/')
    }

    return (
        <div css={accountStyles}>
            {userAttributes ? (
                <h1>Hello, {userAttributes.preferred_username}</h1>
            ) : (
                <h1>Loading user data...</h1>
            )}
            <button type='button' onClick={handleSignOut}>Sign out</button>
        </div>
    )
}

export default AccountPage
import { css } from '@emotion/react'
import { signOut, fetchUserAttributes, deleteUser } from 'aws-amplify/auth'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const accountStyles = css`
    text-align: center;    

    button {
        min-width: 10rem;
        font-size: 1rem;
        color: white;
        background-color: #555;
        box-shadow: 0px 2px 4px 0 #111;
        border-radius: 15px;
        padding: 0.5rem;
        border: 1px solid black;
        cursor: pointer;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .deleteAccountModal {
        border: 2px solid black;
        padding: 2rem;
        background-color: rgba(17, 17, 17, 0.75);
    }

    .deleteAccountModal button {
        min-width: 4rem;
        margin: 0 1rem;
    }
`

function AccountPage() {
    const [userAttributes, setUserAttributes] = useState(null)
    const [isConfirming, setIsConfirming] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        const getUserData = async () => {
            try {
                const attributes = await fetchUserAttributes()
                setUserAttributes(attributes)
            } catch (error) {
                console.error("Error fetching user attributes:", error)
            }
        };
        getUserData();
    }, []);

    async function handleSignOut() {
        await signOut()
        navigate('/')
    }

    const handleDeleteAccount = () => {
        setIsConfirming(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteUser()
            alert('Your account has been successfully deleted.')
            navigate('/')
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('An error occurred while trying to delete your account.')
        }
    }

    const handleCancelDelete = () => {
        setIsConfirming(false)
    }

    return (
        <div css={accountStyles}>
            {userAttributes ? (
                <h1>Hello, {userAttributes.preferred_username}</h1>
            ) : (
                <h1>Loading user data...</h1>
            )}
            <div className='buttons'>
                <button type='button' onClick={handleSignOut}>Sign out</button>
                <button type='button' onClick={handleDeleteAccount}>Delete Account</button>
                {isConfirming && (
                    <div className='deleteAccountModal'>
                        <p>Are you sure? You can't undo this.</p>
                        <button onClick={handleConfirmDelete} style={{ backgroundColor: '#095109' }}>Yes</button>
                        <button onClick={handleCancelDelete} style={{ backgroundColor: '#7f0404' }}>No</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AccountPage
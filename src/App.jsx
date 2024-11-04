import { Global, css } from '@emotion/react';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";
import { signUp, fetchUserAttributes } from 'aws-amplify/auth';

Amplify.configure(outputs);

import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ReviewsPage from './pages/ReviewsPage'
import FriendsPage from './pages/FriendsPage'
import ShowPage from './pages/ShowPage'
import ErrorPage from './pages/ErrorPage'

const globalStyles = css`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #282c34;
    color: white;
  }
`;

const authenticatorStyles = css`
  .amplify-button--primary {
    --amplify-internal-button-background-color: #d73f09; 
  }

  .amplify-button:hover {
    --amplify-internal-button-border-color: #777;
    --amplify-internal-button-color: #333;
    --amplify-internal-button-background-color: rgba(215, 63, 9, 0.25);

  }

  .amplify-tabs__item:hover {
    color: rgba(215, 63, 9, 0.75);
  }

  .amplify-tabs__item--active {
    color: #d73f09;
    border-color: #d73f09;
  }
  .amplify-button--link {
    --amplify-internal-button-color: #d73f09;
  }
  .amplify-button--link:hover {
    --amplify-internal-button-background-color: rgba(1, 1, 1, 0.25);
  }
`

const formFields = {
  signUp: {
    email: {
      order: 1
    },
    preferred_username: {
      order: 2,
      label: 'Username',
      placeholder: 'Enter your Username'
    },
    password: {
      order: 3
    },
    confirm_password: {
      order: 4
    }
  },
}

const services = {
  async handleSignUp(input) {
    console.log("input", input)
    const { username, password, options } = input
    return signUp({
      username,
      password,
      options: {
        ...input.options,
        userAttributes: {
          ...input.options?.userAttributes,
          preferred_username: options?.userAttributes?.preferred_username,
        },
      },
    })
  },
}

function App() {
  const [userAttributes, setUserAttributes] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (isAuthenticated) {
          const attributes = await fetchUserAttributes();
          console.log("userAttributes:", attributes);
          setUserAttributes(attributes);
        }
      } catch (error) {
        console.error("Error fetching user attributes:", error);
      }
    };
    getUserData();
  }, [isAuthenticated]);
  return (
    <>
      <Authenticator css={authenticatorStyles} signUpAttributes={['preferred_username']} formFields={formFields} services={services}>
        {({ signOut, user }) => {
          if (user && !isAuthenticated) {
            setIsAuthenticated(true);
          }

          return (
            <main>
              {userAttributes ? (
                <h1>Hello, {userAttributes.preferred_username}</h1>
              ) : (
                <h1>Loading user data...</h1>
              )}
              <button onClick={signOut}>Sign out</button>
            </main>
          );
        }}
      </Authenticator>
      {/* <Global styles={globalStyles} />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path='/shows/:id' element={<ShowPage />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes> */}
    </>
  )
}

export default App;

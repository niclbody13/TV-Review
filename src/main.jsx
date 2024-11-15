import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json'
import { Authenticator } from '@aws-amplify/ui-react'
import { css } from '@emotion/react';
import { signUp } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';


Amplify.configure(outputs)

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


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Authenticator css={authenticatorStyles} signUpAttributes={['preferred_username']} formFields={formFields} services={services}>
        <App />
      </Authenticator>
    </BrowserRouter>
  </React.StrictMode>
);
import { Global, css } from '@emotion/react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ReviewsPage from './pages/ReviewsPage'
import FriendsPage from './pages/FriendsPage'
import ShowPage from './pages/ShowPage'
import AccountPage from './pages/AccountPage'
import ErrorPage from './pages/ErrorPage'
import ScrollToTop from './components/ScrollToTop';

const globalStyles = css`
  body {
    margin: 0;
    padding: 0;
    /* font-family: 'Arial', sans-serif; */
    font-family: 'Roboto', sans-serif;
    background-color: #282c34;
    color: white;
  }
`;

const mainContentStyles = css`
  padding-bottom: 70px;   // make room for navbar
`

function App() {
  return (
    <>
      <ScrollToTop />
      <Global styles={globalStyles} />
      <Navbar />
      <div css={mainContentStyles}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path='/shows/:id' element={<ShowPage />} />
          <Route path='account' element={<AccountPage />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App;

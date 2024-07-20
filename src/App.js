import logo from './television.svg';
import './App.css';
import Navbar from './components/Navbar';

import { Global, css } from '@emotion/react';

const globalStyles = css`
    body {
        margin: 0;
        padding: 0;
        font-family: 'Arial', sans-serif;
        background-color: #d73f09;
    }
`;

function App() {
  return (
    <div className="App">
      <Global styles={globalStyles} />
      <header className="App-header">
        <Navbar/ >
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        🚧 Under Development 🚧
        </p>
      </header>
    </div>
  );
}

export default App;

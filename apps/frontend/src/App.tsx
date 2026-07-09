import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <div className="units-container">
      <nav className="navbar">
        <ul>
          <li className="active">
            <Link to="/">e-shop</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

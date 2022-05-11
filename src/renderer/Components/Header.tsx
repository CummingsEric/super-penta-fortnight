import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <Link to="/">Home</Link>
      <Link to="/debug">Debug</Link>
    </header>
  );
};

export default Header;

import './App.css';
// import FormWithDisplay from './components/FormWithDisplay';
import FormWithDisplayCopy from './components/FormWithDisplayCopy';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AssignedBugs from './components/AssignedBugs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormWithDisplayCopy />} />
        <Route path="/assigned-bugs" element={<AssignedBugs />} />
      </Routes>
    </Router>
  );
}

export default App;

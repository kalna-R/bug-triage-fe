import React, { useEffect, useState } from 'react';
import './FormWithDisplay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faBug } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface Bug {
  bugId: string;
  description: string;
  severity: string;
  priority: string;
  developer: string;
}

const AssignedBugs: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://your-api-endpoint.com/assigned-bugs');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBugs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const sortByDeveloper = () => {
    const sortedBugs = [...bugs].sort((a, b) => {
      if (a.developer < b.developer) return sortAsc ? -1 : 1;
      if (a.developer > b.developer) return sortAsc ? 1 : -1;
      return 0;
    });
    setBugs(sortedBugs);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="page">
      <header className="header">
      <FontAwesomeIcon icon={faBug} className="icon" />
        <nav className="nav">
          <a href="#">Home</a>
          <a href="/" className="active">Developer</a>
          <a href="#">About</a>
        </nav>
        <FontAwesomeIcon icon={faUserCircle} className="icon profile-icon" />
      </header>

      <main className="main-form">
        <section className="form-section-table">
        <h1>Assigned Bugs</h1>
          <div className="sort-section" onClick={sortByDeveloper} style={{cursor: 'pointer', marginBottom: '1rem'}}>
            <i className="fas fa-sort-alpha-down"></i> Sort by Developer
          </div>
          {/* {loading && <p>Loading bugs...</p>}
          {error && <p style={{color: 'red'}}>{error}</p>}
          {!loading && !error && ( */}
            <div className="table-container">
              <div className="table-header">
                <div className="table-cell header-cell">Bug ID</div>
                <div className="table-cell header-cell">Description</div>
                <div className="table-cell header-cell">Severity</div>
                <div className="table-cell header-cell">Priority</div>
                <div className="table-cell header-cell">Developer</div>
              </div>
              {(bugs.length > 0 ? bugs : [
                { bugId: 'B001', description: 'Login button not working', severity: 'High', priority: 'P1', developer: 'Alice@gmail.com' },
                { bugId: 'B002', description: 'Page crashes on load', severity: 'Medium', priority: 'P2', developer: 'Bob@gmail.com' },
                { bugId: 'B003', description: 'Typo in footer', severity: 'Low', priority: 'P5', developer: 'Charlie@gmail.com' },
              ]).map((bug) => (
                <div className="table-row" key={bug.bugId}>
                  <div className="table-cell">{bug.bugId}</div>
                  <div className="table-cell">{bug.description}</div>
                  <div className="table-cell">{bug.severity}</div>
                  <div className="table-cell">{bug.priority}</div>
                  <div className="table-cell">{bug.developer}</div>
                </div>
              ))}
            </div>
          {/* )} */}
        </section>
      </main>
    </div>
  );
};

export default AssignedBugs;

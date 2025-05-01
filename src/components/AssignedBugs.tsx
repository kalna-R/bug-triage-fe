import React, { useEffect, useState } from 'react';
import './FormWithDisplay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faBug } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

interface Bug {
  bugId: string;
  description: string;
  severity: string;
  priority: string;
  developer: string;
  timestamp?: string;
}

const AssignedBugs: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  useEffect(() => {
    const fetchBugs = () => {
      setLoading(true);
      setError(null);
      
      try {
        const bugsRef = ref(database, 'bugReports');
        
        // Set up realtime listener
        const unsubscribe = onValue(bugsRef, (snapshot) => {
          const bugsData: Bug[] = [];
          snapshot.forEach((childSnapshot) => {
            const bug = childSnapshot.val();
            bugsData.push({
              bugId: bug.bugId,
              description: bug.description,
              severity: bug.severity,
              priority: bug.priority,
              developer: bug.developer,
              timestamp: bug.timestamp
            });
          });
          
          // Sort by timestamp (newest first)
          bugsData.sort((a, b) => 
            (b.timestamp || '').localeCompare(a.timestamp || '')
          );
          
          setBugs(bugsData);
          setLoading(false);
        }, (error) => {
          setError(error.message);
          setLoading(false);
        });

        return () => unsubscribe(); // Cleanup on unmount

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchBugs();
  }, []);

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
          <Link to="/">Home</Link>
          <Link to="/assigned-bugs" className="active">Assigned Bugs</Link>
          <a href="#">About</a>
        </nav>
        <FontAwesomeIcon icon={faUserCircle} className="icon profile-icon" />
      </header>

      <main className="main-form">
        <section className="form-section-table">
          <h1>Assigned Bugs</h1>
          
          {loading && <p>Loading bugs...</p>}
          {error && <p className="error-message">{error}</p>}
          
          <div className="sort-section" onClick={sortByDeveloper} style={{cursor: 'pointer', marginBottom: '1rem'}}>
            <i className="fas fa-sort-alpha-down"></i> Sort by Developer
          </div>
          
          <div className="table-container">
            <div className="table-header">
              <div className="table-cell header-cell">Bug ID</div>
              <div className="table-cell header-cell">Description</div>
              <div className="table-cell header-cell">Severity</div>
              <div className="table-cell header-cell">Priority</div>
              <div className="table-cell header-cell">Developer</div>
            </div>
            
            {bugs.length > 0 ? (
              bugs.map((bug) => (
                <div className="table-row" key={`${bug.bugId}-${bug.timestamp}`}>
                  <div className="table-cell">{bug.bugId}</div>
                  <div className="table-cell">{bug.description}</div>
                  <div className="table-cell">{bug.severity}</div>
                  <div className="table-cell">{bug.priority}</div>
                  <div className="table-cell">{bug.developer}</div>
                </div>
              ))
            ) : (
              !loading && <div className="no-bugs">No bugs found</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AssignedBugs;
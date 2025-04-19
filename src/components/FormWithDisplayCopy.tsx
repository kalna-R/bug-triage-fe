import React, { useState } from 'react';
import './FormWithDisplay.css'; // Import the styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faBug } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


// Define the type for the form data
interface FormData {
  bugId: string;
  severity: string;
  priority: string;
  description: string;
}

const FormWithDisplayCopy: React.FC = () => {
  // State for form fields
  const [formData, setFormData] = useState<FormData>({
    bugId: '',
    severity: '',
    priority: '',
    description: '',
  });

  // State for displaying the developer's email
  const [developerEmail, setDeveloperEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://b194-34-32-191-121.ngrok-free.app/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bug_description: formData.description,
          severity: Number(formData.severity),
          priority: Number(formData.priority),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Developr {}", result.predicted_developer)
      setDeveloperEmail(result.predicted_developer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
      <FontAwesomeIcon icon={faBug} className="icon" />
        <nav className="nav">
          <a href="#">Home</a>
          <Link to="/assigned-bugs">Bugs</Link>
          <a href="#">About</a>
        </nav>
        <FontAwesomeIcon icon={faUserCircle} className="icon profile-icon" />
      </header>

      <main className="main">
        <section className="form-section">
          <h1>Predict Developer</h1>
          <p className="submit-info">Let us find the perfect developer for your bug - just submit the details.</p>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Bug Report ID
              <input
                type="text"
                name="bugId"
                value={formData.bugId}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Bug Severity
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled hidden></option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <label>
              Bug Priority
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled hidden></option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <label>
              Bug Description
              <textarea
                name="description"
                rows={5}
                placeholder="Enter a short description"
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </label>

            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </section>

        <section className="result-section">
        {/* <p className="submit-info">Let us find the perfect developer for your bug - just submit the details.</p> */}
        <FontAwesomeIcon icon={faUserCircle} className="result-icon" />
          <div className="email-badge">{developerEmail ? developerEmail : 'user@bugtriage.com'}</div>
          <p>
            Is more likely to resolve the bug efficiently
          </p>
        </section>
      </main>
    </div>
  );

};

export default FormWithDisplayCopy;
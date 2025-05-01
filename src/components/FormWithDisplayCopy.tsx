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

interface FormErrors {
  bugId?: string;
  severity?: string;
  priority?: string;
  description?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});

  // Validate form input data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Bug ID validation
    if (!formData.bugId.trim()) {
      newErrors.bugId = 'Bug ID is required';
    } else if (!/^[A-Za-z0-9-]+$/.test(formData.bugId)) {
      newErrors.bugId = 'Bug ID can only contain letters, numbers, and hyphens';
    }

    // Severity validation
    if (!formData.severity) {
      newErrors.severity = 'Please select a severity level';
    }

    // Priority validation
    if (!formData.priority) {
      newErrors.priority = 'Please select a priority level';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 20 characters';
    } else if (formData.description.trim().length > 300) {
      newErrors.description = 'Description should not exceed 300 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // const response = await fetch('https://b194-34-32-191-121.ngrok-free.app/predict', {
      const response = await fetch('http://localhost:8080/developer', {
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

          {error && <div className="error-message">{error}</div>}

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
              {errors.bugId && <span className="error-text">{errors.bugId}</span>}
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
              {errors.severity && <span className="error-text">{errors.severity}</span>}
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
              {errors.priority && <span className="error-text">{errors.priority}</span>}
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
              {errors.description && <span className="error-text">{errors.description}</span>}
            </label>

            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </section>

        {developerEmail && (
          <section className="result-section">
            <h1>Prediction Results</h1>
            <FontAwesomeIcon icon={faUserCircle} className="result-icon" />
            <div className="email-badge">{developerEmail}</div>
            <p>Is more likely to resolve the bug efficiently</p>
          </section>
        )}

      </main>
    </div>
  );

};

export default FormWithDisplayCopy;
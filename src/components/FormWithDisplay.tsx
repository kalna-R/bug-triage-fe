import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Grid, Paper, IconButton,  } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BugReportSubmitButton from './BugReportSubmitButton';

// Define the type for the form data
interface FormData {
  bugId: string;
  severity: string;
  priority: string;
  description: string;
}

const FormWithDisplay: React.FC = () => {
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <Container>
      <Grid container spacing={4}>
        {/* Left Side: Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Bug Report ID"
                name="bugId"
                value={formData.bugId}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Bug Severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Bug Priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Bug Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
                required
              />
              <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Right Side: Display Developer's Email */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Prediction Results
            </Typography>
            {developerEmail ? (
              <Typography variant="body1">
                {developerEmail} is more likely to resolve the bug efficiently
              </Typography>
            ) : (
              <Typography variant="body1" color="textSecondary">
                Is more likely to resolve the bug efficiently
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FormWithDisplay;
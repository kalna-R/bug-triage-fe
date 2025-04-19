import { Button } from '@mui/material';
import React, { useState } from 'react';

const BugReportSubmitButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.example.com/endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ key: 'value' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <Button type="submit" variant="contained" color="primary" onClick={handleClick}> Submit </Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div>
          <h3>Response Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default BugReportSubmitButton;
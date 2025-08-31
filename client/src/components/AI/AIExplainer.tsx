import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../UI';

interface AIExplainerProps {
  code: string;
  language: string;
  aiExplanation?: string;
}

interface AIResponse {
  explanation: string;
  success: boolean;
  error?: string;
}

const AIExplainer: React.FC<AIExplainerProps> = ({ code, language, aiExplanation }) => {
  const [explanation, setExplanation] = useState<string>(aiExplanation || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const explainCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post<AIResponse>('/api/ai/explain', {
        code,
        language
      });

      if (response.data.success) {
        setExplanation(response.data.explanation);
      } else {
        setError(response.data.error || 'Failed to generate explanation');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to AI service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-explainer">
      <div className="d-flex align-items-center mb-2">
        <h6 className="mb-0">🤖 AI Code Explanation</h6>
        <Button
          text={loading ? 'Analyzing...' : (explanation ? 'Refresh Explanation' : 'Explain Code')}
          color="primary"
          outline={true}
          small={true}
          handler={explainCode}
          classes="ms-2"
        />
      </div>

      {error && (
        <div className="alert alert-warning alert-sm">
          <small>{error}</small>
        </div>
      )}

      {explanation && (
        <div className="ai-explanation p-3 bg-light rounded border">
          <small className="text-muted d-block mb-1">AI Generated Explanation:</small>
          <p className="mb-0">{explanation}</p>
        </div>
      )}

      {!explanation && !loading && (
        <div className="text-muted">
          <small>Click "Explain Code" to get an AI-powered explanation of this code snippet.</small>
        </div>
      )}
    </div>
  );
};

export default AIExplainer;

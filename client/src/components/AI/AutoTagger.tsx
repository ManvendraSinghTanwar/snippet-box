import React, { useState } from 'react';
import axios from 'axios';
import { Button, Badge } from '../UI';

interface AutoTaggerProps {
  code: string;
  language: string;
  currentTags: string[];
  onTagsGenerated: (tags: string[]) => void;
}

interface TagResponse {
  tags: string[];
  success: boolean;
  error?: string;
}

const AutoTagger: React.FC<AutoTaggerProps> = ({ 
  code, 
  language, 
  currentTags, 
  onTagsGenerated 
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const generateTags = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post<TagResponse>('/api/ai/generate-tags', {
        code,
        language
      });

      if (response.data.success) {
        const newTags = response.data.tags.filter(tag => 
          !currentTags.includes(tag.toLowerCase())
        );
        setSuggestedTags(newTags);
      } else {
        setError(response.data.error || 'Failed to generate tags');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to AI service');
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag: string) => {
    const updatedTags = [...currentTags, tag];
    onTagsGenerated(updatedTags);
    setSuggestedTags(suggestedTags.filter(t => t !== tag));
  };

  const addAllTags = () => {
    const updatedTags = [...currentTags, ...suggestedTags];
    onTagsGenerated(updatedTags);
    setSuggestedTags([]);
  };

  return (
    <div className="auto-tagger">
      <div className="d-flex align-items-center mb-2">
        <label className="form-label mb-0">🏷️ Smart Tags</label>
        <Button
          text={loading ? 'Generating...' : 'Generate AI Tags'}
          color="success"
          small={true}
          outline={true}
          handler={generateTags}
          classes="ms-2"
        />
      </div>

      {error && (
        <div className="alert alert-warning alert-sm mb-2">
          <small>{error}</small>
        </div>
      )}

      {suggestedTags.length > 0 && (
        <div className="suggested-tags p-2 bg-light rounded border">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <small className="text-muted">AI Suggested Tags:</small>
            <Button
              text="Add All"
              color="success"
              small={true}
              handler={addAllTags}
            />
          </div>
          <div className="d-flex flex-wrap gap-1">
            {suggestedTags.map((tag, index) => (
              <span
                key={index}
                className="badge bg-primary cursor-pointer me-1 mb-1"
                onClick={() => addTag(tag)}
                title={`Click to add "${tag}" to your tags`}
                style={{ cursor: 'pointer' }}
              >
                {tag} <span className="ms-1">+</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {currentTags.length > 0 && (
        <div className="current-tags mt-2">
          <small className="text-muted d-block mb-1">Current Tags:</small>
          <div className="d-flex flex-wrap gap-1">
            {currentTags.map((tag, index) => (
              <Badge key={index} text={tag} color="primary" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoTagger;

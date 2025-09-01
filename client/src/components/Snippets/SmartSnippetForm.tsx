import React, { useState, useContext } from 'react';
import axios from 'axios';
import { SnippetsContext } from '../../store';
import { NewSnippet } from '../../typescript/interfaces';
import { Button, Card } from '../UI';

interface SmartSnippetFormProps {
  inEdit?: boolean;
}

interface AISnippetResponse {
  title: string;
  description: string;
  language: string;
  tags: string[];
  explanation: string;
  success: boolean;
  error?: string;
}

export const SmartSnippetForm: React.FC<SmartSnippetFormProps> = ({ inEdit = false }) => {
  const { createSnippet, currentSnippet, updateSnippet } = useContext(SnippetsContext);

  const [code, setCode] = useState<string>('');
  const [generatedData, setGeneratedData] = useState<Partial<NewSnippet> | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Editable fields when user wants to modify AI suggestions
  const [editableData, setEditableData] = useState<Partial<NewSnippet>>({
    title: '',
    description: '',
    language: '',
    tags: [],
    docs: '',
    isPinned: false
  });

  const generateSnippetDetails = async () => {
    if (!code.trim()) {
      setError('Please paste some code first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await axios.post<AISnippetResponse>('/api/ai/generate-snippet', {
        code: code.trim()
      });

      if (response.data.success) {
        const generated = {
          title: response.data.title,
          description: response.data.description,
          language: response.data.language,
          code: code.trim(),
          tags: response.data.tags,
          docs: response.data.explanation,
          isPinned: false
        };

        setGeneratedData(generated);
        setEditableData(generated);
        setError('');
      } else {
        setError(response.data.error || 'Failed to generate snippet details');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to AI service');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditableChange = (field: keyof NewSnippet, value: any) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    handleEditableChange('tags', tags);
  };

  const handleSubmit = () => {
    if (!editableData.title || !editableData.code) {
      setError('Title and code are required');
      return;
    }

    const submissionData = {
      ...editableData,
      code,
      useAI: true
    } as NewSnippet;

    if (inEdit && currentSnippet) {
      updateSnippet(submissionData, currentSnippet.id);
    } else {
      createSnippet(submissionData);
    }
  };

  const reset = () => {
    setCode('');
    setGeneratedData(null);
    setEditableData({
      title: '',
      description: '',
      language: '',
      tags: [],
      docs: '',
      isPinned: false
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className='col-12 mt-3'>
      <Card>
        <div className="smart-snippet-form">
          <h5 className='card-title mb-3'>
            🤖 Smart Snippet Creator
            <small className="text-muted d-block mt-1">
              Just paste your code and let AI generate everything else!
            </small>
          </h5>

          {error && (
            <div className="alert alert-danger mb-3">
              {error}
            </div>
          )}

          {/* Step 1: Code Input */}
          <div className="step-1 mb-4">
            <label htmlFor="code" className="form-label">
              <strong>Step 1:</strong> Paste your code here
            </label>
            <textarea
              className="form-control"
              id="code"
              rows={10}
              value={code}
              placeholder="// Paste your code here...
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}"
              onChange={(e) => setCode(e.target.value)}
            />
            <div className="d-flex gap-2 mt-2">
              <Button
                text={isGenerating ? 'Analyzing Code...' : '🧠 Generate Details with AI'}
                color="primary"
                handler={generateSnippetDetails}
                disabled={isGenerating || !code.trim()}
              />
              {generatedData && (
                <Button
                  text="🔄 Reset"
                  color="secondary"
                  outline={true}
                  handler={reset}
                />
              )}
            </div>
          </div>

          {/* Step 2: Generated Details */}
          {generatedData && (
            <div className="step-2 mb-4">
              <hr />
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">
                  <strong>Step 2:</strong> Review & Edit Generated Details
                </h6>
                <Button
                  text={isEditing ? '📖 View Mode' : '✏️ Edit Mode'}
                  color="info"
                  small={true}
                  outline={true}
                  handler={() => setIsEditing(!isEditing)}
                />
              </div>

              {!isEditing ? (
                // View Mode
                <div className="generated-preview">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <div className="card border-success">
                        <div className="card-body">
                          <h6 className="card-title text-success">
                            📝 {editableData.title}
                          </h6>
                          <p className="card-text">{editableData.description}</p>
                          <div className="d-flex gap-2 flex-wrap">
                            <span className="badge bg-primary">{editableData.language}</span>
                            {editableData.tags?.map((tag, index) => (
                              <span key={index} className="badge bg-secondary">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card border-info">
                        <div className="card-body">
                          <h6 className="card-title text-info">🤖 AI Explanation</h6>
                          <p className="card-text">
                            <small>{editableData.docs}</small>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="edit-mode">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editableData.title || ''}
                        onChange={(e) => handleEditableChange('title', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Language</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editableData.language || ''}
                        onChange={(e) => handleEditableChange('language', e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editableData.description || ''}
                        onChange={(e) => handleEditableChange('description', e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Tags (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editableData.tags?.join(', ') || ''}
                        onChange={(e) => handleTagsChange(e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Documentation / Explanation</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={editableData.docs || ''}
                        onChange={(e) => handleEditableChange('docs', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Submit */}
              <hr />
              <div className="step-3">
                <h6><strong>Step 3:</strong> Save Snippet</h6>
                <div className="d-grid gap-2 d-md-flex">
                  <Button
                    text={inEdit ? '💾 Update Snippet' : '💾 Save Snippet'}
                    color="success"
                    handler={handleSubmit}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

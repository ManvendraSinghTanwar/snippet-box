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
    <div className='col-12 mt-3 smart-snippet-form-modern'>
      <div className="smart-header">
        <div className="smart-icon-wrapper">
          <div className="smart-main-icon">
            <i className="bi bi-robot"></i>
            <div className="icon-glow"></div>
          </div>
        </div>
        <h5 className='smart-title'>
          AI-Powered Snippet Creator
        </h5>
        <p className="smart-subtitle">
          Just paste your code and watch the magic happen! Our AI will analyze, categorize, and document your snippet automatically.
        </p>
        <div className="smart-features">
          <div className="feature-pill">
            <i className="bi bi-lightning-charge"></i>
            Instant Analysis
          </div>
          <div className="feature-pill">
            <i className="bi bi-tags"></i>
            Auto-Tagging
          </div>
          <div className="feature-pill">
            <i className="bi bi-file-text"></i>
            Documentation
          </div>
        </div>
      </div>

      {error && (
        <div className="alert-modern alert-danger-modern">
          <div className="alert-icon">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <div className="alert-content">
            <strong>Oops!</strong> {error}
          </div>
        </div>
      )}

      {/* Step 1: Code Input */}
      <div className="step-section active">
        <div className="step-header">
          <div className="step-number">
            <i className="bi bi-code-slash"></i>
            <div className="step-number-text">1</div>
          </div>
          <div className="step-content">
            <h6 className="step-title">Paste Your Code</h6>
            <p className="step-description">Drop your code snippet here and let AI do the heavy lifting</p>
          </div>
        </div>
        
        <div className="code-input-section">
          <div className="code-input-wrapper">
            <div className="code-toolbar">
              <div className="toolbar-left">
                <i className="bi bi-code"></i>
                <span>Code Editor</span>
              </div>
              <div className="toolbar-right">
                <div className="code-stats">
                  <span className="stat-item">
                    <i className="bi bi-file-code"></i>
                    {code.split('\n').length} lines
                  </span>
                  <span className="stat-item">
                    <i className="bi bi-type"></i>
                    {code.length} chars
                  </span>
                </div>
              </div>
            </div>
            <textarea
              className="form-control code-textarea-modern"
              id="code"
              rows={12}
              value={code}
              placeholder="// Paste your code here...
// Example: JavaScript function
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Or any other programming language!
// Python, Java, C++, SQL, etc."
              onChange={(e) => setCode(e.target.value)}
            />
            <div className="code-input-footer">
              <div className="supported-languages">
                <i className="bi bi-check-circle"></i>
                Supports: JavaScript, Python, Java, C++, SQL, Go, Rust, and 50+ more languages
              </div>
            </div>
          </div>
          <div className="action-buttons">
            <button
              onClick={generateSnippetDetails}
              disabled={isGenerating || !code.trim()}
              className="btn-generate-modern"
            >
              <div className="btn-icon">
                {isGenerating ? (
                  <i className="bi bi-arrow-clockwise spinning"></i>
                ) : (
                  <i className="bi bi-magic"></i>
                )}
              </div>
              <div className="btn-content">
                <span className="btn-main-text">
                  {isGenerating ? 'Analyzing Code...' : 'Generate Details with AI'}
                </span>
                <span className="btn-sub-text">
                  {isGenerating ? 'Powered by OpenAI GPT' : 'Powered by advanced AI models'}
                </span>
              </div>
              {!isGenerating && (
                <div className="btn-arrow">
                  <i className="bi bi-arrow-right"></i>
                </div>
              )}
            </button>
            {generatedData && (
              <button
                onClick={reset}
                className="btn-reset-modern"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Generated Details */}
      {generatedData && (
        <div className="step-section completed">
          <div className="step-header">
            <div className="step-number">
              <i className="bi bi-check-circle"></i>
              <div className="step-number-text">2</div>
            </div>
            <div className="step-content">
              <h6 className="step-title">AI Generated Results</h6>
              <p className="step-description">Review and customize the AI-generated details for your snippet</p>
            </div>
          </div>
          
          <div className="generated-preview-section">
            <div className="preview-header">
              <div className="preview-title-section">
                <h6 className="preview-title">
                  <i className="bi bi-sparkles"></i>
                  AI Generated Content
                </h6>
                <div className="ai-confidence-badge">
                  <i className="bi bi-award"></i>
                  High Confidence
                </div>
              </div>
              <div className="mode-toggle-section">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mode-toggle-btn-modern"
                >
                  <div className="toggle-icon">
                    {isEditing ? (
                      <i className="bi bi-eye"></i>
                    ) : (
                      <i className="bi bi-pencil"></i>
                    )}
                  </div>
                  <span>
                    {isEditing ? 'Preview Mode' : 'Edit Mode'}
                  </span>
                </button>
              </div>
            </div>

            {!isEditing ? (
              // Enhanced View Mode
              <div className="preview-cards-modern">
                <div className="preview-main-card">
                  <div className="card-header-modern">
                    <div className="card-icon">
                      <i className="bi bi-file-code"></i>
                    </div>
                    <h6 className="card-title">{editableData.title}</h6>
                    <div className="confidence-indicator high">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                  </div>
                  <div className="card-body-modern">
                    <p className="description">{editableData.description}</p>
                    <div className="metadata-grid">
                      <div className="metadata-item">
                        <div className="metadata-label">
                          <i className="bi bi-code-slash"></i>
                          Language
                        </div>
                        <div className="metadata-value language-badge">
                          {editableData.language}
                        </div>
                      </div>
                      <div className="metadata-item">
                        <div className="metadata-label">
                          <i className="bi bi-tags"></i>
                          Tags ({editableData.tags?.length || 0})
                        </div>
                        <div className="metadata-value">
                          <div className="tag-cloud">
                            {editableData.tags?.map((tag, index) => (
                              <span key={index} className="tag-pill-modern">
                                {tag}
                              </span>
                            )) || []}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="preview-explanation-card">
                  <div className="card-header-modern">
                    <div className="card-icon explanation">
                      <i className="bi bi-lightbulb"></i>
                    </div>
                    <h6 className="card-title">AI Explanation</h6>
                    <div className="card-actions">
                      <button className="btn-icon-small" title="Regenerate explanation">
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body-modern">
                    <div className="explanation-content">
                      {editableData.docs}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Enhanced Edit Mode
              <div className="edit-mode-section-modern">
                <div className="edit-header">
                  <h6 className="edit-title">
                    <i className="bi bi-pencil-square"></i>
                    Customize Your Snippet
                  </h6>
                  <p className="edit-subtitle">Fine-tune the AI suggestions to match your preferences</p>
                </div>
                
                <div className="edit-form-grid-modern">
                  <div className="form-row">
                    <div className="form-group-modern">
                      <label className="form-label-modern">
                        <div className="label-icon">
                          <i className="bi bi-type"></i>
                        </div>
                        <div className="label-content">
                          <span className="label-text">Title</span>
                          <span className="label-required">*</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        className="form-control-modern"
                        value={editableData.title || ''}
                        onChange={(e) => handleEditableChange('title', e.target.value)}
                        placeholder="Enter a descriptive title..."
                      />
                    </div>
                    <div className="form-group-modern">
                      <label className="form-label-modern">
                        <div className="label-icon">
                          <i className="bi bi-code-slash"></i>
                        </div>
                        <div className="label-content">
                          <span className="label-text">Language</span>
                          <span className="label-required">*</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        className="form-control-modern"
                        value={editableData.language || ''}
                        onChange={(e) => handleEditableChange('language', e.target.value)}
                        placeholder="e.g., JavaScript, Python, Java..."
                      />
                    </div>
                  </div>
                  
                  <div className="form-group-modern full-width">
                    <label className="form-label-modern">
                      <div className="label-icon">
                        <i className="bi bi-chat-text"></i>
                      </div>
                      <div className="label-content">
                        <span className="label-text">Description</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      className="form-control-modern"
                      value={editableData.description || ''}
                      onChange={(e) => handleEditableChange('description', e.target.value)}
                      placeholder="Brief description of what this code does..."
                    />
                  </div>
                  
                  <div className="form-group-modern full-width">
                    <label className="form-label-modern">
                      <div className="label-icon">
                        <i className="bi bi-tags"></i>
                      </div>
                      <div className="label-content">
                        <span className="label-text">Tags</span>
                        <span className="label-hint">({editableData.tags?.length || 0} tags)</span>
                      </div>
                    </label>
                    <div className="tags-input-modern">
                      <input
                        type="text"
                        className="form-control-modern"
                        value={editableData.tags?.join(', ') || ''}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        placeholder="algorithm, recursion, fibonacci, mathematics..."
                      />
                      <div className="tags-preview-modern">
                        {editableData.tags?.map((tag, index) => (
                          <span key={index} className="tag-preview-pill">
                            {tag}
                            <button
                              type="button"
                              onClick={() => {
                                const newTags = editableData.tags?.filter((_, i) => i !== index) || [];
                                handleEditableChange('tags', newTags);
                              }}
                              className="tag-remove-btn"
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </span>
                        )) || []}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group-modern full-width">
                    <label className="form-label-modern">
                      <div className="label-icon">
                        <i className="bi bi-file-text"></i>
                      </div>
                      <div className="label-content">
                        <span className="label-text">Documentation & Explanation</span>
                      </div>
                    </label>
                    <textarea
                      className="form-control-modern textarea-modern"
                      rows={6}
                      value={editableData.docs || ''}
                      onChange={(e) => handleEditableChange('docs', e.target.value)}
                      placeholder="Detailed explanation of how the code works..."
                    />
                    <div className="form-hint">
                      <i className="bi bi-info-circle"></i>
                      You can use Markdown formatting for better documentation
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Submit */}
      {generatedData && (
        <div className="step-section final">
          <div className="step-header">
            <div className="step-number">
              <i className="bi bi-rocket"></i>
              <div className="step-number-text">3</div>
            </div>
            <div className="step-content">
              <h6 className="step-title">Save Your Snippet</h6>
              <p className="step-description">Ready to add this beautifully organized snippet to your collection</p>
            </div>
          </div>
          
          <div className="final-submit-section-modern">
            <div className="submit-preview">
              <div className="preview-summary">
                <div className="summary-item">
                  <i className="bi bi-check-circle text-success"></i>
                  <span>Title: <strong>{editableData.title}</strong></span>
                </div>
                <div className="summary-item">
                  <i className="bi bi-check-circle text-success"></i>
                  <span>Language: <strong>{editableData.language}</strong></span>
                </div>
                <div className="summary-item">
                  <i className="bi bi-check-circle text-success"></i>
                  <span>Tags: <strong>{editableData.tags?.length || 0} tags</strong></span>
                </div>
                <div className="summary-item">
                  <i className="bi bi-check-circle text-success"></i>
                  <span>Documentation: <strong>AI Generated</strong></span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              className="btn-save-modern"
            >
              <div className="btn-icon">
                <i className="bi bi-save"></i>
              </div>
              <div className="btn-content">
                <span className="btn-main-text">
                  {inEdit ? 'Update Snippet' : 'Save Snippet'}
                </span>
                <span className="btn-sub-text">
                  Add to your collection
                </span>
              </div>
              <div className="btn-arrow">
                <i className="bi bi-arrow-right"></i>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

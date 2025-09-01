import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../UI';

interface CodeConversionResult {
  convertedCode: string;
  sourceLanguage: string;
  targetLanguage: string;
  conversionNotes: string[];
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
  equivalentLibraries?: { [key: string]: string };
}

interface LanguageFeatureComparison {
  feature: string;
  sourceImplementation: string;
  targetImplementation: string;
  notes: string;
}

interface CodeConverterProps {
  code: string;
  language: string;
}

const POPULAR_LANGUAGES = [
  'javascript', 'python', 'java', 'typescript', 'csharp', 'cpp', 'c', 'go', 
  'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'dart', 'r', 'sql'
];

const CodeConverter: React.FC<CodeConverterProps> = ({ code, language }) => {
  const [conversion, setConversion] = useState<CodeConversionResult | null>(null);
  const [comparison, setComparison] = useState<LanguageFeatureComparison[]>([]);
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState<string>('');
  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'convert' | 'compare'>('convert');

  const convertCode = async () => {
    if (!selectedTargetLanguage) {
      setError('Please select a target language');
      return;
    }

    setLoading('convert');
    setError('');

    try {
      const response = await axios.post('/api/ai/convert-code', {
        code,
        sourceLanguage: language,
        targetLanguage: selectedTargetLanguage
      });

      if (response.data.success) {
        setConversion(response.data);
        setActiveTab('convert');
      } else {
        setError(response.data.error || 'Failed to convert code');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to AI service');
    } finally {
      setLoading('');
    }
  };

  const compareLanguages = async () => {
    if (!selectedTargetLanguage) {
      setError('Please select a target language');
      return;
    }

    setLoading('compare');
    setError('');

    try {
      const response = await axios.post('/api/ai/compare-languages', {
        sourceLanguage: language,
        targetLanguage: selectedTargetLanguage
      });

      if (response.data.success) {
        setComparison(response.data.comparison);
        setActiveTab('compare');
      } else {
        setError(response.data.error || 'Failed to compare languages');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to AI service');
    } finally {
      setLoading('');
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: 'success',
      medium: 'warning',
      low: 'danger'
    };
    return `badge bg-${colors[confidence as keyof typeof colors] || 'secondary'}`;
  };

  const getLanguageDisplayName = (lang: string) => {
    const displayNames: { [key: string]: string } = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'java': 'Java',
      'csharp': 'C#',
      'cpp': 'C++',
      'c': 'C',
      'go': 'Go',
      'rust': 'Rust',
      'php': 'PHP',
      'ruby': 'Ruby',
      'swift': 'Swift',
      'kotlin': 'Kotlin',
      'scala': 'Scala',
      'dart': 'Dart',
      'r': 'R',
      'sql': 'SQL'
    };
    return displayNames[lang.toLowerCase()] || lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  const availableLanguages = POPULAR_LANGUAGES.filter(lang => 
    lang.toLowerCase() !== language.toLowerCase()
  );

  return (
    <div className="code-converter-modern">
      <div className="converter-header">
        <div className="header-content">
          <h6 className="converter-title">
            <i className="bi bi-arrow-left-right"></i>
            AI Code Converter
          </h6>
          <div className="converter-controls">
            <div className="language-selector">
              <label className="selector-label">Target Language</label>
              <select 
                className="language-select" 
                value={selectedTargetLanguage}
                onChange={(e) => setSelectedTargetLanguage(e.target.value)}
              >
                <option value="">Choose language...</option>
                {availableLanguages.map(lang => (
                  <option key={lang} value={lang}>
                    {getLanguageDisplayName(lang)}
                  </option>
                ))}
              </select>
            </div>
            <div className="action-buttons">
              <button
                className="btn-converter convert-btn"
                onClick={convertCode}
                disabled={loading !== '' || !selectedTargetLanguage}
              >
                {loading === 'convert' ? (
                  <>
                    <span className="spinner"></span>
                    Converting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-code-slash"></i>
                    Convert
                  </>
                )}
              </button>
              <button
                className="btn-converter compare-btn"
                onClick={compareLanguages}
                disabled={loading !== '' || !selectedTargetLanguage}
              >
                {loading === 'compare' ? (
                  <>
                    <span className="spinner"></span>
                    Comparing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-list-columns-reverse"></i>
                    Compare
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle"></i>
            {error}
          </div>
        )}
      </div>

      {/* Modern Navigation Tabs */}
      {(conversion || comparison.length > 0) && (
        <div className="tabs-container">
          <div className="tab-nav">
            <button
              className={`tab-button ${activeTab === 'convert' ? 'active' : ''} ${!conversion ? 'disabled' : ''}`}
              onClick={() => setActiveTab('convert')}
              disabled={!conversion}
            >
              <i className="bi bi-code-square"></i>
              <span>Converted Code</span>
              {conversion && (
                <span className={`confidence-badge ${conversion.confidence}`}>
                  {conversion.confidence}
                </span>
              )}
            </button>
            <button
              className={`tab-button ${activeTab === 'compare' ? 'active' : ''} ${comparison.length === 0 ? 'disabled' : ''}`}
              onClick={() => setActiveTab('compare')}
              disabled={comparison.length === 0}
            >
              <i className="bi bi-graph-up"></i>
              <span>Language Comparison</span>
              {comparison.length > 0 && (
                <span className="count-badge">
                  {comparison.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Convert Tab Content */}
      {activeTab === 'convert' && conversion && (
        <div className="tab-content convert-content">
          <div className="conversion-flow">
            <div className="flow-item source">
              <div className="flow-header">
                <span className="language-label">
                  {getLanguageDisplayName(conversion.sourceLanguage)}
                </span>
                <span className="flow-type">Source</span>
              </div>
            </div>
            <div className="flow-arrow">
              <i className="bi bi-arrow-right"></i>
            </div>
            <div className="flow-item target">
              <div className="flow-header">
                <span className="language-label">
                  {getLanguageDisplayName(conversion.targetLanguage)}
                </span>
                <span className="flow-type">Target</span>
              </div>
            </div>
          </div>

          <div className="code-comparison">
            <div className="code-panel original">
              <div className="panel-header">
                <h6>Original Code</h6>
                <span className="language-badge">
                  {getLanguageDisplayName(conversion.sourceLanguage)}
                </span>
              </div>
              <div className="code-container">
                <pre><code>{code}</code></pre>
              </div>
            </div>
            
            <div className="code-panel converted">
              <div className="panel-header">
                <h6>Converted Code</h6>
                <div className="panel-meta">
                  <span className="language-badge success">
                    {getLanguageDisplayName(conversion.targetLanguage)}
                  </span>
                  <span className={`confidence-indicator ${conversion.confidence}`}>
                    <i className="bi bi-shield-check"></i>
                    {conversion.confidence} confidence
                  </span>
                </div>
              </div>
              <div className="code-container">
                <pre><code>{conversion.convertedCode}</code></pre>
              </div>
            </div>
          </div>

          {conversion.conversionNotes.length > 0 && (
            <div className="info-section notes">
              <div className="section-header">
                <i className="bi bi-info-circle"></i>
                Conversion Notes
              </div>
              <div className="notes-list">
                {conversion.conversionNotes.map((note, index) => (
                  <div key={index} className="note-item">
                    <i className="bi bi-lightbulb"></i>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {conversion.warnings.length > 0 && (
            <div className="info-section warnings">
              <div className="section-header">
                <i className="bi bi-exclamation-triangle"></i>
                Warnings
              </div>
              <div className="warnings-list">
                {conversion.warnings.map((warning, index) => (
                  <div key={index} className="warning-item">
                    <i className="bi bi-shield-exclamation"></i>
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {conversion.equivalentLibraries && Object.keys(conversion.equivalentLibraries).length > 0 && (
            <div className="info-section libraries">
              <div className="section-header">
                <i className="bi bi-boxes"></i>
                Library Equivalents
              </div>
              <div className="libraries-grid">
                {Object.entries(conversion.equivalentLibraries).map(([sourceLib, targetLib]) => (
                  <div key={sourceLib} className="library-mapping">
                    <div className="source-lib">
                      <code>{sourceLib}</code>
                      <span className="lib-type">Source</span>
                    </div>
                    <i className="bi bi-arrow-right mapping-arrow"></i>
                    <div className="target-lib">
                      <code>{targetLib}</code>
                      <span className="lib-type">Target</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compare Tab Content */}
      {activeTab === 'compare' && comparison.length > 0 && (
        <div className="tab-content compare-content">
          <div className="comparison-header">
            <h6>
              Feature Comparison: {getLanguageDisplayName(language)} vs {getLanguageDisplayName(selectedTargetLanguage)}
            </h6>
          </div>

          <div className="features-grid">
            {comparison.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-header">
                  <h6 className="feature-title">{feature.feature}</h6>
                </div>
                <div className="feature-comparison">
                  <div className="implementation source-impl">
                    <div className="impl-header">
                      <span className="impl-language">{getLanguageDisplayName(language)}</span>
                    </div>
                    <div className="impl-content">
                      {feature.sourceImplementation}
                    </div>
                  </div>
                  <div className="comparison-divider">
                    <i className="bi bi-arrow-left-right"></i>
                  </div>
                  <div className="implementation target-impl">
                    <div className="impl-header">
                      <span className="impl-language">{getLanguageDisplayName(selectedTargetLanguage)}</span>
                    </div>
                    <div className="impl-content">
                      {feature.targetImplementation}
                    </div>
                  </div>
                </div>
                {feature.notes && (
                  <div className="feature-notes">
                    <i className="bi bi-sticky"></i>
                    <span>{feature.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!conversion && comparison.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bi bi-code-slash"></i>
          </div>
          <h6>Ready to Convert Code</h6>
          <p>Select a target language and choose a conversion option to get started</p>
          <div className="options-guide">
            <div className="option-item">
              <i className="bi bi-code-square"></i>
              <div>
                <strong>Convert</strong>
                <span>Transform your code to another language</span>
              </div>
            </div>
            <div className="option-item">
              <i className="bi bi-graph-up"></i>
              <div>
                <strong>Compare</strong>
                <span>Analyze differences between languages</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeConverter;

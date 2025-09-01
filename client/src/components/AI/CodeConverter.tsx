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
    <div className="code-converter">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="mb-0">🔄 AI Code Converter</h6>
        <div className="d-flex align-items-center">
          <select 
            className="form-select form-select-sm me-2" 
            style={{ width: 'auto', minWidth: '150px' }}
            value={selectedTargetLanguage}
            onChange={(e) => setSelectedTargetLanguage(e.target.value)}
          >
            <option value="">Select target language</option>
            {availableLanguages.map(lang => (
              <option key={lang} value={lang}>
                {getLanguageDisplayName(lang)}
              </option>
            ))}
          </select>
          <div className="btn-group" role="group">
            <Button
              text={loading === 'convert' ? 'Converting...' : 'Convert'}
              color="primary"
              outline={true}
              small={true}
              handler={convertCode}
              disabled={loading !== '' || !selectedTargetLanguage}
            />
            <Button
              text={loading === 'compare' ? 'Comparing...' : 'Compare'}
              color="info"
              outline={true}
              small={true}
              handler={compareLanguages}
              disabled={loading !== '' || !selectedTargetLanguage}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning alert-sm mb-3">
          <small>{error}</small>
        </div>
      )}

      {/* Navigation Tabs */}
      {(conversion || comparison.length > 0) && (
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'convert' ? 'active' : ''}`}
              onClick={() => setActiveTab('convert')}
              disabled={!conversion}
            >
              Converted Code
              {conversion && (
                <span className={`badge ms-1 ${getConfidenceBadge(conversion.confidence)}`}>
                  {conversion.confidence}
                </span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'compare' ? 'active' : ''}`}
              onClick={() => setActiveTab('compare')}
              disabled={comparison.length === 0}
            >
              Language Comparison
              {comparison.length > 0 && (
                <span className="badge bg-secondary ms-1">
                  {comparison.length}
                </span>
              )}
            </button>
          </li>
        </ul>
      )}

      {/* Convert Tab */}
      {activeTab === 'convert' && conversion && (
        <div className="conversion-result">
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="text-center">
                <div className="h6 mb-1">
                  {getLanguageDisplayName(conversion.sourceLanguage)}
                </div>
                <small className="text-muted">Source</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="h4 mb-1">→</div>
                <small className="text-muted">Converted to</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="h6 mb-1">
                  {getLanguageDisplayName(conversion.targetLanguage)}
                </div>
                <small className="text-muted">Target</small>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <h6 className="text-muted">Original Code ({getLanguageDisplayName(conversion.sourceLanguage)})</h6>
              <pre className="bg-light p-3 rounded border" style={{ maxHeight: '400px', overflow: 'auto' }}>
                <code>{code}</code>
              </pre>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-success mb-0">
                  Converted Code ({getLanguageDisplayName(conversion.targetLanguage)})
                </h6>
                <span className={getConfidenceBadge(conversion.confidence)}>
                  {conversion.confidence} confidence
                </span>
              </div>
              <pre className="bg-light p-3 rounded border border-success" style={{ maxHeight: '400px', overflow: 'auto' }}>
                <code>{conversion.convertedCode}</code>
              </pre>
            </div>
          </div>

          {conversion.conversionNotes.length > 0 && (
            <div className="mb-3">
              <h6>Conversion Notes</h6>
              <ul className="list-group">
                {conversion.conversionNotes.map((note, index) => (
                  <li key={index} className="list-group-item">
                    <i className="text-info">ℹ️</i> {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {conversion.warnings.length > 0 && (
            <div className="mb-3">
              <h6 className="text-warning">Warnings</h6>
              <ul className="list-group">
                {conversion.warnings.map((warning, index) => (
                  <li key={index} className="list-group-item list-group-item-warning">
                    <i className="text-warning">⚠️</i> {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {conversion.equivalentLibraries && Object.keys(conversion.equivalentLibraries).length > 0 && (
            <div className="mb-3">
              <h6>Library Equivalents</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>{getLanguageDisplayName(conversion.sourceLanguage)}</th>
                      <th>{getLanguageDisplayName(conversion.targetLanguage)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(conversion.equivalentLibraries).map(([sourceLib, targetLib]) => (
                      <tr key={sourceLib}>
                        <td><code>{sourceLib}</code></td>
                        <td><code>{targetLib}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Compare Tab */}
      {activeTab === 'compare' && comparison.length > 0 && (
        <div className="language-comparison">
          <div className="mb-3">
            <h6>
              Language Feature Comparison: {getLanguageDisplayName(language)} vs {getLanguageDisplayName(selectedTargetLanguage)}
            </h6>
          </div>

          {comparison.map((feature, index) => (
            <div key={index} className="card mb-3">
              <div className="card-header">
                <h6 className="mb-0">{feature.feature}</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary">{getLanguageDisplayName(language)}</h6>
                    <p className="text-muted">{feature.sourceImplementation}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-success">{getLanguageDisplayName(selectedTargetLanguage)}</h6>
                    <p className="text-muted">{feature.targetImplementation}</p>
                  </div>
                </div>
                {feature.notes && (
                  <div className="border-top pt-2">
                    <small><strong>Notes:</strong> {feature.notes}</small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!conversion && comparison.length === 0 && !loading && (
        <div className="text-center text-muted py-4">
          <p>Select a target language and choose a conversion option</p>
          <ul className="list-unstyled">
            <li><strong>Convert:</strong> Get the code converted to another language</li>
            <li><strong>Compare:</strong> See feature differences between languages</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CodeConverter;

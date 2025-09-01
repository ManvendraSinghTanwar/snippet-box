import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../UI';

interface OptimizationSuggestion {
  type: 'performance' | 'readability' | 'security' | 'best-practice' | 'bug-fix';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  suggestion: string;
  originalCode: string;
  optimizedCode?: string;
  lineNumber?: number;
}

interface CodeOptimizationResult {
  overallScore: number;
  issues: OptimizationSuggestion[];
  summary: string;
  complexity: 'low' | 'medium' | 'high';
  maintainability: 'poor' | 'fair' | 'good' | 'excellent';
}

interface SecurityAnalysisResult {
  securityIssues: OptimizationSuggestion[];
  riskLevel: 'low' | 'medium' | 'high';
  issueCount: number;
}

interface OptimizedCodeResult {
  optimizedCode: string;
  originalCode: string;
  focusArea: string;
}

interface CodeOptimizerProps {
  code: string;
  language: string;
}

const CodeOptimizer: React.FC<CodeOptimizerProps> = ({ code, language }) => {
  const [optimization, setOptimization] = useState<CodeOptimizationResult | null>(null);
  const [securityAnalysis, setSecurityAnalysis] = useState<SecurityAnalysisResult | null>(null);
  const [optimizedCode, setOptimizedCode] = useState<OptimizedCodeResult | null>(null);
  const [loading, setLoading] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'analysis' | 'security' | 'optimized'>('analysis');

  const analyzeCode = async () => {
    setLoading('analysis');
    setError('');

    try {
      const response = await axios.post('/api/ai/optimize', {
        code,
        language
      });

      if (response.data.success) {
        setOptimization(response.data);
        setActiveTab('analysis');
      } else {
        setError(response.data.error || 'Failed to analyze code');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to AI service');
    } finally {
      setLoading('');
    }
  };

  const scanSecurity = async () => {
    setLoading('security');
    setError('');

    try {
      const response = await axios.post('/api/ai/security-scan', {
        code,
        language
      });

      if (response.data.success) {
        setSecurityAnalysis(response.data);
        setActiveTab('security');
      } else {
        setError(response.data.error || 'Failed to analyze security');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to AI service');
    } finally {
      setLoading('');
    }
  };

  const generateOptimizedCode = async (focusArea?: string) => {
    setLoading('optimized');
    setError('');

    try {
      const response = await axios.post('/api/ai/optimize-code', {
        code,
        language,
        focusArea
      });

      if (response.data.success) {
        setOptimizedCode(response.data);
        setActiveTab('optimized');
      } else {
        setError(response.data.error || 'Failed to generate optimized code');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to AI service');
    } finally {
      setLoading('');
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      critical: 'danger'
    };
    return `badge bg-${colors[severity as keyof typeof colors] || 'secondary'}`;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      performance: 'primary',
      readability: 'info',
      security: 'danger',
      'best-practice': 'warning',
      'bug-fix': 'danger'
    };
    return `badge bg-${colors[type as keyof typeof colors] || 'secondary'}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getMaintainabilityColor = (level: string) => {
    const colors = {
      excellent: 'text-success',
      good: 'text-success',
      fair: 'text-warning',
      poor: 'text-danger'
    };
    return colors[level as keyof typeof colors] || 'text-muted';
  };

  return (
    <div className="code-optimizer">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="mb-0">🚀 AI Code Optimization</h6>
        <div className="btn-group" role="group">
          <Button
            text={loading === 'analysis' ? 'Analyzing...' : 'Analyze Code'}
            color="primary"
            outline={true}
            small={true}
            handler={analyzeCode}
            disabled={loading !== ''}
          />
          <Button
            text={loading === 'security' ? 'Scanning...' : 'Security Scan'}
            color="danger"
            outline={true}
            small={true}
            handler={scanSecurity}
            disabled={loading !== ''}
          />
          <Button
            text={loading === 'optimized' ? 'Optimizing...' : 'Optimize'}
            color="success"
            outline={true}
            small={true}
            handler={() => generateOptimizedCode()}
            disabled={loading !== ''}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-warning alert-sm mb-3">
          <small>{error}</small>
        </div>
      )}

      {/* Navigation Tabs */}
      {(optimization || securityAnalysis || optimizedCode) && (
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
              disabled={!optimization}
            >
              Analysis {optimization && (
                <span className={`badge bg-secondary ms-1`}>
                  {optimization.issues.length}
                </span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
              disabled={!securityAnalysis}
            >
              Security {securityAnalysis && (
                <span className={`badge bg-${securityAnalysis.riskLevel === 'high' ? 'danger' : securityAnalysis.riskLevel === 'medium' ? 'warning' : 'success'} ms-1`}>
                  {securityAnalysis.issueCount}
                </span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'optimized' ? 'active' : ''}`}
              onClick={() => setActiveTab('optimized')}
              disabled={!optimizedCode}
            >
              Optimized Code
            </button>
          </li>
        </ul>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && optimization && (
        <div className="optimization-analysis">
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="text-center">
                <div className={`h4 mb-1 ${getScoreColor(optimization.overallScore)}`}>
                  {optimization.overallScore}/100
                </div>
                <small className="text-muted">Overall Score</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="h6 mb-1 text-capitalize">
                  {optimization.complexity}
                </div>
                <small className="text-muted">Complexity</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className={`h6 mb-1 text-capitalize ${getMaintainabilityColor(optimization.maintainability)}`}>
                  {optimization.maintainability}
                </div>
                <small className="text-muted">Maintainability</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="h6 mb-1">
                  {optimization.issues.length}
                </div>
                <small className="text-muted">Issues Found</small>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h6>Summary</h6>
            <p className="text-muted mb-0">{optimization.summary}</p>
          </div>

          {optimization.issues.length > 0 && (
            <div>
              <h6>Issues & Suggestions</h6>
              {optimization.issues.map((issue, index) => (
                <div key={index} className="card mb-2">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title mb-0">{issue.title}</h6>
                      <div>
                        <span className={getTypeBadge(issue.type)}>{issue.type}</span>
                        <span className={`${getSeverityBadge(issue.severity)} ms-1`}>{issue.severity}</span>
                      </div>
                    </div>
                    <p className="card-text text-muted mb-2">{issue.description}</p>
                    <div className="mb-2">
                      <strong>Suggestion:</strong> {issue.suggestion}
                    </div>
                    {issue.originalCode && (
                      <div className="mb-2">
                        <small className="text-muted">Problematic code:</small>
                        <pre className="bg-light p-2 rounded"><code>{issue.originalCode}</code></pre>
                      </div>
                    )}
                    {issue.optimizedCode && (
                      <div>
                        <small className="text-success">Improved code:</small>
                        <pre className="bg-light p-2 rounded border-start border-success border-3"><code>{issue.optimizedCode}</code></pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && securityAnalysis && (
        <div className="security-analysis">
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="text-center">
                <div className={`h4 mb-1 ${securityAnalysis.riskLevel === 'high' ? 'text-danger' : securityAnalysis.riskLevel === 'medium' ? 'text-warning' : 'text-success'}`}>
                  {securityAnalysis.riskLevel.toUpperCase()}
                </div>
                <small className="text-muted">Risk Level</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="h4 mb-1">
                  {securityAnalysis.issueCount}
                </div>
                <small className="text-muted">Security Issues</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className={`h4 mb-1 ${securityAnalysis.issueCount === 0 ? 'text-success' : 'text-warning'}`}>
                  {securityAnalysis.issueCount === 0 ? '✓' : '⚠'}
                </div>
                <small className="text-muted">Security Status</small>
              </div>
            </div>
          </div>

          {securityAnalysis.securityIssues.length > 0 ? (
            <div>
              <h6>Security Vulnerabilities</h6>
              {securityAnalysis.securityIssues.map((issue, index) => (
                <div key={index} className="card mb-2 border-danger">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title mb-0 text-danger">
                        🔒 {issue.title}
                      </h6>
                      <span className={getSeverityBadge(issue.severity)}>{issue.severity}</span>
                    </div>
                    <p className="card-text text-muted mb-2">{issue.description}</p>
                    <div className="mb-2">
                      <strong className="text-danger">Security Fix:</strong> {issue.suggestion}
                    </div>
                    {issue.originalCode && (
                      <div className="mb-2">
                        <small className="text-danger">Vulnerable code:</small>
                        <pre className="bg-light p-2 rounded border-start border-danger border-3"><code>{issue.originalCode}</code></pre>
                      </div>
                    )}
                    {issue.optimizedCode && (
                      <div>
                        <small className="text-success">Secure code:</small>
                        <pre className="bg-light p-2 rounded border-start border-success border-3"><code>{issue.optimizedCode}</code></pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-success">
              <h6 className="alert-heading">🛡️ No Security Issues Found</h6>
              <p className="mb-0">The code appears to follow security best practices. However, always consider additional security measures in production environments.</p>
            </div>
          )}
        </div>
      )}

      {/* Optimized Code Tab */}
      {activeTab === 'optimized' && optimizedCode && (
        <div className="optimized-code">
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6>Optimized Code</h6>
              <div className="btn-group" role="group">
                <Button
                  text="Performance"
                  color="primary"
                  outline={true}
                  small={true}
                  handler={() => generateOptimizedCode('performance')}
                  disabled={loading !== ''}
                />
                <Button
                  text="Readability"
                  color="info"
                  outline={true}
                  small={true}
                  handler={() => generateOptimizedCode('readability')}
                  disabled={loading !== ''}
                />
                <Button
                  text="Security"
                  color="danger"
                  outline={true}
                  small={true}
                  handler={() => generateOptimizedCode('security')}
                  disabled={loading !== ''}
                />
              </div>
            </div>
            <small className="text-muted">Focus Area: {optimizedCode.focusArea}</small>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h6 className="text-muted">Original Code</h6>
              <pre className="bg-light p-3 rounded border" style={{ maxHeight: '400px', overflow: 'auto' }}>
                <code>{optimizedCode.originalCode}</code>
              </pre>
            </div>
            <div className="col-md-6">
              <h6 className="text-success">Optimized Code</h6>
              <pre className="bg-light p-3 rounded border border-success" style={{ maxHeight: '400px', overflow: 'auto' }}>
                <code>{optimizedCode.optimizedCode}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {!optimization && !securityAnalysis && !optimizedCode && !loading && (
        <div className="text-center text-muted py-4">
          <p>Select an optimization option above to analyze your code</p>
          <ul className="list-unstyled">
            <li><strong>Analyze Code:</strong> Get comprehensive optimization suggestions</li>
            <li><strong>Security Scan:</strong> Identify potential security vulnerabilities</li>
            <li><strong>Optimize:</strong> Generate an improved version of your code</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CodeOptimizer;

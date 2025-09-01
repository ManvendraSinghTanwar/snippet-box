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
      {/* Modern Header */}
      <div className="optimizer-header">
        <div className="optimizer-title">
          <div className="title-icon">
            <i className="bi bi-cpu"></i>
          </div>
          <div className="title-content">
            <h5 className="title-text">AI Code Optimization</h5>
            <p className="title-subtitle">Analyze, secure, and optimize your code with AI</p>
          </div>
        </div>
        
        <div className="optimizer-actions">
          <button
            className={`action-btn ${loading === 'analysis' ? 'loading' : ''}`}
            onClick={analyzeCode}
            disabled={loading !== ''}
          >
            <i className="bi bi-graph-up"></i>
            <span>{loading === 'analysis' ? 'Analyzing...' : 'Analyze'}</span>
            {loading === 'analysis' && <div className="spinner"></div>}
          </button>
          
          <button
            className={`action-btn security ${loading === 'security' ? 'loading' : ''}`}
            onClick={scanSecurity}
            disabled={loading !== ''}
          >
            <i className="bi bi-shield-check"></i>
            <span>{loading === 'security' ? 'Scanning...' : 'Security'}</span>
            {loading === 'security' && <div className="spinner"></div>}
          </button>
          
          <button
            className={`action-btn optimize ${loading === 'optimized' ? 'loading' : ''}`}
            onClick={() => generateOptimizedCode()}
            disabled={loading !== ''}
          >
            <i className="bi bi-lightning"></i>
            <span>{loading === 'optimized' ? 'Optimizing...' : 'Optimize'}</span>
            {loading === 'optimized' && <div className="spinner"></div>}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <i className="bi bi-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Modern Navigation Tabs */}
      {(optimization || securityAnalysis || optimizedCode) && (
        <div className="optimizer-tabs">
          <div className="tab-list">
            <button
              className={`tab-item ${activeTab === 'analysis' ? 'active' : ''} ${!optimization ? 'disabled' : ''}`}
              onClick={() => setActiveTab('analysis')}
              disabled={!optimization}
            >
              <i className="bi bi-graph-up-arrow"></i>
              <span>Analysis</span>
              {optimization && (
                <div className="tab-badge">
                  {optimization.issues.length}
                </div>
              )}
            </button>
            
            <button
              className={`tab-item ${activeTab === 'security' ? 'active' : ''} ${!securityAnalysis ? 'disabled' : ''}`}
              onClick={() => setActiveTab('security')}
              disabled={!securityAnalysis}
            >
              <i className="bi bi-shield-lock"></i>
              <span>Security</span>
              {securityAnalysis && (
                <div className={`tab-badge ${securityAnalysis.riskLevel === 'high' ? 'danger' : securityAnalysis.riskLevel === 'medium' ? 'warning' : 'success'}`}>
                  {securityAnalysis.issueCount}
                </div>
              )}
            </button>
            
            <button
              className={`tab-item ${activeTab === 'optimized' ? 'active' : ''} ${!optimizedCode ? 'disabled' : ''}`}
              onClick={() => setActiveTab('optimized')}
              disabled={!optimizedCode}
            >
              <i className="bi bi-code-slash"></i>
              <span>Optimized</span>
            </button>
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && optimization && (
        <div className="tab-content analysis-content">
          <div className="metrics-grid">
            <div className="metric-card score">
              <div className="metric-icon">
                <i className="bi bi-speedometer2"></i>
              </div>
              <div className="metric-content">
                <div className={`metric-value ${getScoreColor(optimization.overallScore)}`}>
                  {optimization.overallScore}<span className="metric-unit">/100</span>
                </div>
                <div className="metric-label">Overall Score</div>
              </div>
            </div>
            
            <div className="metric-card complexity">
              <div className="metric-icon">
                <i className="bi bi-diagram-3"></i>
              </div>
              <div className="metric-content">
                <div className="metric-value text-capitalize">
                  {optimization.complexity}
                </div>
                <div className="metric-label">Complexity</div>
              </div>
            </div>
            
            <div className="metric-card maintainability">
              <div className="metric-icon">
                <i className="bi bi-gear"></i>
              </div>
              <div className="metric-content">
                <div className={`metric-value text-capitalize ${getMaintainabilityColor(optimization.maintainability)}`}>
                  {optimization.maintainability}
                </div>
                <div className="metric-label">Maintainability</div>
              </div>
            </div>
            
            <div className="metric-card issues">
              <div className="metric-icon">
                <i className="bi bi-bug"></i>
              </div>
              <div className="metric-content">
                <div className="metric-value">
                  {optimization.issues.length}
                </div>
                <div className="metric-label">Issues Found</div>
              </div>
            </div>
          </div>

          <div className="summary-section">
            <div className="section-header">
              <i className="bi bi-file-text"></i>
              <h6>Summary</h6>
            </div>
            <div className="summary-content">
              {optimization.summary}
            </div>
          </div>

          {optimization.issues.length > 0 && (
            <div className="issues-section">
              <div className="section-header">
                <i className="bi bi-list-check"></i>
                <h6>Issues & Suggestions</h6>
                <div className="issue-count">{optimization.issues.length} issues</div>
              </div>
              
              <div className="issues-list">
                {optimization.issues.map((issue, index) => (
                  <div key={index} className="issue-card">
                    <div className="issue-header">
                      <div className="issue-title">
                        <i className={`bi ${issue.type === 'performance' ? 'bi-speedometer' : issue.type === 'security' ? 'bi-shield-exclamation' : issue.type === 'readability' ? 'bi-eye' : issue.type === 'best-practice' ? 'bi-star' : 'bi-bug'}`}></i>
                        <span>{issue.title}</span>
                      </div>
                      <div className="issue-badges">
                        <span className={`type-badge ${issue.type}`}>{issue.type}</span>
                        <span className={`severity-badge ${issue.severity}`}>{issue.severity}</span>
                      </div>
                    </div>
                    
                    <div className="issue-description">
                      {issue.description}
                    </div>
                    
                    <div className="issue-suggestion">
                      <div className="suggestion-label">
                        <i className="bi bi-lightbulb"></i>
                        <span>Suggestion</span>
                      </div>
                      <div className="suggestion-text">{issue.suggestion}</div>
                    </div>
                    
                    {issue.originalCode && (
                      <div className="code-section">
                        <div className="code-label problematic">
                          <i className="bi bi-x-circle"></i>
                          <span>Problematic code</span>
                        </div>
                        <div className="code-block original">
                          <pre><code>{issue.originalCode}</code></pre>
                        </div>
                      </div>
                    )}
                    
                    {issue.optimizedCode && (
                      <div className="code-section">
                        <div className="code-label improved">
                          <i className="bi bi-check-circle"></i>
                          <span>Improved code</span>
                        </div>
                        <div className="code-block optimized">
                          <pre><code>{issue.optimizedCode}</code></pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && securityAnalysis && (
        <div className="tab-content security-content">
          <div className="security-overview">
            <div className="security-metric-card">
              <div className="security-icon">
                <i className={`bi ${securityAnalysis.riskLevel === 'high' ? 'bi-shield-x' : securityAnalysis.riskLevel === 'medium' ? 'bi-shield-exclamation' : 'bi-shield-check'}`}></i>
              </div>
              <div className="security-info">
                <div className={`risk-level ${securityAnalysis.riskLevel}`}>
                  {securityAnalysis.riskLevel.toUpperCase()} RISK
                </div>
                <div className="security-stats">
                  <span className="issue-count">{securityAnalysis.issueCount}</span>
                  <span className="issue-label">security {securityAnalysis.issueCount === 1 ? 'issue' : 'issues'} found</span>
                </div>
              </div>
              <div className="security-status">
                <div className={`status-indicator ${securityAnalysis.issueCount === 0 ? 'safe' : 'warning'}`}>
                  <i className={`bi ${securityAnalysis.issueCount === 0 ? 'bi-check-circle' : 'bi-exclamation-triangle'}`}></i>
                </div>
              </div>
            </div>
          </div>

          {securityAnalysis.securityIssues.length > 0 ? (
            <div className="security-issues-section">
              <div className="section-header">
                <i className="bi bi-shield-exclamation"></i>
                <h6>Security Vulnerabilities</h6>
                <div className="vulnerability-count">{securityAnalysis.securityIssues.length} vulnerabilities</div>
              </div>
              
              <div className="security-issues-list">
                {securityAnalysis.securityIssues.map((issue, index) => (
                  <div key={index} className="security-issue-card">
                    <div className="security-issue-header">
                      <div className="security-issue-title">
                        <i className="bi bi-shield-exclamation"></i>
                        <span>{issue.title}</span>
                      </div>
                      <div className={`security-severity-badge ${issue.severity}`}>
                        <i className={`bi ${issue.severity === 'critical' ? 'bi-exclamation-triangle-fill' : issue.severity === 'high' ? 'bi-exclamation-triangle' : issue.severity === 'medium' ? 'bi-exclamation-circle' : 'bi-info-circle'}`}></i>
                        <span>{issue.severity}</span>
                      </div>
                    </div>
                    
                    <div className="security-issue-description">
                      {issue.description}
                    </div>
                    
                    <div className="security-fix-section">
                      <div className="fix-label">
                        <i className="bi bi-shield-check"></i>
                        <span>Security Fix</span>
                      </div>
                      <div className="fix-text">{issue.suggestion}</div>
                    </div>
                    
                    {issue.originalCode && (
                      <div className="code-section">
                        <div className="code-label vulnerable">
                          <i className="bi bi-shield-x"></i>
                          <span>Vulnerable code</span>
                        </div>
                        <div className="code-block vulnerable">
                          <pre><code>{issue.originalCode}</code></pre>
                        </div>
                      </div>
                    )}
                    
                    {issue.optimizedCode && (
                      <div className="code-section">
                        <div className="code-label secure">
                          <i className="bi bi-shield-check"></i>
                          <span>Secure code</span>
                        </div>
                        <div className="code-block secure">
                          <pre><code>{issue.optimizedCode}</code></pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="security-safe-state">
              <div className="safe-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <div className="safe-content">
                <h6>No Security Issues Found</h6>
                <p>The code appears to follow security best practices. However, always consider additional security measures in production environments.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optimized Code Tab */}
      {activeTab === 'optimized' && optimizedCode && (
        <div className="tab-content optimized-content">
          <div className="optimization-controls">
            <div className="controls-header">
              <div className="header-info">
                <i className="bi bi-lightning-charge"></i>
                <span>Code Optimization</span>
              </div>
              <div className="focus-area">
                <span className="focus-label">Focus:</span>
                <span className="focus-value">{optimizedCode.focusArea}</span>
              </div>
            </div>
            
            <div className="focus-buttons">
              <button
                className={`focus-btn performance ${loading === 'optimized' ? 'loading' : ''}`}
                onClick={() => generateOptimizedCode('performance')}
                disabled={loading !== ''}
              >
                <i className="bi bi-speedometer2"></i>
                <span>Performance</span>
              </button>
              
              <button
                className={`focus-btn readability ${loading === 'optimized' ? 'loading' : ''}`}
                onClick={() => generateOptimizedCode('readability')}
                disabled={loading !== ''}
              >
                <i className="bi bi-eye"></i>
                <span>Readability</span>
              </button>
              
              <button
                className={`focus-btn security ${loading === 'optimized' ? 'loading' : ''}`}
                onClick={() => generateOptimizedCode('security')}
                disabled={loading !== ''}
              >
                <i className="bi bi-shield-check"></i>
                <span>Security</span>
              </button>
            </div>
          </div>

          <div className="code-comparison">
            <div className="comparison-grid">
              <div className="code-panel original">
                <div className="panel-header">
                  <div className="panel-title">
                    <i className="bi bi-code"></i>
                    <span>Original Code</span>
                  </div>
                  <div className="panel-status original-status">
                    <i className="bi bi-circle"></i>
                    <span>Before</span>
                  </div>
                </div>
                <div className="code-container">
                  <pre className="code-block"><code>{optimizedCode.originalCode}</code></pre>
                </div>
              </div>
              
              <div className="comparison-arrow">
                <div className="arrow-icon">
                  <i className="bi bi-arrow-right"></i>
                </div>
                <div className="arrow-text">Optimized</div>
              </div>
              
              <div className="code-panel optimized">
                <div className="panel-header">
                  <div className="panel-title">
                    <i className="bi bi-code-slash"></i>
                    <span>Optimized Code</span>
                  </div>
                  <div className="panel-status optimized-status">
                    <i className="bi bi-check-circle"></i>
                    <span>After</span>
                  </div>
                </div>
                <div className="code-container">
                  <pre className="code-block"><code>{optimizedCode.optimizedCode}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!optimization && !securityAnalysis && !optimizedCode && !loading && (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bi bi-cpu"></i>
          </div>
          <div className="empty-content">
            <h6>Ready to Optimize Your Code</h6>
            <p>Select an optimization option above to get started with AI-powered code analysis</p>
          </div>
          <div className="feature-list">
            <div className="feature-item">
              <i className="bi bi-graph-up"></i>
              <div className="feature-text">
                <strong>Analyze Code</strong>
                <span>Get comprehensive optimization suggestions and code quality metrics</span>
              </div>
            </div>
            <div className="feature-item">
              <i className="bi bi-shield-check"></i>
              <div className="feature-text">
                <strong>Security Scan</strong>
                <span>Identify potential security vulnerabilities and get fixes</span>
              </div>
            </div>
            <div className="feature-item">
              <i className="bi bi-lightning"></i>
              <div className="feature-text">
                <strong>Optimize Code</strong>
                <span>Generate an improved version focused on specific areas</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeOptimizer;

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeViewerProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language,
  showLineNumbers = true,
  maxHeight = '400px'
}) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="code-viewer position-relative">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="badge bg-secondary">{language}</span>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={copyToClipboard}
          title="Copy to clipboard"
        >
          📋 Copy
        </button>
      </div>
      
      <div style={{ maxHeight, overflow: 'auto' }}>
        <SyntaxHighlighter
          language={language.toLowerCase()}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          wrapLongLines={true}
          customStyle={{
            margin: 0,
            borderRadius: '8px',
            fontSize: '14px'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

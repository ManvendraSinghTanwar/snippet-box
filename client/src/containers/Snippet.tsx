import { Fragment, useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { SnippetCode } from '../components/Snippets/SnippetCode';
import { Layout, PageHeader, Card } from '../components/UI';
import { SnippetsContext } from '../store';
import { SnippetDetails } from '../components/Snippets/SnippetDetails';
import { SnippetDocs } from '../components/Snippets/SnippetDocs';
import { AIExplainer, CodeOptimizer, CodeConverter } from '../components/AI';

interface Params {
  id: string;
}

export const Snippet = (): JSX.Element => {
  const { currentSnippet, getSnippetById } = useContext(SnippetsContext);
  const { id } = useParams<Params>();
  const [activeAITab, setActiveAITab] = useState<'explain' | 'optimize' | 'convert'>('explain');

  // Get previous location
  const location = useLocation<{ from: string }>();
  const { from } = location.state || '/snippets';

  useEffect(() => {
    getSnippetById(+id);
  }, []);

  return (
    <Layout>
      {!currentSnippet ? (
        <div className='col-12'>Loading...</div>
      ) : (
        <Fragment>
          <PageHeader title='' prevDest={from} />
          
          {/* Main Content Grid */}
          <div className='col-12'>
            <div className='snippet-view-container'>
              
              {/* Code Section */}
              <div className='snippet-code-section'>
                <div className='code-card-modern'>
                  <div className='code-header-modern'>
                    <div className='code-info'>
                      <h2 className='snippet-title-view'>{currentSnippet.title}</h2>
                      <div className='code-meta'>
                        <span className='language-badge-view'>{currentSnippet.language}</span>
                        <span className='code-lines'>{currentSnippet.code.split('\n').length} lines</span>
                      </div>
                    </div>
                    <div className='code-actions'>
                      <button 
                        className='btn-action-modern copy-btn'
                        onClick={() => {
                          navigator.clipboard.writeText(currentSnippet.code);
                        }}
                      >
                        <i className='bi bi-clipboard'></i>
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className='code-content-wrapper'>
                    <SnippetCode
                      code={currentSnippet.code}
                      language={currentSnippet.language}
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className='snippet-sidebar-section'>
                <SnippetDetails snippet={currentSnippet} />
              </div>
            </div>
          </div>
          
          {/* AI Features Section */}
          <div className='col-12 mt-4'>
            <div className='ai-section-modern'>
              <div className='ai-header-modern'>
                <h3 className='ai-title'>
                  <i className='bi bi-robot'></i>
                  AI-Powered Analysis
                </h3>
                <div className='ai-tabs-modern'>
                  <button
                    className={`ai-tab ${activeAITab === 'explain' ? 'active' : ''}`}
                    onClick={() => setActiveAITab('explain')}
                  >
                    <i className='bi bi-file-text'></i>
                    Explanation
                  </button>
                  <button
                    className={`ai-tab ${activeAITab === 'optimize' ? 'active' : ''}`}
                    onClick={() => setActiveAITab('optimize')}
                  >
                    <i className='bi bi-lightning'></i>
                    Optimization
                  </button>
                  <button
                    className={`ai-tab ${activeAITab === 'convert' ? 'active' : ''}`}
                    onClick={() => setActiveAITab('convert')}
                  >
                    <i className='bi bi-arrow-left-right'></i>
                    Convert
                  </button>
                </div>
              </div>
              
              <div className='ai-content-modern'>
                {activeAITab === 'explain' && (
                  <AIExplainer
                    code={currentSnippet.code}
                    language={currentSnippet.language}
                    aiExplanation={currentSnippet.aiExplanation}
                  />
                )}
                
                {activeAITab === 'optimize' && (
                  <CodeOptimizer
                    code={currentSnippet.code}
                    language={currentSnippet.language}
                  />
                )}
                
                {activeAITab === 'convert' && (
                  <CodeConverter
                    code={currentSnippet.code}
                    language={currentSnippet.language}
                  />
                )}
              </div>
            </div>
          </div>

          {currentSnippet.docs && (
            <div className='col-12 mt-4'>
              <div className='docs-section-modern'>
                <div className='docs-header'>
                  <h3 className='docs-title'>
                    <i className='bi bi-file-earmark-text'></i>
                    Documentation
                  </h3>
                </div>
                <div className='docs-content'>
                  <SnippetDocs markdown={currentSnippet.docs} />
                </div>
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Layout>
  );
};

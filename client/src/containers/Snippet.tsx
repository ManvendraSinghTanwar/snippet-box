import { Fragment, useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { SnippetCode } from '../components/Snippets/SnippetCode';
import { Layout, PageHeader, Card } from '../components/UI';
import { SnippetsContext } from '../store';
import { SnippetDetails } from '../components/Snippets/SnippetDetails';
import { SnippetDocs } from '../components/Snippets/SnippetDocs';
import { AIExplainer, CodeOptimizer } from '../components/AI';

interface Params {
  id: string;
}

export const Snippet = (): JSX.Element => {
  const { currentSnippet, getSnippetById } = useContext(SnippetsContext);
  const { id } = useParams<Params>();
  const [showOptimizer, setShowOptimizer] = useState<boolean>(false);

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
          <div className='col-12 col-md-7 col-lg-8 mt-3'>
            <SnippetCode
              code={currentSnippet.code}
              language={currentSnippet.language}
            />
          </div>
          <div className='col-12 col-md-5 col-lg-4 mt-md-3'>
            <SnippetDetails snippet={currentSnippet} />
          </div>
          
          {/* AI Features Section */}
          <div className='col-12 mt-3'>
            <Card title='🤖 AI-Powered Analysis'>
              <div className="mb-3">
                <div className="btn-group" role="group">
                  <button
                    className={`btn btn-outline-primary ${!showOptimizer ? 'active' : ''}`}
                    onClick={() => setShowOptimizer(false)}
                  >
                    Code Explanation
                  </button>
                  <button
                    className={`btn btn-outline-success ${showOptimizer ? 'active' : ''}`}
                    onClick={() => setShowOptimizer(true)}
                  >
                    Code Optimization
                  </button>
                </div>
              </div>
              
              {!showOptimizer ? (
                <AIExplainer
                  code={currentSnippet.code}
                  language={currentSnippet.language}
                  aiExplanation={currentSnippet.aiExplanation}
                />
              ) : (
                <CodeOptimizer
                  code={currentSnippet.code}
                  language={currentSnippet.language}
                />
              )}
            </Card>
          </div>

          {currentSnippet.docs && (
            <div className='col-12'>
              <Card title='Snippet documentation'>
                <hr />
                <SnippetDocs markdown={currentSnippet.docs} />
              </Card>
            </div>
          )}
        </Fragment>
      )}
    </Layout>
  );
};

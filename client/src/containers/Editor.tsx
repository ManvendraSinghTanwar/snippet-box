import { Fragment, useEffect, useContext, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { SnippetForm } from '../components/Snippets/SnippetForm';
import { SmartSnippetForm } from '../components/Snippets/SmartSnippetForm';
import { Layout, PageHeader, Button } from '../components/UI';
import { SnippetsContext } from '../store';

interface Params {
  id?: string;
}

export const Editor = (): JSX.Element => {
  const { setSnippet: setCurrentSnippet } = useContext(SnippetsContext);
  const [inEdit, setInEdit] = useState(false);
  const [useSmartMode, setUseSmartMode] = useState(true); // Default to smart mode

  // Get previous location
  const location = useLocation<{ from: string }>();
  const { from } = location.state || '/snippets';

  // Get id
  const { id } = useParams<Params>();

  // Set snippet
  useEffect(() => {
    if (id) {
      setCurrentSnippet(+id);
      setInEdit(true);
      setUseSmartMode(false); // Use traditional form for editing
    }
  }, []);

  const toggleMode = () => {
    setUseSmartMode(!useSmartMode);
  };

  return (
    <Layout>
      <div className="editor-modern">
        {inEdit ? (
          <Fragment>
            <PageHeader<{ from: string }>
              title='Edit snippet'
              prevDest={from}
              prevState={{ from: '/snippets' }}
            />
            <div className="snippet-form-modern">
              <SnippetForm inEdit />
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <PageHeader title='Add new snippet' />
            
            <div className="editor-header">
              <div className="mode-toggle-section">
                <div className="mode-toggle-wrapper">
                  <p className="mode-description">
                    Choose your preferred editing mode: <span className="mode-highlight">Smart Mode</span> uses AI to automatically generate snippet details from your code, while <span className="mode-highlight">Manual Mode</span> gives you full control over every field.
                  </p>
                  <div className="mode-controls">
                    <button
                      onClick={toggleMode}
                      className={`btn ${useSmartMode ? 'btn-primary' : 'btn-outline-primary'}`}
                    >
                      {useSmartMode ? '🤖 Smart Mode' : '📝 Manual Mode'}
                    </button>
                    <span className={`badge mode-badge ${useSmartMode ? 'badge-ai' : 'badge-manual'}`}>
                      {useSmartMode ? 'AI-Powered' : 'Traditional'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={useSmartMode ? "smart-snippet-form-modern" : "snippet-form-modern"}>
              {useSmartMode ? <SmartSnippetForm /> : <SnippetForm />}
            </div>
          </Fragment>
        )}
      </div>
    </Layout>
  );
};

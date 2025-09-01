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
      {inEdit ? (
        <Fragment>
          <PageHeader<{ from: string }>
            title='Edit snippet'
            prevDest={from}
            prevState={{ from: '/snippets' }}
          />
          <SnippetForm inEdit />
        </Fragment>
      ) : (
        <Fragment>
          <PageHeader title='Add new snippet'>
            <div className="d-flex gap-2 mt-2">
              <Button
                text={useSmartMode ? '🤖 Smart Mode' : '📝 Manual Mode'}
                color={useSmartMode ? 'primary' : 'secondary'}
                outline={!useSmartMode}
                handler={toggleMode}
              />
              <span className="badge bg-info align-self-center">
                {useSmartMode ? 'AI-Powered' : 'Traditional'}
              </span>
            </div>
          </PageHeader>
          {useSmartMode ? <SmartSnippetForm /> : <SnippetForm />}
        </Fragment>
      )}
    </Layout>
  );
};

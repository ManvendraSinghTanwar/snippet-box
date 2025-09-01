import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Snippet } from '../../typescript/interfaces';
import { dateParser, badgeColor } from '../../utils';
import { Badge } from '../UI';
import { SnippetsContext } from '../../store';
import copy from 'clipboard-copy';
import { SnippetPin } from './SnippetPin';
import MoveToCollection from './MoveToCollection';

interface Props {
  snippet: Snippet;
}

export const SnippetCard = (props: Props): JSX.Element => {
  const { title, description, language, code, id, createdAt, isPinned, collectionId } =
    props.snippet;
  const { setSnippet, getSnippets } = useContext(SnippetsContext);

  const copyHandler = () => {
    copy(code);
  };

  return (
    <div className='snippet-card-modern h-100'>
      <div className='snippet-card-header'>
        <div className='snippet-title-section'>
          <h5 className='snippet-title'>{title}</h5>
          <div className='snippet-pin-wrapper'>
            <SnippetPin id={id} isPinned={isPinned} />
          </div>
        </div>
        <div className='snippet-language-badge'>
          <Badge text={language} color={badgeColor(language)} />
        </div>
      </div>

      <div className='snippet-card-body'>
        <p className='snippet-description'>
          {description ? description : 'No description provided'}
        </p>
        
        <div className='snippet-meta'>
          <div className='snippet-date'>
            <i className='bi bi-clock me-1'></i>
            Created {dateParser(createdAt).relative}
          </div>
        </div>
      </div>

      <div className='snippet-card-footer'>
        <div className='snippet-actions-left'>
          <MoveToCollection
            snippetIds={[id]}
            currentCollectionId={collectionId}
            onSuccess={() => getSnippets()}
            buttonText="📁"
            buttonSize={true}
          />
        </div>
        
        <div className='snippet-actions-right'>
          <Link
            to={{
              pathname: `/snippet/${id}`,
              state: { from: window.location.pathname }
            }}
            className='btn btn-outline-primary btn-sm snippet-btn me-2'
            onClick={() => setSnippet(id)}
          >
            <i className='bi bi-eye me-1'></i>
            View
          </Link>
          
          <button
            className='btn btn-primary btn-sm snippet-btn'
            onClick={copyHandler}
            title='Copy code to clipboard'
          >
            <i className='bi bi-clipboard me-1'></i>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

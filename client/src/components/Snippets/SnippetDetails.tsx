import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { SnippetsContext } from '../../store';
import { Snippet } from '../../typescript/interfaces';
import { dateParser } from '../../utils';
import { Badge, Button, Card } from '../UI';
import copy from 'clipboard-copy';
import { SnippetPin } from './SnippetPin';

interface Props {
  snippet: Snippet;
}

export const SnippetDetails = (props: Props): JSX.Element => {
  const {
    title,
    language,
    tags,
    createdAt,
    updatedAt,
    description,
    code,
    id,
    isPinned
  } = props.snippet;

  const history = useHistory();

  const { deleteSnippet, setSnippet } = useContext(SnippetsContext);

  const creationDate = dateParser(createdAt);
  const updateDate = dateParser(updatedAt);

  // const copyHandler = () => {
  //   copy(code);
  // };

  return (
    <div className='snippet-details-modern'>
      <div className='snippet-details-header'>
        <div className='snippet-title-section'>
          <h4 className='details-title'>Snippet Details</h4>
          <SnippetPin id={id} isPinned={isPinned} />
        </div>
      </div>

      <div className='snippet-meta-grid'>
        <div className='meta-item'>
          <span className='meta-label'>Description</span>
          <span className='meta-value'>{description || 'No description provided'}</span>
        </div>

        <div className='meta-item'>
          <span className='meta-label'>Language</span>
          <span className='meta-value language-value'>{language}</span>
        </div>

        <div className='meta-item'>
          <span className='meta-label'>Created</span>
          <span className='meta-value'>{creationDate.relative}</span>
        </div>

        <div className='meta-item'>
          <span className='meta-label'>Last Updated</span>
          <span className='meta-value'>{updateDate.relative}</span>
        </div>
      </div>

      {tags.length > 0 && (
        <div className='tags-section-modern'>
          <span className='tags-label'>Tags</span>
          <div className='tags-container'>
            {tags.map((tag, idx) => (
              <span className='tag-pill-view' key={idx}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className='actions-section-modern'>
        <div className='primary-actions'>
          <button
            className='btn-action-modern primary'
            onClick={() => copy(code)}
          >
            <i className='bi bi-clipboard'></i>
            Copy Code
          </button>
          
          <button
            className='btn-action-modern secondary'
            onClick={() => {
              setSnippet(id);
              history.push({
                pathname: `/editor/${id}`,
                state: { from: window.location.pathname }
              });
            }}
          >
            <i className='bi bi-pencil'></i>
            Edit
          </button>
        </div>

        <div className='secondary-actions'>
          <button
            className='btn-action-modern outline'
            onClick={() => {
              const { protocol, host } = window.location;
              const rawUrl = `${protocol}//${host}/api/snippets/raw/${id}`;
              copy(rawUrl);
            }}
          >
            <i className='bi bi-link-45deg'></i>
            Copy URL
          </button>
          
          <button
            className='btn-action-modern danger'
            onClick={() => deleteSnippet(id)}
          >
            <i className='bi bi-trash'></i>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

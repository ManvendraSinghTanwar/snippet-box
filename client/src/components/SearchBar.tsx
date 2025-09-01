import { useRef, useEffect, KeyboardEvent, useContext, useState } from 'react';
import { SnippetsContext } from '../store';
import { searchParser } from '../utils';

export const SearchBar = (): JSX.Element => {
  const { searchSnippets } = useContext(SnippetsContext);
  const inputRef = useRef<HTMLInputElement>(document.createElement('input'));
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  const inputHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    const query = searchParser(inputRef.current.value);

    if (e.key === 'Enter') {
      setIsSearching(true);
      searchSnippets(query);
      setTimeout(() => setIsSearching(false), 500);
    } else if (e.key === 'Escape') {
      inputRef.current.value = '';
      setIsSearching(true);
      searchSnippets(searchParser(inputRef.current.value));
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  const handleSearchClick = () => {
    const query = searchParser(inputRef.current.value);
    setIsSearching(true);
    searchSnippets(query);
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleClearClick = () => {
    inputRef.current.value = '';
    setIsSearching(true);
    searchSnippets(searchParser(''));
    setTimeout(() => setIsSearching(false), 500);
  };

  return (
    <div className='mb-0'>
      <div className='input-group input-group-lg mb-3'>
        <span className='input-group-text bg-light border-end-0'>
          <i className='bi bi-search text-muted'></i>
        </span>
        <input
          type='text'
          className='form-control border-start-0 shadow-sm'
          placeholder='Search by title, description, or code... Use lang:javascript tags:react for filters'
          ref={inputRef}
          onKeyUp={e => inputHandler(e)}
          style={{ fontSize: '1rem' }}
        />
        <button 
          className='btn btn-primary px-4' 
          type='button' 
          onClick={handleSearchClick}
          disabled={isSearching}
        >
          {isSearching ? (
            <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
          ) : (
            <i className='bi bi-search me-2'></i>
          )}
          Search
        </button>
        <button 
          className='btn btn-outline-secondary px-3' 
          type='button' 
          onClick={handleClearClick}
          disabled={isSearching}
        >
          <i className='bi bi-x-circle me-1'></i>
          Clear
        </button>
      </div>
      <div className='text-center'>
        <small className='text-muted'>
          <i className='bi bi-info-circle me-1'></i>
          <strong>Pro tips:</strong> Use <code className='bg-light px-1 rounded'>lang:javascript</code> for language filters, 
          <code className='bg-light px-1 rounded'>tags:react,hooks</code> for tag filters. Press <kbd className='bg-dark text-light'>Enter</kbd> to search or <kbd className='bg-dark text-light'>Esc</kbd> to clear.
        </small>
      </div>
    </div>
  );
};

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
    <div className='mb-3'>
      <div className='input-group'>
        <input
          type='text'
          className='form-control'
          placeholder='Search by title, description, or code... Use lang:javascript tags:react for filters'
          ref={inputRef}
          onKeyUp={e => inputHandler(e)}
        />
        <button 
          className='btn btn-primary' 
          type='button' 
          onClick={handleSearchClick}
          disabled={isSearching}
        >
          {isSearching ? (
            <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
          ) : (
            <i className='bi bi-search me-1'></i>
          )}
          Search
        </button>
        <button 
          className='btn btn-outline-secondary' 
          type='button' 
          onClick={handleClearClick}
          disabled={isSearching}
        >
          <i className='bi bi-x-circle me-1'></i>
          Clear
        </button>
      </div>
      <div className='form-text text-muted ms-1 mt-2'>
        <strong>Search tips:</strong> Use <code>lang:javascript</code> to filter by language, 
        <code>tags:react,hooks</code> to filter by tags. Press <kbd>Enter</kbd> to search or <kbd>Esc</kbd> to clear.
      </div>
    </div>
  );
};

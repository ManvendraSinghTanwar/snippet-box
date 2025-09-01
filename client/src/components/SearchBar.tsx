import { useRef, useEffect, KeyboardEvent, useContext, useState } from 'react';
import { SnippetsContext } from '../store';
import { searchParser } from '../utils';

export const SearchBar = (): JSX.Element => {
  const { searchSnippets } = useContext(SnippetsContext);
  const inputRef = useRef<HTMLInputElement>(document.createElement('input'));
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
      {/* Modern Search Container */}
      <div className={`search-container-modern ${isFocused ? 'focused' : ''}`}>
        <div className='search-input-wrapper'>
          <div className='search-icon'>
            <i className={`bi ${isSearching ? 'bi-arrow-repeat search-spin' : 'bi-search'}`}></i>
          </div>
          <input
            type='text'
            className='search-input-modern'
            placeholder='Search snippets by title, description, language, or tags...'
            ref={inputRef}
            onKeyUp={e => inputHandler(e)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {inputRef.current?.value && (
            <button 
              className='search-clear-btn' 
              type='button' 
              onClick={handleClearClick}
              disabled={isSearching}
            >
              <i className='bi bi-x'></i>
            </button>
          )}
        </div>
        <div className='search-actions'>
          <button 
            className='btn-search-modern' 
            type='button' 
            onClick={handleSearchClick}
            disabled={isSearching}
          >
            {isSearching ? (
              <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
            ) : (
              <i className='bi bi-search'></i>
            )}
          </button>
        </div>
      </div>

      {/* Search Tips */}
      <div className='search-tips-modern mt-3'>
        <div className='tips-header'>
          <i className='bi bi-lightbulb-fill'></i>
          <span>Search Tips</span>
        </div>
        <div className='tips-content'>
          <div className='tip-item'>
            <code className='tip-code'>lang:javascript</code>
            <span>Filter by language</span>
          </div>
          <div className='tip-item'>
            <code className='tip-code'>tags:react,hooks</code>
            <span>Filter by tags</span>
          </div>
          <div className='tip-item'>
            <kbd className='tip-kbd'>Enter</kbd>
            <span>Search</span>
          </div>
          <div className='tip-item'>
            <kbd className='tip-kbd'>Esc</kbd>
            <span>Clear</span>
          </div>
        </div>
      </div>
    </div>
  );
};

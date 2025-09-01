import { useEffect, useContext, useState, Fragment } from 'react';
import { SnippetsContext } from '../store';
import { SnippetGrid } from '../components/Snippets/SnippetGrid';
import { Button, Card, EmptyState, Layout, PageHeader } from '../components/UI';
import { SearchBar } from '../components/SearchBar';
import { Snippet } from '../typescript/interfaces';

export const Snippets = (): JSX.Element => {
  const { snippets, tagCount, searchResults, getSnippets, countTags } =
    useContext(SnippetsContext);

  const [filter, setFilter] = useState<string | null>(null);
  const [localSnippets, setLocalSnippets] = useState<Snippet[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  useEffect(() => {
    getSnippets();
    countTags();
  }, []);

  useEffect(() => {
    setLocalSnippets([...snippets]);
  }, [snippets]);

  // Watch for search results
  useEffect(() => {
    if (searchResults.length > 0) {
      setShowSearchResults(true);
      setFilter(null); // Clear tag filter when searching
    } else {
      setShowSearchResults(false);
    }
  }, [searchResults]);

  const filterHandler = (tag: string) => {
    setFilter(tag);
    const filteredSnippets = snippets.filter(s => s.tags.includes(tag));
    setLocalSnippets(filteredSnippets);
  };

  const clearFilterHandler = () => {
    setFilter(null);
    setShowSearchResults(false);
    setLocalSnippets([...snippets]);
  };

  // Get the snippets to display based on current state
  const displaySnippets = showSearchResults ? searchResults : localSnippets;

  return (
    <Layout>
      {snippets.length === 0 ? (
        <EmptyState />
      ) : (
        <Fragment>
          <PageHeader title='All Snippets' />
          <div className='col-12 mb-4'>
            <SearchBar />
          </div>
          
          <div className='col-12 col-md-4 col-lg-3'>
            <div className='snippets-sidebar-modern'>
              <div className='stats-card-modern'>
                <div className='stats-header'>
                  <div className='stats-icon'>
                    <i className='bi bi-code-square'></i>
                  </div>
                  <div className='stats-content'>
                    <h5 className='stats-title'>All Snippets</h5>
                    <div className='stats-value'>{snippets.length}</div>
                  </div>
                </div>
              </div>

              <div className='filter-card-modern'>
                <div className='filter-header'>
                  <h5 className='filter-title'>
                    <i className='bi bi-funnel me-2'></i>
                    Filter by Tags
                  </h5>
                </div>
                
                <div className='tag-filter-list-modern'>
                  {tagCount.map((tag, idx) => {
                    const isActiveFilter = filter === tag.name;

                    return (
                      <div
                        key={idx}
                        className={`tag-filter-item ${isActiveFilter ? 'active' : ''}`}
                        onClick={() => filterHandler(tag.name)}
                      >
                        <div className='tag-filter-content'>
                          <span className='tag-filter-name'>#{tag.name}</span>
                          <span className='tag-filter-count'>{tag.count}</span>
                        </div>
                        <div className='tag-filter-indicator'></div>
                      </div>
                    );
                  })}
                </div>
                
                <div className='filter-actions'>
                  <button
                    className='btn btn-clear-filters'
                    onClick={clearFilterHandler}
                  >
                    <i className='bi bi-arrow-clockwise me-2'></i>
                    {showSearchResults ? 'Clear search & filters' : 'Clear filters'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-8 col-lg-9'>
            {showSearchResults && (
              <div className='mb-4'>
                <div className='results-alert search-results'>
                  <div className='results-icon'>
                    <i className='bi bi-search'></i>
                  </div>
                  <div className='results-content'>
                    <strong>Search Results</strong>
                    <span>Found {searchResults.length} snippet(s) matching your query</span>
                  </div>
                </div>
              </div>
            )}
            {filter && !showSearchResults && (
              <div className='mb-4'>
                <div className='results-alert filter-results'>
                  <div className='results-icon'>
                    <i className='bi bi-funnel'></i>
                  </div>
                  <div className='results-content'>
                    <strong>Filtered by tag: #{filter}</strong>
                    <span>Showing {localSnippets.length} snippet(s)</span>
                  </div>
                </div>
              </div>
            )}
            <div className='snippets-grid-wrapper'>
              <SnippetGrid snippets={displaySnippets} />
            </div>
          </div>
        </Fragment>
      )}
    </Layout>
  );
};

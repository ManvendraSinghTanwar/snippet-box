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
            <Card>
              <h5 className='card-title fw-bold text-primary'>All snippets</h5>
              <div className='mb-3 d-flex justify-content-between align-items-center'>
                <span className='fw-medium'>Total</span>
                <span className='fw-medium'>{snippets.length}</span>
              </div>
              <hr />

              <h5 className='card-title fw-bold text-primary mb-3'>Filter by tags</h5>
              <div className='tag-filter-list'>
                {tagCount.map((tag, idx) => {
                  const isActiveFilter = filter === tag.name;

                  return (
                    <div
                      key={idx}
                      className={`d-flex justify-content-between cursor-pointer p-2 rounded mb-2 transition-all ${
                        isActiveFilter 
                          ? 'bg-primary text-white' 
                          : 'hover-bg-light'
                      }`}
                      onClick={() => filterHandler(tag.name)}
                      style={{ 
                        transition: 'all 0.3s ease',
                        backgroundColor: isActiveFilter ? '#0d6efd' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActiveFilter) {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActiveFilter) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span className='fw-medium'>{tag.name}</span>
                      <span className='fw-medium'>{tag.count}</span>
                    </div>
                  );
                })}
              </div>
              <div className='d-grid mt-3'>
                <Button
                  text={showSearchResults ? 'Clear search & filters' : 'Clear filters'}
                  color='secondary'
                  small
                  outline
                  handler={clearFilterHandler}
                />
              </div>
            </Card>
          </div>
          <div className='col-12 col-md-8 col-lg-9'>
            {showSearchResults && (
              <div className='mb-3'>
                <div className='alert alert-info'>
                  <strong>Search Results:</strong> Found {searchResults.length} snippet(s)
                </div>
              </div>
            )}
            {filter && !showSearchResults && (
              <div className='mb-3'>
                <div className='alert alert-info'>
                  <strong>Filtered by tag:</strong> {filter} ({localSnippets.length} snippet(s))
                </div>
              </div>
            )}
            <SnippetGrid snippets={displaySnippets} />
          </div>
        </Fragment>
      )}
    </Layout>
  );
};

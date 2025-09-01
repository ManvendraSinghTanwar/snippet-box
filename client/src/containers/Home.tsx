import { useEffect, useContext, Fragment, useState } from 'react';
import { SnippetsContext } from '../store';
import { Layout, EmptyState } from '../components/UI';
import { SnippetGrid } from '../components/Snippets/SnippetGrid';
import { SearchBar } from '../components/SearchBar';

export const Home = (): JSX.Element => {
  const { snippets, getSnippets, searchResults } = useContext(SnippetsContext);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    getSnippets();
  }, []);

  useEffect(() => {
    setHasSearched(searchResults.length > 0);
  }, [searchResults]);

  const totalSnippets = snippets.length;
  const pinnedSnippets = snippets.filter(s => s.isPinned);
  const recentSnippets = snippets
    .filter(s => !s.isPinned)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <Layout>
      {snippets.length === 0 ? (
        <EmptyState />
      ) : (
        <Fragment>
          {/* Hero Section */}
          <div className='col-12 mb-5'>
            <div className='text-center mb-4'>
              <h1 className='display-4 fw-bold text-primary mb-3'>
                <i className='bi bi-code-slash me-3'></i>
                Snippet Box
              </h1>
              <p className='lead text-muted mb-4'>
                Search through your code snippets with powerful filters
              </p>
            </div>
            
            {/* Search Section */}
            <div className='row justify-content-center'>
              <div className='col-12 col-lg-8'>
                <div className='card search-card shadow-sm border-0'>
                  <div className='card-body p-4'>
                    <SearchBar />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className='col-12 mb-4'>
            <div className='row g-3'>
              <div className='col-md-4'>
                <div className='card stats-card h-100 border-0 shadow-sm'>
                  <div className='card-body text-center'>
                    <div className='display-6 text-primary mb-2'>
                      <i className='bi bi-collection'></i>
                    </div>
                    <h4 className='text-primary mb-1'>{totalSnippets}</h4>
                    <p className='text-muted mb-0'>Total Snippets</p>
                  </div>
                </div>
              </div>
              <div className='col-md-4'>
                <div className='card stats-card h-100 border-0 shadow-sm'>
                  <div className='card-body text-center'>
                    <div className='display-6 text-warning mb-2'>
                      <i className='bi bi-pin'></i>
                    </div>
                    <h4 className='text-warning mb-1'>{pinnedSnippets.length}</h4>
                    <p className='text-muted mb-0'>Pinned Snippets</p>
                  </div>
                </div>
              </div>
              <div className='col-md-4'>
                <div className='card stats-card h-100 border-0 shadow-sm'>
                  <div className='card-body text-center'>
                    <div className='display-6 text-success mb-2'>
                      <i className='bi bi-search'></i>
                    </div>
                    <h4 className='text-success mb-1'>{hasSearched ? searchResults.length : 0}</h4>
                    <p className='text-muted mb-0'>Search Results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Section */}
          {hasSearched && (
            <div className='col-12 mb-5'>
              <div className='d-flex align-items-center justify-content-between mb-4 section-header text-success'>
                <h3 className='mb-0'>
                  <i className='bi bi-search me-2'></i>
                  Search Results
                </h3>
                <span className='badge bg-success fs-6'>{searchResults.length} found</span>
              </div>
              <SnippetGrid snippets={searchResults} />
            </div>
          )}

          {/* Pinned Snippets Section */}
          {pinnedSnippets.length > 0 && (
            <div className='col-12 mb-5'>
              <div className='d-flex align-items-center justify-content-between mb-4 section-header text-warning'>
                <h3 className='mb-0'>
                  <i className='bi bi-pin-fill me-2'></i>
                  Pinned Snippets
                </h3>
                <span className='badge bg-warning text-dark fs-6'>{pinnedSnippets.length} pinned</span>
              </div>
              <SnippetGrid snippets={pinnedSnippets} />
            </div>
          )}

          {/* Recent Snippets Section */}
          {!hasSearched && recentSnippets.length > 0 && (
            <div className='col-12 mb-5'>
              <div className='d-flex align-items-center justify-content-between mb-4 section-header text-info'>
                <h3 className='mb-0'>
                  <i className='bi bi-clock-history me-2'></i>
                  Recent Snippets
                </h3>
                <span className='badge bg-info fs-6'>Latest updates</span>
              </div>
              <SnippetGrid snippets={recentSnippets} />
            </div>
          )}

          {/* Quick Actions */}
          <div className='col-12'>
            <div className='card border-0 quick-actions'>
              <div className='card-body text-center py-4'>
                <h5 className='card-title text-muted mb-3'>
                  <i className='bi bi-lightning-charge me-2'></i>
                  Quick Actions
                </h5>
                <div className='d-flex flex-wrap justify-content-center gap-3'>
                  <a href='/editor' className='btn btn-primary btn-lg'>
                    <i className='bi bi-plus-circle me-2'></i>
                    Create New Snippet
                  </a>
                  <a href='/snippets' className='btn btn-outline-primary btn-lg'>
                    <i className='bi bi-collection me-2'></i>
                    Browse All Snippets
                  </a>
                  <a href='/collections' className='btn btn-outline-secondary btn-lg'>
                    <i className='bi bi-folder2 me-2'></i>
                    Manage Collections
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Layout>
  );
};

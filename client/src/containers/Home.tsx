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
          <div className='col-12 mb-3'>
            <div className='text-center mb-2 p-3'>
              <h1 className='display-4 fw-bold mb-3' style={{
                background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Snippet Box
              </h1>
              <p className='lead text-muted mb-3'>
                Manage your code snippets with ease
              </p>
            </div>
            
            {/* Search Section */}
            <div className='row justify-content-center'>
              <div className='col-12 col-lg-10 col-xl-8'>
                <SearchBar />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className='col-12 mb-3'>
            <div className='row g-3'>
              <div className='col-md-4'>
                <div className='stats-card-compact h-100 stats-primary'>
                  <div className='stats-icon-small'>
                    <i className='bi bi-collection'></i>
                  </div>
                  <div className='stats-content'>
                    <div className='stats-number-small'>{totalSnippets}</div>
                    <div className='stats-label-small'>Total Snippets</div>
                  </div>
                </div>
              </div>
              <div className='col-md-4'>
                <div className='stats-card-compact h-100 stats-warning'>
                  <div className='stats-icon-small'>
                    <i className='bi bi-pin-fill'></i>
                  </div>
                  <div className='stats-content'>
                    <div className='stats-number-small'>{pinnedSnippets.length}</div>
                    <div className='stats-label-small'>Pinned Snippets</div>
                  </div>
                </div>
              </div>
              <div className='col-md-4'>
                <div className='stats-card-compact h-100 stats-success'>
                  <div className='stats-icon-small'>
                    <i className='bi bi-search'></i>
                  </div>
                  <div className='stats-content'>
                    <div className='stats-number-small'>{hasSearched ? searchResults.length : 0}</div>
                    <div className='stats-label-small'>Search Results</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Section */}
          {hasSearched && (
            <div className='col-12 mb-5'>
              <div className='section-header-modern success mb-4'>
                <div className='section-icon'>
                  <i className='bi bi-search'></i>
                </div>
                <div className='section-content'>
                  <h3 className='section-title'>Search Results</h3>
                  <p className='section-subtitle'>{searchResults.length} snippets found</p>
                </div>
                <div className='section-badge'>
                  <span className='badge bg-success'>{searchResults.length}</span>
                </div>
              </div>
              <SnippetGrid snippets={searchResults} />
            </div>
          )}

          {/* Pinned Snippets Section */}
          {pinnedSnippets.length > 0 && (
            <div className='col-12 mb-5'>
              <div className='section-header-modern warning mb-4'>
                <div className='section-icon'>
                  <i className='bi bi-pin-fill'></i>
                </div>
                <div className='section-content'>
                  <h3 className='section-title'>Pinned Snippets</h3>
                  <p className='section-subtitle'>Your most important code snippets</p>
                </div>
                <div className='section-badge'>
                  <span className='badge bg-warning text-dark'>{pinnedSnippets.length}</span>
                </div>
              </div>
              <SnippetGrid snippets={pinnedSnippets} />
            </div>
          )}

          {/* Recent Snippets Section */}
          {!hasSearched && recentSnippets.length > 0 && (
            <div className='col-12 mb-5'>
              <div className='section-header-modern info mb-4'>
                <div className='section-icon'>
                  <i className='bi bi-clock-history'></i>
                </div>
                <div className='section-content'>
                  <h3 className='section-title'>Recent Snippets</h3>
                  <p className='section-subtitle'>Latest additions and updates</p>
                </div>
                <div className='section-badge'>
                  <span className='badge bg-info'>Recent</span>
                </div>
              </div>
              <SnippetGrid snippets={recentSnippets} />
            </div>
          )}

          {/* Popular Tags Section */}
          {!hasSearched && (
            <div className='col-12 mb-5'>
              <div className='popular-tags-card'>
                <div className='popular-tags-header'>
                  <div className='tags-icon'>
                    <i className='bi bi-tags'></i>
                  </div>
                  <div className='tags-content'>
                    <h5 className='tags-title'>Popular Tags</h5>
                    <p className='tags-subtitle'>Quick search by popular categories</p>
                  </div>
                </div>
                <div className='tags-grid'>
                  {['javascript', 'react', 'typescript', 'python', 'css', 'html', 'node.js', 'api'].map((tag) => (
                    <button 
                      key={tag}
                      className='tag-pill'
                      onClick={() => {
                        // This could trigger a search for this tag
                        console.log(`Search for tag: ${tag}`);
                      }}
                    >
                      <span className='tag-hash'>#</span>
                      <span className='tag-name'>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips Section */}
          {!hasSearched && (
            <div className='col-12 mb-5'>
              <div className='quick-tips-card'>
                <div className='quick-tips-header'>
                  <div className='tips-icon'>
                    <i className='bi bi-lightbulb'></i>
                  </div>
                  <div className='tips-content'>
                    <h5 className='tips-title'>Quick Tips</h5>
                    <p className='tips-subtitle'>Pro tips to enhance your productivity</p>
                  </div>
                </div>
                <div className='tips-grid'>
                  <div className='tip-item'>
                    <div className='tip-icon primary'>
                      <i className='bi bi-keyboard'></i>
                    </div>
                    <div className='tip-content'>
                      <div className='tip-text'>Use <kbd>Ctrl+K</kbd> to quickly open search</div>
                    </div>
                  </div>
                  <div className='tip-item'>
                    <div className='tip-icon warning'>
                      <i className='bi bi-pin'></i>
                    </div>
                    <div className='tip-content'>
                      <div className='tip-text'>Pin frequently used snippets for quick access</div>
                    </div>
                  </div>
                  <div className='tip-item'>
                    <div className='tip-icon success'>
                      <i className='bi bi-collection'></i>
                    </div>
                    <div className='tip-content'>
                      <div className='tip-text'>Organize snippets into collections by project</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className='col-12'>
            <div className='quick-actions-modern'>
              <div className='quick-actions-header text-center mb-4'>
                <div className='actions-icon mx-auto mb-3'>
                  <i className='bi bi-lightning-charge'></i>
                </div>
                <h5 className='actions-title'>Quick Actions</h5>
                <p className='actions-subtitle'>Start creating and managing your snippets</p>
              </div>
              <div className='actions-grid'>
                <a href='/editor' className='action-card primary'>
                  <div className='action-icon'>
                    <i className='bi bi-plus-circle'></i>
                  </div>
                  <div className='action-content'>
                    <h6 className='action-title'>Create Snippet</h6>
                    <p className='action-description'>Add a new code snippet</p>
                  </div>
                </a>
                
                <a href='/snippets' className='action-card info'>
                  <div className='action-icon'>
                    <i className='bi bi-collection'></i>
                  </div>
                  <div className='action-content'>
                    <h6 className='action-title'>Browse All</h6>
                    <p className='action-description'>View all your snippets</p>
                  </div>
                </a>
                
                <a href='/collections' className='action-card secondary'>
                  <div className='action-icon'>
                    <i className='bi bi-folder2'></i>
                  </div>
                  <div className='action-content'>
                    <h6 className='action-title'>Collections</h6>
                    <p className='action-description'>Organize by project</p>
                  </div>
                </a>
                
                <a href='/about' className='action-card success'>
                  <div className='action-icon'>
                    <i className='bi bi-info-circle'></i>
                  </div>
                  <div className='action-content'>
                    <h6 className='action-title'>Learn More</h6>
                    <p className='action-description'>About Snippet Box</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Layout>
  );
};

import { Fragment } from 'react';
import { Layout } from '../components/UI';

export const About = (): JSX.Element => {
  return (
    <div className='about-page'>
      <Layout>
      <Fragment>
        {/* Hero Section */}
        <div className='col-12 mb-5'>
          <div className='text-center p-5'>
            <div className='hero-icon-about mb-4'>
              <i className='bi bi-code-slash'></i>
            </div>
            <h1 className='display-3 fw-bold mb-3' style={{
              background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Snippet Box 2.0
            </h1>
            <p className='lead mb-4 fs-4 text-muted'>
              Transform your coding experience with AI-powered snippet management
            </p>
            <div className='d-flex justify-content-center gap-3 flex-wrap'>
              <span className='badge-modern-simple badge-ai'>
                <i className='bi bi-robot me-2'></i>AI-Powered
              </span>
              <span className='badge-modern-simple badge-speed'>
                <i className='bi bi-lightning-charge me-2'></i>Zero Friction
              </span>
              <span className='badge-modern-simple badge-dev'>
                <i className='bi bi-people me-2'></i>Developer-Focused
              </span>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className='col-12 mb-5'>
          <div className='modern-card problem-card'>
            <div className='card-body p-5'>
              <div className='section-header-about mb-5'>
                <div className='section-icon-about danger'>
                  <i className='bi bi-exclamation-triangle'></i>
                </div>
                <h2 className='section-title-about text-danger'>
                  What Problem Does Snippet Box 2.0 Solve?
                </h2>
                <p className='section-subtitle-about'>
                  Every developer faces these daily challenges
                </p>
              </div>
              
              <div className='row g-4'>
                <div className='col-md-6'>
                  <div className='problem-item-modern'>
                    <div className='problem-icon danger'>
                      <i className='bi bi-search'></i>
                    </div>
                    <div className='problem-content'>
                      <h5>Lost Code</h5>
                      <p>"I wrote this perfect function 6 months ago... where is it?"</p>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='problem-item-modern'>
                    <div className='problem-icon danger'>
                      <i className='bi bi-clock'></i>
                    </div>
                    <div className='problem-content'>
                      <h5>Repetitive Coding</h5>
                      <p>Writing the same boilerplate code over and over</p>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='problem-item-modern'>
                    <div className='problem-icon danger'>
                      <i className='bi bi-memory'></i>
                    </div>
                    <div className='problem-content'>
                      <h5>Memory Overload</h5>
                      <p>Can't remember every syntax and pattern</p>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='problem-item-modern'>
                    <div className='problem-icon danger'>
                      <i className='bi bi-diagram-3'></i>
                    </div>
                    <div className='problem-content'>
                      <h5>Scattered Knowledge</h5>
                      <p>Code snippets spread across files, notes, bookmarks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solutions */}
        <div className='col-12 mb-5'>
          <div className='modern-card solution-card'>
            <div className='card-body p-5'>
              <div className='section-header-about mb-5'>
                <div className='section-icon-about success'>
                  <i className='bi bi-lightbulb'></i>
                </div>
                <h2 className='section-title-about text-success'>
                  How Snippet Box 2.0 Solves These Problems
                </h2>
                <p className='section-subtitle-about'>
                  Intelligent solutions for modern developers
                </p>
              </div>
              
              <div className='row g-4 mb-5'>
                <div className='col-lg-6'>
                  <div className='solution-card-modern success h-100'>
                    <div className='solution-header'>
                      <div className='solution-icon success'>
                        <i className='bi bi-bank'></i>
                      </div>
                      <h4>Personal Code Bank</h4>
                    </div>
                    <p className='solution-description'>
                      Instead of googling "how to debounce function" every time, you have it saved with YOUR context and notes.
                    </p>
                    <div className='code-example-modern'>
                      <div className='code-header'>
                        <div className='code-dots'>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span className='code-language'>JavaScript</span>
                      </div>
                      <pre className='code-content'><code>{`const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};`}</code></pre>
                      <div className='code-footer'>
                        <div className='code-tags'>
                          <span className='tag'>performance</span>
                          <span className='tag'>javascript</span>
                          <span className='tag'>utility</span>
                        </div>
                        <div className='code-note'>
                          "Prevents excessive API calls in search"
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className='col-lg-6'>
                  <div className='solution-card-modern primary h-100'>
                    <div className='solution-header'>
                      <div className='solution-icon primary'>
                        <i className='bi bi-robot'></i>
                      </div>
                      <h4>AI-Powered Intelligence</h4>
                    </div>
                    <div className='ai-comparison mb-4'>
                      <div className='comparison-item before'>
                        <strong>Traditional way:</strong> Manual categorization and tagging
                      </div>
                      <div className='comparison-arrow'>
                        <i className='bi bi-arrow-down'></i>
                      </div>
                      <div className='comparison-item after'>
                        <strong>Snippet Box 2.0 way:</strong> Paste code → AI does everything
                      </div>
                    </div>
                    <div className='ai-example-modern'>
                      <div className='example-header'>
                        <i className='bi bi-magic'></i>
                        <span>AI Magic Example</span>
                      </div>
                      <div className='example-input'>
                        <strong>Paste:</strong>
                        <code className='input-code'>
                          SELECT * FROM users WHERE created_at &gt; NOW() - INTERVAL 30 DAY
                        </code>
                      </div>
                      <div className='example-output'>
                        <strong>AI generates:</strong>
                        <ul className='ai-results'>
                          <li><i className='bi bi-check-circle'></i>Title: "Recent Users Query"</li>
                          <li><i className='bi bi-check-circle'></i>Language: "SQL"</li>
                          <li><i className='bi bi-check-circle'></i>Tags: ["database", "users", "recent", "mysql"]</li>
                          <li><i className='bi bi-check-circle'></i>Description: "Retrieves all users created in the last 30 days"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features & CTA */}
        <div className='col-12 mb-5'>
          <div className='modern-card features-card'>
            <div className='card-body p-5'>
              <div className='section-header-about mb-5'>
                <div className='section-icon-about primary'>
                  <i className='bi bi-star'></i>
                </div>
                <h2 className='section-title-about text-primary'>
                  Why Choose Snippet Box 2.0?
                </h2>
                <p className='section-subtitle-about'>
                  Built by developers, for developers
                </p>
              </div>
              
              <div className='row g-4 mb-5'>
                <div className='col-lg-4'>
                  <div className='feature-card-modern'>
                    <div className='feature-icon speed'>
                      <i className='bi bi-lightning-charge'></i>
                    </div>
                    <h4>10x Faster</h4>
                    <p>From 15 minutes of googling to 30 seconds of copying your proven solution</p>
                    <div className='feature-stats'>
                      <span className='stat-item'>
                        <strong>50+ hours</strong> saved annually
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className='col-lg-4'>
                  <div className='feature-card-modern'>
                    <div className='feature-icon quality'>
                      <i className='bi bi-shield-check'></i>
                    </div>
                    <h4>Battle-Tested</h4>
                    <p>Use code you've already tested and customized to fit your coding style</p>
                    <div className='feature-stats'>
                      <span className='stat-item'>
                        <strong>Zero</strong> debugging time
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className='col-lg-4'>
                  <div className='feature-card-modern'>
                    <div className='feature-icon ai'>
                      <i className='bi bi-robot'></i>
                    </div>
                    <h4>AI-Powered</h4>
                    <p>Automatic language detection, smart tagging, and intelligent descriptions</p>
                    <div className='feature-stats'>
                      <span className='stat-item'>
                        <strong>100%</strong> automated
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Line */}
              <div className='bottom-line-card'>
                <div className='bottom-line-content'>
                  <h3 className='bottom-line-title'>
                    <i className='bi bi-brain me-2'></i>
                    Like having a senior developer's brain as your personal assistant
                  </h3>
                  <p className='bottom-line-text'>
                    Transform every solution you create into a reusable asset that compounds your productivity over time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className='col-12'>
          <div className='cta-card-modern'>
            <div className='cta-content'>
              <h3 className='cta-title'>
                <i className='bi bi-rocket me-2'></i>
                Ready to Transform Your Coding Experience?
              </h3>
              <p className='cta-subtitle'>Join thousands of developers who've supercharged their productivity</p>
              <div className='cta-buttons'>
                <a href='/editor' className='btn-cta primary'>
                  <i className='bi bi-plus-circle me-2'></i>
                  Create Your First Snippet
                </a>
                <a href='/snippets' className='btn-cta secondary'>
                  <i className='bi bi-search me-2'></i>
                  Explore Features
                </a>
                <a href='https://github.com/ManvendraSinghTanwar/snippet-box' target='_blank' rel='noopener noreferrer' className='btn-cta outline'>
                  <i className='bi bi-github me-2'></i>
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </Layout>
    </div>
  );
};

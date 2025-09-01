import { Fragment } from 'react';
import { Layout } from '../components/UI';

export const About = (): JSX.Element => {
  return (
    <div className='about-page'>
      <Layout>
      <Fragment>
        {/* Hero Section */}
        <div className='col-12 mb-5'>
          <div className='hero-section text-center text-white p-5 rounded'>
            <div className='display-4 fw-bold mb-3'>
              <i className='bi bi-code-slash me-3'></i>
              Snippet Box
            </div>
            <p className='lead mb-4'>
              Transform your coding experience with AI-powered snippet management
            </p>
            <div className='d-flex justify-content-center gap-3 flex-wrap'>
              <span className='badge bg-light text-dark fs-6 px-3 py-2'>
                <i className='bi bi-robot me-2'></i>AI-Powered
              </span>
              <span className='badge bg-light text-dark fs-6 px-3 py-2'>
                <i className='bi bi-lightning-charge me-2'></i>Zero Friction
              </span>
              <span className='badge bg-light text-dark fs-6 px-3 py-2'>
                <i className='bi bi-people me-2'></i>Developer-Focused
              </span>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className='col-12 mb-5'>
          <div className='card border-0 shadow-sm'>
            <div className='card-body p-5'>
              <h2 className='text-danger mb-4'>
                <i className='bi bi-exclamation-triangle me-2'></i>
                What Problem Does Snippet Box Solve?
              </h2>
              <div className='row g-4'>
                <div className='col-md-6'>
                  <div className='problem-item p-3 rounded bg-light border-start border-danger border-4'>
                    <h5 className='text-danger'>
                      <i className='bi bi-search me-2'></i>Lost Code
                    </h5>
                    <p className='mb-0 text-muted'>
                      "I wrote this perfect function 6 months ago... where is it?"
                    </p>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='problem-item p-3 rounded bg-light border-start border-danger border-4'>
                    <h5 className='text-danger'>
                      <i className='bi bi-clock me-2'></i>Repetitive Coding
                    </h5>
                    <p className='mb-0 text-muted'>
                      Writing the same boilerplate code over and over
                    </p>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='problem-item p-3 rounded bg-light border-start border-danger border-4'>
                    <h5 className='text-danger'>
                      <i className='bi bi-brain me-2'></i>Memory Overload
                    </h5>
                    <p className='mb-0 text-muted'>
                      Can't remember every syntax and pattern
                    </p>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='problem-item p-3 rounded bg-light border-start border-danger border-4'>
                    <h5 className='text-danger'>
                      <i className='bi bi-diagram-3 me-2'></i>Scattered Knowledge
                    </h5>
                    <p className='mb-0 text-muted'>
                      Code snippets spread across files, notes, bookmarks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solutions */}
        <div className='col-12 mb-5'>
          <div className='card border-0 shadow-sm'>
            <div className='card-body p-5'>
              <h2 className='text-success mb-4'>
                <i className='bi bi-lightbulb me-2'></i>
                How Snippet Box Solves These Problems
              </h2>
              
              <div className='row g-4 mb-5'>
                <div className='col-lg-6'>
                  <div className='solution-card h-100 p-4 rounded border border-success'>
                    <h4 className='text-success mb-3'>
                      <i className='bi bi-bank me-2'></i>Personal Code Bank
                    </h4>
                    <p className='mb-3'>
                      Instead of googling "how to debounce function" every time, you have it saved with YOUR context and notes.
                    </p>
                    <div className='code-example bg-dark text-light p-3 rounded'>
                      <pre className='mb-0'><code>{`const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};`}</code></pre>
                      <div className='mt-2'>
                        <small className='text-warning'>
                          Tags: [performance, javascript, utility]
                        </small>
                        <br />
                        <small className='text-info'>
                          "Prevents excessive API calls in search"
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className='col-lg-6'>
                  <div className='solution-card h-100 p-4 rounded border border-primary'>
                    <h4 className='text-primary mb-3'>
                      <i className='bi bi-robot me-2'></i>AI-Powered Intelligence
                    </h4>
                    <div className='mb-3'>
                      <div className='comparison-item mb-2'>
                        <strong className='text-danger'>Traditional way:</strong> Manual categorization and tagging
                      </div>
                      <div className='comparison-item'>
                        <strong className='text-success'>Snippet Box way:</strong> Paste code → AI does everything
                      </div>
                    </div>
                    <div className='ai-example p-3 bg-light rounded'>
                      <h6 className='text-primary'>Example:</h6>
                      <p className='mb-2'><strong>Paste:</strong></p>
                      <code className='bg-dark text-light p-2 rounded d-block mb-2'>
                        SELECT * FROM users WHERE created_at &gt; NOW() - INTERVAL 30 DAY
                      </code>
                      <p className='mb-2'><strong>AI generates:</strong></p>
                      <ul className='list-unstyled mb-0'>
                        <li><i className='bi bi-check-circle text-success me-2'></i>Title: "Recent Users Query"</li>
                        <li><i className='bi bi-check-circle text-success me-2'></i>Language: "SQL"</li>
                        <li><i className='bi bi-check-circle text-success me-2'></i>Tags: ["database", "users", "recent", "mysql"]</li>
                        <li><i className='bi bi-check-circle text-success me-2'></i>Description: "Retrieves all users created in the last 30 days"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className='col-12 mb-5'>
          <div className='card border-0 shadow-sm'>
            <div className='card-body p-5'>
              <h2 className='text-info mb-4'>
                <i className='bi bi-bullseye me-2'></i>
                Real-World Use Cases
              </h2>
              
              <div className='row g-4'>
                <div className='col-lg-6'>
                  <h4 className='text-primary mb-3'>For Individual Developers</h4>
                  <div className='use-case-list'>
                    <div className='use-case-item p-3 mb-3 bg-light rounded'>
                      <h6 className='text-primary'>
                        <i className='bi bi-api me-2'></i>API Integration Patterns
                      </h6>
                      <p className='mb-1'>"How did I handle authentication with that API?"</p>
                      <small className='text-success'>→ Search: "auth token" → Find your working solution</small>
                    </div>
                    
                    <div className='use-case-item p-3 mb-3 bg-light rounded'>
                      <h6 className='text-primary'>
                        <i className='bi bi-diagram-2 me-2'></i>Complex Algorithms
                      </h6>
                      <p className='mb-1'>"What was that sorting algorithm I optimized?"</p>
                      <small className='text-success'>→ Search: "quicksort" → Get your implementation + notes</small>
                    </div>
                    
                    <div className='use-case-item p-3 mb-3 bg-light rounded'>
                      <h6 className='text-primary'>
                        <i className='bi bi-gear me-2'></i>Configuration Files
                      </h6>
                      <p className='mb-1'>"How did I configure webpack for that project?"</p>
                      <small className='text-success'>→ Search: "webpack" → Copy exact config that worked</small>
                    </div>
                  </div>
                </div>
                
                <div className='col-lg-6'>
                  <h4 className='text-warning mb-3'>For Development Teams</h4>
                  <div className='use-case-list'>
                    <div className='use-case-item p-3 mb-3 bg-light rounded'>
                      <h6 className='text-warning'>
                        <i className='bi bi-code-square me-2'></i>Code Standards
                      </h6>
                      <p className='mb-1'>Team lead saves: "Our standard React component structure"</p>
                      <small className='text-success'>→ Everyone uses the same pattern</small>
                    </div>
                    
                    <div className='use-case-item p-3 mb-3 bg-light rounded'>
                      <h6 className='text-warning'>
                        <i className='bi bi-lightbulb me-2'></i>Common Solutions
                      </h6>
                      <p className='mb-1'>"How do we handle error boundaries?"</p>
                      <small className='text-success'>→ Shared snippet with team's best practices</small>
                    </div>
                    
                    <div className='use-case-item p-3 mb-3 bg-light rounded'>
                      <h6 className='text-warning'>
                        <i className='bi bi-person-plus me-2'></i>Onboarding
                      </h6>
                      <p className='mb-1'>New developer joins → Gets access to team's snippet library</p>
                      <small className='text-success'>→ Learns patterns and conventions faster</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Propositions */}
        <div className='col-12 mb-5'>
          <div className='card border-0 shadow-sm'>
            <div className='card-body p-5'>
              <h2 className='text-primary mb-4'>
                <i className='bi bi-graph-up me-2'></i>
                Specific Value Propositions
              </h2>
              
              <div className='row g-4'>
                <div className='col-lg-4'>
                  <div className='value-card text-center p-4 h-100 border border-success rounded'>
                    <div className='display-6 text-success mb-3'>
                      <i className='bi bi-lightning-charge'></i>
                    </div>
                    <h4 className='text-success mb-3'>Speed & Productivity</h4>
                    <div className='comparison mb-3'>
                      <div className='mb-2'>
                        <span className='badge bg-danger'>Without Snippet Box: 5-15 minutes</span>
                      </div>
                      <small className='text-muted d-block mb-2'>
                        1. Google "react form validation"<br/>
                        2. Browse Stack Overflow<br/>
                        3. Adapt code to your needs<br/>
                        4. Debug implementation
                      </small>
                    </div>
                    <div className='comparison'>
                      <div className='mb-2'>
                        <span className='badge bg-success'>With Snippet Box: 30 seconds</span>
                      </div>
                      <small className='text-muted d-block'>
                        1. Search "form validation"<br/>
                        2. Copy your proven solution<br/>
                        3. Paste and use immediately
                      </small>
                    </div>
                  </div>
                </div>
                
                <div className='col-lg-4'>
                  <div className='value-card text-center p-4 h-100 border border-primary rounded'>
                    <div className='display-6 text-primary mb-3'>
                      <i className='bi bi-shield-check'></i>
                    </div>
                    <h4 className='text-primary mb-3'>Quality & Reliability</h4>
                    <div className='quality-list text-start'>
                      <div className='mb-2'>
                        <i className='bi bi-check-circle text-success me-2'></i>
                        <strong>Battle-tested</strong> (you've used them before)
                      </div>
                      <div className='mb-2'>
                        <i className='bi bi-check-circle text-success me-2'></i>
                        <strong>Documented</strong> (with your context)
                      </div>
                      <div className='mb-2'>
                        <i className='bi bi-check-circle text-success me-2'></i>
                        <strong>Customized</strong> (fits your coding style)
                      </div>
                      <div className='mb-2'>
                        <i className='bi bi-check-circle text-success me-2'></i>
                        <strong>Verified</strong> (no random internet code)
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className='col-lg-4'>
                  <div className='value-card text-center p-4 h-100 border border-info rounded'>
                    <div className='display-6 text-info mb-3'>
                      <i className='bi bi-graph-up-arrow'></i>
                    </div>
                    <h4 className='text-info mb-3'>Learning & Growth</h4>
                    <div className='learning-list text-start'>
                      <div className='mb-2'>
                        <i className='bi bi-arrow-right text-info me-2'></i>
                        Track your coding evolution
                      </div>
                      <div className='mb-2'>
                        <i className='bi bi-arrow-right text-info me-2'></i>
                        Build personal knowledge base
                      </div>
                      <div className='mb-2'>
                        <i className='bi bi-arrow-right text-info me-2'></i>
                        Learn from AI suggestions
                      </div>
                      <div className='mb-2'>
                        <i className='bi bi-arrow-right text-info me-2'></i>
                        Share knowledge with others
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Section */}
        <div className='col-12 mb-5'>
          <div className='card border-0 shadow-sm bg-light'>
            <div className='card-body p-5 text-center'>
              <h2 className='text-success mb-4'>
                <i className='bi bi-currency-dollar me-2'></i>
                Real ROI (Return on Investment)
              </h2>
              
              <div className='row g-4'>
                <div className='col-md-6'>
                  <div className='roi-card p-4 bg-white rounded shadow-sm'>
                    <h4 className='text-primary mb-3'>
                      <i className='bi bi-clock-history me-2'></i>Time Savings
                    </h4>
                    <div className='roi-calculation'>
                      <div className='mb-2'>
                        <span className='h5 text-primary'>10 minutes</span> saved per day
                      </div>
                      <div className='mb-2'>
                        <span className='h5 text-primary'>50 hours</span> saved per year
                      </div>
                      <div className='mb-2'>
                        If hourly rate = <span className='text-success'>$50</span>
                      </div>
                      <div className='mb-3'>
                        Annual value = <span className='h4 text-success'>$2,500</span>
                      </div>
                      <div className='roi-highlight p-3 bg-success text-white rounded'>
                        <strong>Cost of tool: FREE → ∞% ROI</strong>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className='col-md-6'>
                  <div className='roi-card p-4 bg-white rounded shadow-sm'>
                    <h4 className='text-info mb-3'>
                      <i className='bi bi-gem me-2'></i>Quality Improvements
                    </h4>
                    <div className='quality-benefits'>
                      <div className='benefit-item mb-2'>
                        <i className='bi bi-check-circle text-success me-2'></i>
                        Fewer bugs (using tested code)
                      </div>
                      <div className='benefit-item mb-2'>
                        <i className='bi bi-check-circle text-success me-2'></i>
                        Faster code reviews (familiar patterns)
                      </div>
                      <div className='benefit-item mb-2'>
                        <i className='bi bi-check-circle text-success me-2'></i>
                        Consistent architecture (reusable components)
                      </div>
                      <div className='benefit-item mb-2'>
                        <i className='bi bi-check-circle text-success me-2'></i>
                        Better documentation (AI-generated descriptions)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Summary */}
        <div className='col-12 mb-5'>
          <div className='card border-0 shadow-sm'>
            <div className='card-body p-5'>
              <h2 className='text-primary mb-4'>
                <i className='bi bi-star me-2'></i>
                Key Features Summary
              </h2>
              
              <div className='row g-4'>
                <div className='col-lg-6'>
                  <h4 className='text-success mb-3'>Current Features</h4>
                  <div className='features-list'>
                    <div className='feature-item d-flex align-items-center mb-2'>
                      <i className='bi bi-check-circle text-success me-2'></i>
                      Smart AI-powered snippet creation
                    </div>
                    <div className='feature-item d-flex align-items-center mb-2'>
                      <i className='bi bi-check-circle text-success me-2'></i>
                      Intelligent language detection
                    </div>
                    <div className='feature-item d-flex align-items-center mb-2'>
                      <i className='bi bi-check-circle text-success me-2'></i>
                      Automatic title and description generation
                    </div>
                    <div className='feature-item d-flex align-items-center mb-2'>
                      <i className='bi bi-check-circle text-success me-2'></i>
                      Smart tag suggestions
                    </div>
                    <div className='feature-item d-flex align-items-center mb-2'>
                      <i className='bi bi-check-circle text-success me-2'></i>
                      Advanced search and filtering
                    </div>
                    <div className='feature-item d-flex align-items-center mb-2'>
                      <i className='bi bi-check-circle text-success me-2'></i>
                      Code syntax highlighting
                    </div>
                    <div className='feature-item d-flex align-items-center mb-2'>
                      <i className='bi bi-check-circle text-success me-2'></i>
                      Responsive design
                    </div>
                  </div>
                </div>
                
                <div className='col-lg-6'>
                  <h4 className='text-warning mb-3'>Competitive Advantages</h4>
                  <div className='advantages-list'>
                    <div className='advantage-item p-3 mb-2 bg-light rounded border-start border-warning border-4'>
                      <strong>Zero-friction snippet creation</strong>
                      <small className='d-block text-muted'>Unique AI integration</small>
                    </div>
                    <div className='advantage-item p-3 mb-2 bg-light rounded border-start border-warning border-4'>
                      <strong>No manual tagging required</strong>
                      <small className='d-block text-muted'>AI handles everything automatically</small>
                    </div>
                    <div className='advantage-item p-3 mb-2 bg-light rounded border-start border-warning border-4'>
                      <strong>Built specifically for developers</strong>
                      <small className='d-block text-muted'>Understands coding workflows</small>
                    </div>
                    <div className='advantage-item p-3 mb-2 bg-light rounded border-start border-warning border-4'>
                      <strong>Free and open-source</strong>
                      <small className='d-block text-muted'>No licensing costs</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className='col-12 mb-5'>
          <div className='card border-0 shadow-lg bg-primary text-white'>
            <div className='card-body p-5 text-center'>
              <h2 className='mb-4'>
                <i className='bi bi-trophy me-2'></i>
                The Bottom Line
              </h2>
              
              <div className='row g-4 mb-4'>
                <div className='col-md-6'>
                  <h5 className='text-warning mb-3'>Transforms coding from:</h5>
                  <div className='transform-from'>
                    <div className='mb-2'>
                      <i className='bi bi-x-circle text-danger me-2'></i>
                      "Reinventing the wheel every time"
                    </div>
                    <div className='mb-2'>
                      <i className='bi bi-x-circle text-danger me-2'></i>
                      "Googling the same solutions repeatedly"
                    </div>
                    <div className='mb-2'>
                      <i className='bi bi-x-circle text-danger me-2'></i>
                      "Losing good code in forgotten projects"
                    </div>
                  </div>
                </div>
                
                <div className='col-md-6'>
                  <h5 className='text-warning mb-3'>To:</h5>
                  <div className='transform-to'>
                    <div className='mb-2'>
                      <i className='bi bi-check-circle text-success me-2'></i>
                      "Building on proven foundations"
                    </div>
                    <div className='mb-2'>
                      <i className='bi bi-check-circle text-success me-2'></i>
                      "Instant access to your best solutions"
                    </div>
                    <div className='mb-2'>
                      <i className='bi bi-check-circle text-success me-2'></i>
                      "Growing a valuable knowledge asset"
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='bottom-line-highlight p-4 bg-white text-dark rounded'>
                <h4 className='text-primary mb-3'>
                  <i className='bi bi-brain me-2'></i>
                  It's like having a senior developer's brain as your personal assistant
                </h4>
                <p className='lead mb-0'>
                  The app essentially monetizes your coding experience by turning every solution 
                  you create into a reusable asset that compounds your productivity over time! 
                  <i className='bi bi-rocket text-warning'></i>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className='col-12'>
          <div className='card border-0 quick-actions'>
            <div className='card-body text-center py-5'>
              <h3 className='text-primary mb-4'>
                <i className='bi bi-rocket me-2'></i>
                Ready to Transform Your Coding Experience?
              </h3>
              <div className='d-flex flex-wrap justify-content-center gap-3'>
                <a href='/editor' className='btn btn-primary btn-lg'>
                  <i className='bi bi-plus-circle me-2'></i>
                  Create Your First Snippet
                </a>
                <a href='/snippets' className='btn btn-outline-primary btn-lg'>
                  <i className='bi bi-search me-2'></i>
                  Explore Features
                </a>
                <a href='https://github.com/ManvendraSinghTanwar/snippet-box' target='_blank' rel='noopener noreferrer' className='btn btn-outline-secondary btn-lg'>
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

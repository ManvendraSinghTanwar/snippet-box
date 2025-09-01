import { NavLink } from 'react-router-dom';
import { Route } from '../../typescript/interfaces';
import { routes as clientRoutes } from './routes.json';
import ThemeToggle from '../UI/ThemeToggle';

export const Navbar = (): JSX.Element => {
  const routes = clientRoutes as Route[];

  return (
    <nav className='navbar navbar-expand-lg navbar-light sticky-top shadow-sm'>
      <div className='container-fluid px-3 px-lg-4'>
        {/* Brand */}
        <NavLink to="/" className='navbar-brand fw-bold d-flex align-items-center text-decoration-none'>
          <div className='brand-icon me-2 d-flex align-items-center justify-content-center'>
            <i className='bi bi-code-slash'></i>
          </div>
          <span className='brand-text'>Snippet Box</span>
        </NavLink>

        {/* Mobile menu button */}
        <button 
          className='navbar-toggler border-0 shadow-none' 
          type='button' 
          data-bs-toggle='collapse' 
          data-bs-target='#navbarNav'
          aria-controls='navbarNav' 
          aria-expanded='false' 
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        {/* Navigation items */}
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            {routes.map(({ name, dest }, idx) => (
              <li className='nav-item' key={idx}>
                <NavLink 
                  exact 
                  to={dest} 
                  className='nav-link px-3 py-2 rounded-pill mx-1 fw-medium position-relative'
                  activeClassName='active'
                >
                  {name === 'Home' && <i className='bi bi-house me-2'></i>}
                  {name === 'Snippets' && <i className='bi bi-collection me-2'></i>}
                  {name === 'Collections' && <i className='bi bi-folder2 me-2'></i>}
                  {name === 'Editor' && <i className='bi bi-plus-circle me-2'></i>}
                  {name === 'About' && <i className='bi bi-info-circle me-2'></i>}
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>
          
          {/* Right side items */}
          <div className='d-flex align-items-center gap-2'>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

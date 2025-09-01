import { Link } from 'react-router-dom';

export const EmptyState = (): JSX.Element => {
  return (
    <div className='col-12 d-flex flex-column align-items-center text-center py-5'>
      <div className='mb-4'>
        <div className='display-1 text-muted mb-3'>
          <i className='bi bi-collection'></i>
        </div>
        <h2 className='text-muted mb-3'>No Snippets Yet</h2>
        <p className='lead text-muted mb-4'>
          Start building your code snippet library today!
        </p>
      </div>
      
      <div className='card border-0 shadow-sm p-4 mb-4' style={{maxWidth: '500px'}}>
        <div className='card-body text-center'>
          <h5 className='card-title text-primary mb-3'>
            <i className='bi bi-lightbulb me-2'></i>
            Get Started
          </h5>
          <p className='card-text text-muted mb-4'>
            Create your first snippet to organize and search through your code easily
          </p>
          <Link 
            to='/editor' 
            className='btn btn-primary btn-lg'
          >
            <i className='bi bi-plus-circle me-2'></i>
            Create First Snippet
          </Link>
        </div>
      </div>

      <div className='row g-3 w-100' style={{maxWidth: '600px'}}>
        <div className='col-md-4'>
          <div className='text-center p-3'>
            <div className='text-primary mb-2'>
              <i className='bi bi-search h4'></i>
            </div>
            <h6 className='text-muted'>Search & Filter</h6>
            <small className='text-muted'>Find code quickly</small>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='text-center p-3'>
            <div className='text-warning mb-2'>
              <i className='bi bi-pin h4'></i>
            </div>
            <h6 className='text-muted'>Pin Important</h6>
            <small className='text-muted'>Keep favorites handy</small>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='text-center p-3'>
            <div className='text-success mb-2'>
              <i className='bi bi-folder2 h4'></i>
            </div>
            <h6 className='text-muted'>Organize</h6>
            <small className='text-muted'>Create collections</small>
          </div>
        </div>
      </div>
    </div>
  );
};

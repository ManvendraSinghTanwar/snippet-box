interface Props {
  children: JSX.Element | JSX.Element[];
}

export const Layout = (props: Props): JSX.Element => {
  return (
    <div className='container-fluid' style={{ paddingTop: '2rem', paddingBottom: '3rem', minHeight: '100vh' }}>
      <div className='container-lg'>
        <div className='row g-4'>{props.children}</div>
      </div>
    </div>
  );
};

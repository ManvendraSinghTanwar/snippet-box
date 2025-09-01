interface Props {
  children: JSX.Element | JSX.Element[];
}

export const Layout = (props: Props): JSX.Element => {
  return (
    <div className='container-lg' style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className='row g-4'>{props.children}</div>
    </div>
  );
};

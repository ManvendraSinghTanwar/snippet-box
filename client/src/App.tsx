import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Navbar } from './components/Navigation/Navbar';
import { Editor, Home, Snippet, Snippets, Collections, About } from './containers';
import { SnippetsContextProvider } from './store';
import { ThemeProvider } from './contexts/ThemeContext';

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SnippetsContextProvider>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/snippets' component={Snippets} />
            <Route path='/collections' component={Collections} />
            <Route path='/snippet/:id' component={Snippet} />
            <Route path='/editor/:id?' component={Editor} />
            <Route path='/about' component={About} />
          </Switch>
        </SnippetsContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

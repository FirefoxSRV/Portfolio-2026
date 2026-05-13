import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Always start at the top — never restore a previous scroll position.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

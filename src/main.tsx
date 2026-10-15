import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {AuthProvider} from './contexts/AuthContext.tsx';
import {ErrorBoundary} from './components/common/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!, {
  onRecoverableError(error, errorInfo) {
    // Gracefully handle recoverable concurrent rendering transitions without console error triggers
    console.debug('React recovered from render transition:', error, errorInfo);
  },
}).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);


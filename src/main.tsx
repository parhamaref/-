import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NestoraApp } from './nestora/NestoraApp.tsx';
import { NestoraErrorBoundary } from './nestora/components/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!, {
  onRecoverableError(error, errorInfo) {
    console.debug('React recovered from render transition:', error, errorInfo);
  },
}).render(
  <StrictMode>
    <NestoraErrorBoundary>
      <NestoraApp />
    </NestoraErrorBoundary>
  </StrictMode>,
);

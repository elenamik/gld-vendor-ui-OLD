import { EthersAppContext } from 'eth-hooks/context';
import React, { FC, lazy, Suspense } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';

import { ErrorBoundary, ErrorFallback } from '~~/app/common/ErrorFallback';

/**
 * See MainPage.tsx for main app component
 */
const MainPage = lazy(() => import('./routes/main/Main'));

console.log('load app');

// import postcss style file
import '~~/styles/css/tailwind-base.pcss';
import '~~/styles/css/tailwind-components.pcss';
import '~~/styles/css/tailwind-utilities.pcss';
import '~~/styles/css/app.css';

// load saved theme
const savedTheme = window.localStorage.getItem('theme');

// setup themes for theme switcher
const themes = {
  dark: './dark-theme.css',
  light: './light-theme.css',
};

/**
 * ### Summary
 * The main app component is {@see MainPage} `components/routes/main/MaingPage.tsx`
 * This component sets up all the providers, Suspense and Error handling
 * @returns
 */
const App: FC = () => {
  console.log('loading app...');
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <EthersAppContext>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ThemeSwitcherProvider themeMap={themes} defaultTheme={savedTheme || 'light'}>
            <Suspense fallback={<div />}>
              <MainPage />
            </Suspense>
          </ThemeSwitcherProvider>
        </ErrorBoundary>
      </EthersAppContext>
    </ErrorBoundary>
  );
};

export default App;

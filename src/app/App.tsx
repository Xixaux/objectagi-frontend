'use client';

import { useMemo } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { enUS } from 'date-fns/locale/en-US';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@objectagi/utils/ErrorBoundary';
import AppContext from 'src/contexts/AppContext';
import { ObjectAGISettingsProvider } from '@objectagi/core/ObjectAGISettings/ObjectAGISettingsProvider';
import { I18nProvider } from '@i18n/I18nProvider';
import store from '../store/store';
import MainThemeProvider from '../contexts/MainThemeProvider';

// Create a QueryClient instance with reasonable defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

type AppProps = {
  children?: React.ReactNode;
};

/**
 * The main App component.
 */
function App(props: AppProps) {
  const { children } = props;
  const val = useMemo(() => ({}), []);

  return (
    <ErrorBoundary>
      <AppContext.Provider value={val}>
        {/* Date Picker Localization Provider */}
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
          {/* Redux Store Provider */}
          <Provider store={store}>
            <ObjectAGISettingsProvider>
              <I18nProvider>
                {/* Theme Provider – applies MUI theme derived from settings */}
                <MainThemeProvider>
                  <CssBaseline /> {/* Ensures body/background updates on mode change */}
                  {/* QueryClientProvider for React Query */}
                  <QueryClientProvider client={queryClient}>
                    {children}
                  </QueryClientProvider>
                </MainThemeProvider>
              </I18nProvider>
            </ObjectAGISettingsProvider>
          </Provider>
        </LocalizationProvider>
      </AppContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
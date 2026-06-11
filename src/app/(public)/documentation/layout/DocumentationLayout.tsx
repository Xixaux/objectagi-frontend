'use client';

import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ObjectAGINavigation from '@objectagi/core/ObjectAGINavigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@objectagi/hooks/useThemeMediaQuery';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import usePathname from '@objectagi/hooks/usePathname';
import { Button } from '@mui/material';
import Link from '@objectagi/core/Link';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import DocumentationNavigation from '../DocumentationNavigation';
import DocumentationSidebarHeader from './DocumentationSidebarHeader';
import MainProjectSelection from '@/components/MainProjectSelection';

const SidebarContent = styled('div')(({ theme }) => ({
  paddingLeft: '66px',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  backgroundColor: '#f7f7f9',
  height: '100%',
  overflowY: 'auto',

  '& .navigation': {
    '& > .MuiList-root': {
      backgroundColor: '#f7f7f9',
    },
    '& .item-badge': {
      backgroundColor: '#4CAF50 !important',
      color: 'white !important',
      border: 'none !important',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      display: 'inline-flex',
      alignItems: 'center',
    },
  },
}));

type DocumentationLayoutProps = {
  children: React.ReactNode;
};

export default function DocumentationLayout({ children }: DocumentationLayoutProps) {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const pathname = usePathname();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setLeftSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* LEFT SIDEBAR */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-96 bg-gray-50 shadow-xl transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
          leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent>
          <DocumentationSidebarHeader className="mb-8 px-4" />
          <ObjectAGINavigation
            className="navigation"
            navigation={DocumentationNavigation.children}
          />
        </SidebarContent>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200">
          <div
            className={clsx(
              'flex items-center justify-between px-4 py-4',
              isMobile ? 'flex-col space-y-3' : 'flex-row space-y-0'
            )}
          >
            {/* LEFT: Project Selector + Menu + Breadcrumb */}
            <div className="flex flex-1 items-center space-x-3 min-w-0">
              <div className="min-w-[180px]">
                <MainProjectSelection />
              </div>

             

              <IconButton
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                aria-label="toggle sidebar"
                size="small"
              >
                <ObjectAGISvgIcon size={18}>heroicons-outline:bars-3</ObjectAGISvgIcon>
              </IconButton>

              <div className={clsx('flex-1 min-w-0', isMobile && 'mt-2')}>
                <PageBreadcrumb
                  skipHome
                  maxItems={isMobile ? 2 : 5}
                  className={isMobile ? 'text-sm [&>span]:line-clamp-1' : 'text-base'}
                />
              </div>
            </div>

            {/* RIGHT: Back to Dashboard */}
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="primary"
              size="small"
              startIcon={<ObjectAGISvgIcon size={14}>heroicons-outline:arrow-turn-left-up</ObjectAGISvgIcon>}
              className="whitespace-nowrap px-3 py-1.5 text-sm"
            >
              Dashboard
            </Button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="w-full p-4 md:p-6">
            <div className="prose prose-lg max-w-3xl mx-auto dark:prose-invert pb-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {leftSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setLeftSidebarOpen(false)}
        />
      )}
    </div>
  );
}
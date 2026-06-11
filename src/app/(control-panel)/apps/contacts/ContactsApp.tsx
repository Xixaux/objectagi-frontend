// File: ContactsApp.tsx
'use client';

import ObjectAGIPageSimple from '@objectagi/core/ObjectAGIPageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@objectagi/hooks/useThemeMediaQuery';
import useNavigate from '@objectagi/hooks/useNavigate';
import ContactsHeader from './ContactsHeader';
import ContactsList from './contact-list/ContactsList';
import ContactsSidebarContent from './ContactsSidebarContent';
import { Country, Tag, fetchCountries, fetchTags } from './ContactsApi';

const Root = styled(ObjectAGIPageSimple)(({ theme }) => ({
  '& .container': {
    maxWidth: '100%!important',
  },
  '& .ObjectAGIPageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`,
  },
}));

type ContactsAppProps = {
  children?: React.ReactNode;
};

function ContactsApp(props: ContactsAppProps) {
  const { children } = props;
  const navigate = useNavigate();
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const pageLayout = useRef(null);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  useEffect(() => {
    console.log('Route params changed:', routeParams);
    setRightSidebarOpen(!!routeParams.contactId);
  }, [routeParams]);

  useEffect(() => {
    console.log('Fetching countries and tags');
    async function loadData() {
      try {
        const [countriesData, tagsData] = await Promise.all([fetchCountries(), fetchTags()]);
        setCountries(countriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Failed to load countries or tags:', error);
      }
    }
    loadData();
  }, []);

  return (
    <Root
      header={<ContactsHeader />}
      content={<ContactsList />}
      ref={pageLayout}
      rightSidebarContent={<ContactsSidebarContent countries={countries} tags={tags}>{children}</ContactsSidebarContent>}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => navigate('/apps/contacts')}
      rightSidebarWidth={640}
      rightSidebarVariant="temporary"
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default ContactsApp;
// File: ContactsSidebarContent.tsx
'use client';

import Typography from '@mui/material/Typography';
import { Country, Tag } from './ContactsApi';

type ContactsSidebarContentProps = {
  countries: Country[];
  tags: Tag[];
  children?: React.ReactNode;
};

function ContactsSidebarContent(props: ContactsSidebarContentProps) {
  const { countries, tags, children } = props;

  console.log('Sidebar content:', { countries, tags });

  return (
    <div className="p-4">
      <Typography variant="h6">Contact Details</Typography>
      {children}
      <Typography variant="subtitle1" className="mt-4">
        Countries
      </Typography>
      {countries.length === 0 ? (
        <Typography color="text.secondary">No countries available</Typography>
      ) : (
        countries.map((country) => (
          <Typography key={country.id}>
            {country.title} ({country.iso})
          </Typography>
        ))
      )}
      <Typography variant="subtitle1" className="mt-4">
        Tags
      </Typography>
      {tags.length === 0 ? (
        <Typography color="text.secondary">No tags available</Typography>
      ) : (
        tags.map((tag) => (
          <Typography key={tag.id}>{tag.title}</Typography>
        ))
      )}
    </div>
  );
}

export default ContactsSidebarContent;
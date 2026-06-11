// File: ContactListItem.tsx
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@objectagi/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Contact } from '../ContactsApi';

type ContactListItemPropsType = {
  contact: Contact;
};

function ContactListItem(props: ContactListItemPropsType) {
  const { contact } = props;

  const secondaryText = contact.emails?.[0]?.email || contact.phoneNumbers?.[0]?.phoneNumber || '';

  console.log('Rendering contact:', contact.name, secondaryText);

  return (
    <>
      <ListItemButton
        className="px-8 py-4"
        sx={{ bgcolor: 'background.paper' }}
        component={NavLinkAdapter}
        to={`/apps/contacts/${contact.id}`}
      >
        <ListItemAvatar>
          <Avatar alt={contact.name} src={contact.avatar} />
        </ListItemAvatar>
        <ListItemText
          classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
          primary={contact.name}
          secondary={
            secondaryText ? (
              <Typography className="inline" component="span" variant="body2" color="text.secondary">
                {secondaryText}
              </Typography>
            ) : null
          }
        />
      </ListItemButton>
      <Divider />
    </>
  );
}

export default ContactListItem;
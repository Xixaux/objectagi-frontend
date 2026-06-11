import { useGetContactsItemQuery } from './ContactsApi';

type ContactTitleProps = {
	contactId?: string;
};

function ContactTitle(props: ContactTitleProps) {
	const { contactId } = props;
	const { data: contact } = useGetContactsItemQuery(contactId, {
		skip: !contactId
	});

	return contact?.name || 'eHumans';
}

export default ContactTitle;

import { Contact, ContactEmail } from '../ContactsApi';

export function ContactEmailModel(data: Partial<ContactEmail> = {}): { email: string; type: string } {
    return {
        email: data.email || '',
        type: data.label || '',
    };
}

export function ContactPhoneModel(data: Partial<{ number: string; type: string; country: string }> = {}): { number: string; type: string; country: string } {
    return {
        number: data.number || '',
        type: data.type || '',
        country: data.country || 'US',
    };
}

export default function ContactModel(data: Partial<Contact> = {}): Contact {
    return {
        id: data.id || crypto.randomUUID(),
        avatar: data.avatar || '',
        background: data.background || '',
        name: data.name || '',
        about: data.about || '',
        status: data.status || 'Online',
        countryId: data.countryId || null,
        country: data.country || null,
        emails: data.emails?.$values || [],
        phoneNumbers: data.phoneNumbers?.$values || [],
        contactTags: data.contactTags?.$values || [],
        title: data.title || '',
        company: data.company || '',
        birthday: data.birthday || '',
        address: data.address || '',
        notes: data.notes || '',
    };
}
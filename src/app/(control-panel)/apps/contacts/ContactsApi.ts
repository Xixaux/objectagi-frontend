// File: src/app/(control-panel)/apps/contacts/ContactsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import ObjectAGIUtils from '@objectagi/utils';
import { createSelector } from '@reduxjs/toolkit';

export type ContactPhoneNumber = {
    id: string;
    contactId: string;
    country: string;
    phoneNumber: string;
    label?: string;
    $id?: string;
};

export type ContactEmail = {
    id: string;
    contactId: string;
    email: string;
    label?: string;
    $id?: string;
};

export type Tag = {
    id: string;
    title: string;
    $id?: string;
};

export type ContactTag = {
    contactId: string;
    tagId: string;
    tag?: Tag;
    contact?: any;
    $id?: string;
    $ref?: string;
};

export type Country = {
    id: string;
    title: string;
    iso: string;
    code?: string;
    flagImagePos?: string;
    $id?: string;
};

export type Contact = {
    id: string;
    avatar?: string;
    background?: string;
    name: string;
    about?: string;
    status?: string;
    countryId?: string;
    country?: Country;
    emails?: ContactEmail[] | { $id?: string; $values: ContactEmail[] };
    phoneNumbers?: ContactPhoneNumber[] | { $id?: string; $values: ContactPhoneNumber[] };
    contactTags?: ContactTag[] | { $id?: string; $values: ContactTag[] };
    title?: string;
    company?: string;
    birthday?: string;
    address?: string;
    notes?: string;
    $id?: string;
};

export type GroupedContacts = {
    group: string;
    children?: Contact[];
};

export type AccumulatorType = Record<string, GroupedContacts>;

export const contactsApi = createApi({
    reducerPath: 'contactsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/MessengerContacts',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getContactsList: builder.query<Contact[], void>({
            query: () => '',
            transformResponse: (response: Contact[]) => {
                console.log('Contacts fetched:', response);
                if (!Array.isArray(response)) {
                    console.error('API response is not an array:', response);
                    return [];
                }
                return response;
            },
        }),
        getContactById: builder.query<Contact, string>({
            query: (id) => `/${id}`,
        }),
        getContactsCountries: builder.query<Country[], void>({
            query: () => '/countries',
            transformResponse: (response: Country[]) => {
                console.log('Countries fetched:', response);
                if (!Array.isArray(response)) {
                    console.warn('Countries response is not an array:', response);
                    return [];
                }
                return response;
            },
        }),
        getContactsTags: builder.query<Tag[], void>({
            query: () => '/tags',
            transformResponse: (response: Tag[]) => {
                console.log('Tags fetched:', response);
                if (!Array.isArray(response)) {
                    console.warn('Tags response is not an array:', response);
                    return [];
                }
                return response;
            },
        }),
    }),
});

export const {
    useGetContactsListQuery,
    useGetContactByIdQuery,
    useGetContactsCountriesQuery,
    useGetContactsTagsQuery,
} = contactsApi;

// Plain fetch functions for ContactsApp.tsx and ContactsHeader.tsx
export async function fetchContactsList(): Promise<Contact[]> {
    console.log('Starting fetchContactsList');
    try {
        const response = await fetch('/api/MessengerContacts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Fetch response status:', response.status, response.statusText);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Contacts fetched:', data);
        if (!Array.isArray(data)) {
            console.error('API response is not an array:', data);
            return [];
        }
        return data;
    } catch (error) {
        console.error('Fetch contacts error:', error);
        return [];
    }
}

export async function fetchCountries(): Promise<Country[]> {
    console.log('Fetching countries from API');
    try {
        const response = await fetch('/api/MessengerContacts/countries', {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Countries response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Countries fetched:', data);
        if (!Array.isArray(data)) {
            console.warn('Countries response is not an array:', data);
            return [];
        }
        return data;
    } catch (error) {
        console.error('Fetch countries error:', error);
        return [];
    }
}

export async function fetchTags(): Promise<Tag[]> {
    console.log('Fetching tags from API');
    try {
        const response = await fetch('/api/MessengerContacts/tags', {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Tags response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Tags fetched:', data);
        if (!Array.isArray(data)) {
            console.warn('Tags response is not an array:', data);
            return [];
        }
        return data;
    } catch (error) {
        console.error('Fetch tags error:', error);
        return [];
    }
}

export const selectSearchText = (state: any) => state?.contactsApp?.searchText || '';

export const selectFilteredContactList = (contacts: Contact[]) =>
    createSelector([selectSearchText], (searchText) => {
        console.log('Filtering contacts with searchText:', searchText);
        if (!Array.isArray(contacts)) {
            console.warn('Contacts is not an array:', contacts);
            return [];
        }
        if (searchText.length === 0) {
            return contacts;
        }
        return ObjectAGIUtils.filterArrayByString<Contact>(contacts, searchText);
    });

export const selectGroupedFilteredContacts = (contacts: Contact[]) =>
    createSelector([selectFilteredContactList(contacts)], (filteredContacts) => {
        console.log('Grouping filtered contacts:', { count: filteredContacts.length, data: filteredContacts });
        if (!Array.isArray(filteredContacts)) {
            console.warn('Filtered contacts is not an array:', filteredContacts);
            return {};
        }
        const sortedContacts = [...filteredContacts].sort((a, b) =>
            a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
        );
        const groupedObject: Record<string, GroupedContacts> = sortedContacts.reduce<AccumulatorType>((r, e) => {
            if (!e?.name) return r;
            const group = e.name[0]?.toUpperCase() || '#';
            if (!r[group]) r[group] = { group, children: [e] };
            else r[group].children?.push(e);
            return r;
        }, {});
        return groupedObject;
    });
import { apiService as api } from 'src/store/apiService';
import { PartialObjectDeep } from 'type-fest/source/partial-deep';
import ChatMessageModel from './models/ChatMessageModel';

const demoUserId = 'cfaad35d-07a3-4447-a6c3-d8c3d54fd5fd';

export const addTagTypes = [
    'messenger_contacts',
    'messenger_contact',
    'messenger_chats',
    'messenger_chat',
    'messenger_user_profile',
] as const;

const MessengerApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            // Disabled getMessengerContacts due to invalid /ContactIds endpoint
            /*
            getMessengerContacts: build.query<GetMessengerContactsApiResponse, GetMessengerContactsApiArg>({
              query: () => ({ url: `/api/M_messenger/ContactIds` }),
              providesTags: ['messenger_contacts'],
              async onQueryStarted(arg, { queryFulfilled }) {
                try {
                  const { data } = await queryFulfilled;
                  console.log('Contacts API Response:', data);
                } catch (error) {
                  console.error('Contacts API Error:', error);
                }
              },
            }),
            */
            getMessengerContact: build.query<GetMessengerContactApiResponse, GetMessengerContactApiArg>({
                query: (contactId) => ({
                    url: `/api/M_messenger/contacts/${contactId}`,
                }),
                providesTags: ['messenger_contact'],
                async onQueryStarted(arg, { queryFulfilled }) {
                    try {
                        const { data } = await queryFulfilled;
                        console.log('Contact API Response:', { contactId: arg, data });
                    } catch (error) {
                        console.error('Contact API Error:', { contactId: arg, error });
                    }
                },
            }),
            updateMessengerContact: build.mutation<UpdateMessengerContactApiResponse, UpdateMessengerContactApiArg>({
                query: (contact) => ({
                    url: `/api/M_messenger/contacts/${contact.id}`,
                    method: 'PUT',
                    body: contact,
                }),
                invalidatesTags: ['messenger_contact', 'messenger_contacts'],
            }),
            deleteMessengerContact: build.mutation<DeleteMessengerContactApiResponse, DeleteMessengerContactApiArg>({
                query: (contactId) => ({
                    url: `/api/M_messenger/contacts/${contactId}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['messenger_contact', 'messenger_contacts'],
            }),
            getMessengerChats: build.query<GetMessengerChatsApiResponse, GetMessengerChatsApiArg>({
                query: () => ({ url: `/api/M_messenger/chat-list` }),
                providesTags: ['messenger_chats'],
                async onQueryStarted(arg, { queryFulfilled }) {
                    try {
                        const { data } = await queryFulfilled;
                        console.log('Chats API Response:', data);
                    } catch (error) {
                        console.error('Chats API Error:', error);
                    }
                },
            }),
            createMessengerChat: build.mutation<CreateMessengerChatApiResponse, CreateMessengerChatApiArg>({
                query: (chat) => ({
                    url: `/api/M_messenger/chat-list`,
                    method: 'POST',
                    body: chat,
                }),
                invalidatesTags: ['messenger_chats'],
            }),
            getMessengerChat: build.query<GetMessengerChatApiResponse, GetMessengerChatApiArg>({
                query: (chatId) => ({
                    url: `/api/M_messenger/messages`,
                    params: { chatId },
                }),
                providesTags: ['messenger_chat'],
            }),
            deleteMessengerChat: build.mutation<DeleteMessengerChatApiResponse, DeleteMessengerChatApiArg>({
                query: (chatId) => ({
                    url: `/api/M_messenger/messages/${chatId}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['messenger_chats'],
            }),
            sendMessengerMessage: build.mutation<SendMessengerMessageApiResponse, SendMessengerMessageApiArg>({
                query: ({ chatId, message }) => ({
                    url: `/api/M_messenger/messages`,
                    method: 'POST',
                    body: ChatMessageModel({
                        chatId,
                        contactId: demoUserId,
                        value: message,
                    }),
                }),
                // Add the onQueryStarted hook here to log the request and response
                async onQueryStarted(arg, { queryFulfilled }) {
                    try {
                        console.log('Sending message:', arg);
                        const { data } = await queryFulfilled;
                        console.log('Message sent successfully. Response:', data);
                    } catch (error) {
                        console.error('Failed to send message:', { arg, error });
                    }
                },
                invalidatesTags: ['messenger_chat', 'messenger_chats'],
            }),
            getMessengerUserProfile: build.query<GetMessengerUserProfileApiResponse, GetMessengerUserProfileApiArg>({
                query: () => ({ url: `/api/M_messenger/profiles/${demoUserId}` }),
                providesTags: ['messenger_user_profile'],
                async onQueryStarted(arg, { queryFulfilled }) {
                    try {
                        const { data } = await queryFulfilled;
                        console.log('Profile API Response:', data);
                    } catch (error) {
                        console.error('Profile API Error:', error);
                    }
                },
            }),
            updateMessengerUserProfile: build.mutation<
                UpdateMessengerUserProfileApiResponse,
                UpdateMessengerUserProfileApiArg
            >({
                query: (profile) => ({
                    url: `/api/M_messenger/profiles/${demoUserId}`,
                    method: 'PUT',
                    body: profile,
                }),
                invalidatesTags: ['messenger_user_profile'],
            }),
        }),
        overrideExisting: false,
    });

export default MessengerApi;

// Type definitions (unchanged)
export type GetMessengerContactsApiResponse = Contact[];
export type GetMessengerContactsApiArg = void;

export type GetMessengerContactApiResponse = Contact;
export type GetMessengerContactApiArg = string;

export type UpdateMessengerContactApiResponse = unknown;
export type UpdateMessengerContactApiArg = Contact;

export type DeleteMessengerContactApiResponse = unknown;
export type DeleteMessengerContactApiArg = string;

export type GetMessengerChatsApiResponse = Chat[];
export type GetMessengerChatsApiArg = void;

export type CreateMessengerChatApiResponse = Chat;
export type CreateMessengerChatApiArg = PartialObjectDeep<Chat, object>;

export type GetMessengerChatApiResponse = Message[];
export type GetMessengerChatApiArg = string;

export type DeleteMessengerChatApiResponse = unknown;
export type DeleteMessengerChatApiArg = string;

export type SendMessengerMessageApiArg = {
    chatId: string;
    message: string;
};
export type SendMessengerMessageApiResponse = Message[];

export type GetMessengerUserProfileApiResponse = Profile;
export type GetMessengerUserProfileApiArg = void;

export type UpdateMessengerUserProfileApiResponse = Profile;
export type UpdateMessengerUserProfileApiArg = PartialObjectDeep<Profile, object>;

export type ContactStatusType = 'online' | 'do-not-disturb' | 'away' | 'offline';

export type Contact = {
    id: string;
    avatar?: string | null;
    name: string;
    about: string;
    status: ContactStatusType;
    details: {
        emails: {
            email: string;
            label: string;
        }[];
        phoneNumbers: {
            country: string;
            phoneNumber: string;
            label: string;
        }[];
        title?: string;
        company: string;
        birthday: string;
        address: string;
    };
    attachments: {
        media: string[];
        docs: string[];
        links: string[];
    };
};

export type Chat = {
    id: string;
    contactIds: string[];
    unreadCount: number;
    muted: boolean;
    lastMessage: string;
    lastMessageAt: string;
};

export type Message = {
    id: string;
    chatId: string;
    contactId: string;
    value: string;
    createdAt: string;
};

export type Task = {
    id: string;
    type: string;
    title: string;
    notes: string;
    completed: boolean;
    dueDate?: string | null;
    priority: number;
    tags: string[];
    assignedTo?: string;
    subTasks: {
        id: string;
        title: string;
        completed: boolean;
    }[];
    order: number;
};

export type Profile = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    about: string;
};

export const {
    useGetMessengerContactsQuery,
    useGetMessengerContactQuery,
    useUpdateMessengerContactMutation,
    useDeleteMessengerContactMutation,
    useGetMessengerChatsQuery,
    useCreateMessengerChatMutation,
    useGetMessengerChatQuery,
    useDeleteMessengerChatMutation,
    useGetMessengerUserProfileQuery,
    useUpdateMessengerUserProfileMutation,
    useSendMessengerMessageMutation,
} = MessengerApi;
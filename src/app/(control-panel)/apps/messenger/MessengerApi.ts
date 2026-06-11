import { apiService as api } from 'src/store/apiService';
import { PartialObjectDeep } from 'type-fest/source/partial-deep';

const demoUserId = 'cfaad35d-07a3-4447-a6c3-d8c3d54fd5df';

export const addTagTypes = [
  'messenger_contacts',
  'messenger_contact',
  'messenger_chats',
  'messenger_chat',
  'messenger_user_profile',
  'process_output',
  'process_output_status',
  'cognitive_summary',
  'thought_stream',
] as const;

const MessengerApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getMessengerContacts: build.query<GetMessengerContactsApiResponse, GetMessengerContactsApiArg>({
        query: () => ({ url: `/api/M_messenger/contacts` }),
        providesTags: ['messenger_contacts'],
      }),
      getMessengerContact: build.query<GetMessengerContactApiResponse, GetMessengerContactApiArg>({
        query: (contactId) => ({
          url: `/api/M_messenger/contacts/${contactId}`,
        }),
        providesTags: ['messenger_contact'],
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
          params: { M_chatId: chatId },
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
          body: {
            M_ChatId: chatId,
            M_ContactId: demoUserId,
            M_Message: message,
          },
        }),
        invalidatesTags: ['messenger_chat', 'messenger_chats'],
      }),
      getMessengerUserProfile: build.query<GetMessengerUserProfileApiResponse, GetMessengerUserProfileApiArg>({
        query: () => ({ url: `/api/M_messenger/profiles/${demoUserId}` }),
        providesTags: ['messenger_user_profile'],
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
      getProcessOutput: build.query<GetProcessOutputApiResponse, GetProcessOutputApiArg>({
        query: (userMessage) => ({
          url: `/api/ProcessOutput/process-output`,
          params: { userMessage },
        }),
        providesTags: ['process_output'],
      }),
      getProcessOutputStatus: build.query<GetProcessOutputStatusApiResponse, GetProcessOutputStatusApiArg>({
        query: () => ({
          url: `/api/ProcessOutput/process-output-status`,
        }),
        providesTags: ['process_output_status'],
      }),
      getCognitiveSummary: build.query<GetCognitiveSummaryApiResponse, void>({
        query: () => ({
          url: `/api/ProcessOutput/cognitive-summary`,
        }),
        providesTags: ['cognitive_summary'],
      }),
      getThoughtStream: build.query<GetThoughtStreamApiResponse, void>({
        query: () => ({
          url: `/api/ProcessOutput/thought-stream`,
        }),
        providesTags: ['thought_stream'],
      }),
    }),
    overrideExisting: false,
  });

export default MessengerApi;

// Type definitions
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

export type SendMessengerMessageApiResponse = Message[];
export type SendMessengerMessageApiArg = {
  chatId: string;
  message: string;
};

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

export type Profile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  about: string;
  status: ContactStatusType;
};

export type GetProcessOutputApiResponse = { output: string };
export type GetProcessOutputApiArg = string | undefined;

export type GetProcessOutputStatusApiResponse = { isReady: boolean };
export type GetProcessOutputStatusApiArg = void;

export type GetCognitiveSummaryApiResponse = { summary: string };
export type GetThoughtStreamApiResponse = { stream: string };

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
  useGetProcessOutputQuery,
  useGetProcessOutputStatusQuery,
  useGetCognitiveSummaryQuery,
  useGetThoughtStreamQuery,
} = MessengerApi;
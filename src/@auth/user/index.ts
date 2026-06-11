import { ObjectAGISettingsConfigType } from '@objectagi/core/ObjectAGISettings/ObjectAGISettings';
import { PartialDeep } from 'type-fest';

/**
 * The type definition for a user object.
 */
export type User = {
	id: string;
	role: string[] | string | null;
	displayName: string;
	photoURL?: string;
	email?: string;
	shortcuts?: string[];
	settings?: PartialDeep<ObjectAGISettingsConfigType>;
	loginRedirectUrl?: string; // The URL to redirect to after login.
};

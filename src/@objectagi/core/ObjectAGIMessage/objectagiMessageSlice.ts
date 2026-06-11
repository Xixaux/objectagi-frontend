import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { ReactElement } from 'react';
import rootReducer from '@/store/rootReducer';

/**
 * The type definition for the initial state of the message slice.
 */
type initialStateProps = {
	state: boolean;
	options: {
		variant: 'success' | 'error' | 'warning' | 'info';
		anchorOrigin: {
			vertical: 'top' | 'bottom';
			horizontal: 'left' | 'center' | 'right';
		};
		autoHideDuration: number | null;
		message: ReactElement | string;
	};
};

/**
 * The initial state of the message slice.
 */
const initialState: initialStateProps = {
	state: false,
	options: {
		variant: 'info',
		anchorOrigin: {
			vertical: 'top',
			horizontal: 'center'
		},
		autoHideDuration: 2000,
		message: 'Hi'
	}
};

/**
 * The Message slice.
 */
export const objectagiMessageSlice = createSlice({
	name: 'objectagiMessage',
	initialState,
	reducers: {
		showMessage(state, action: PayloadAction<Partial<initialStateProps['options']>>) {
			state.state = true;
			state.options = {
				...initialState.options,
				...action.payload
			};
		},
		hideMessage(state) {
			state.state = false;
		}
	},
	selectors: {
		selectObjectAGIMessageState: (objectagiMessage) => objectagiMessage.state,
		selectObjectAGIMessageOptions: (objectagiMessage) => objectagiMessage.options
	}
});

/**
 * Lazy load
 * */
rootReducer.inject(objectagiMessageSlice);
const injectedSlice = objectagiMessageSlice.injectInto(rootReducer);
declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof objectagiMessageSlice> {}
}

export const { hideMessage, showMessage } = objectagiMessageSlice.actions;

export const { selectObjectAGIMessageOptions, selectObjectAGIMessageState } = injectedSlice.selectors;

export type messageSliceType = typeof objectagiMessageSlice;

export default objectagiMessageSlice.reducer;

import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { ReactElement } from 'react';
import rootReducer from '@/store/rootReducer';

type InitialStateProps = {
	open: boolean;
	children: ReactElement | string;
};

/**
 * The initial state of the dialog slice.
 */
const initialState: InitialStateProps = {
	open: false,
	children: ''
};

/**
 * The ObjectAGI Dialog slice
 */
export const objectagiDialogSlice = createSlice({
	name: 'objectagiDialog',
	initialState,
	reducers: {
		openDialog: (state, action: PayloadAction<{ children: InitialStateProps['children'] }>) => {
			state.open = true;
			state.children = action.payload.children;
		},
		closeDialog: () => initialState
	},
	selectors: {
		selectObjectAGIDialogState: (objectagiDialog) => objectagiDialog.open,
		selectObjectAGIDialogProps: (objectagiDialog) => objectagiDialog
	}
});

/**
 * Lazy load
 * */
rootReducer.inject(objectagiDialogSlice);
const injectedSlice = objectagiDialogSlice.injectInto(rootReducer);
declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof objectagiDialogSlice> {}
}

export const { closeDialog, openDialog } = objectagiDialogSlice.actions;

export const { selectObjectAGIDialogState, selectObjectAGIDialogProps } = injectedSlice.selectors;

export type dialogSliceType = typeof objectagiDialogSlice;

export default objectagiDialogSlice.reducer;

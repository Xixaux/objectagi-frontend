import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from 'src/store/store';
import { PartialDeep } from 'type-fest';
import { ObjectAGIFlatNavItemType, ObjectAGINavItemType } from '@objectagi/core/ObjectAGINavigation/types/ObjectAGINavItemType';
import ObjectAGINavigationHelper from '@objectagi/utils/ObjectAGINavigationHelper';
import ObjectAGINavItemModel from '@objectagi/core/ObjectAGINavigation/models/ObjectAGINavItemModel';
import navigationConfig from 'src/configs/navigationConfig';

const navigationAdapter = createEntityAdapter<ObjectAGIFlatNavItemType>();

const emptyInitialState = navigationAdapter.getInitialState([]);

const initialState = navigationAdapter.upsertMany(
	emptyInitialState,
	ObjectAGINavigationHelper.flattenNavigation(navigationConfig)
);

/**
 * Redux Thunk actions related to the navigation store state
 */
/**
 * Appends a navigation item to the navigation store state.
 */
export const appendNavigationItem =
	(item: ObjectAGINavItemType, parentId?: string | null): AppThunk =>
	async (dispatch, getState) => {
		const AppState = getState();
		const navigation = ObjectAGINavigationHelper.unflattenNavigation(selectNavigationAll(AppState));

		dispatch(setNavigation(ObjectAGINavigationHelper.appendNavItem(navigation, ObjectAGINavItemModel(item), parentId)));

		return Promise.resolve();
	};

/**
 * Prepends a navigation item to the navigation store state.
 */
export const prependNavigationItem =
	(item: ObjectAGINavItemType, parentId?: string | null): AppThunk =>
	async (dispatch, getState) => {
		const AppState = getState();
		const navigation = ObjectAGINavigationHelper.unflattenNavigation(selectNavigationAll(AppState));

		dispatch(setNavigation(ObjectAGINavigationHelper.prependNavItem(navigation, ObjectAGINavItemModel(item), parentId)));

		return Promise.resolve();
	};

/**
 * Adds a navigation item to the navigation store state at the specified index.
 */
export const updateNavigationItem =
	(id: string, item: PartialDeep<ObjectAGINavItemType>): AppThunk =>
	async (dispatch, getState) => {
		const AppState = getState();
		const navigation = ObjectAGINavigationHelper.unflattenNavigation(selectNavigationAll(AppState));

		dispatch(setNavigation(ObjectAGINavigationHelper.updateNavItem(navigation, id, item)));

		return Promise.resolve();
	};

/**
 * Removes a navigation item from the navigation store state.
 */
export const removeNavigationItem =
	(id: string): AppThunk =>
	async (dispatch, getState) => {
		const AppState = getState();
		const navigation = ObjectAGINavigationHelper.unflattenNavigation(selectNavigationAll(AppState));

		dispatch(setNavigation(ObjectAGINavigationHelper.removeNavItem(navigation, id)));

		return Promise.resolve();
	};

export const {
	selectAll: selectNavigationAll,
	selectIds: selectNavigationIds,
	selectById: selectNavigationItemById
} = navigationAdapter.getSelectors<RootState>((state) => state.navigation);

/**
 * The navigation slice
 */
export const navigationSlice = createSlice({
	name: 'navigation',
	initialState,
	reducers: {
		setNavigation(state, action: PayloadAction<ObjectAGINavItemType[]>) {
			return navigationAdapter.setAll(state, ObjectAGINavigationHelper.flattenNavigation(action.payload));
		},
		resetNavigation: () => initialState
	}
});

export const { setNavigation, resetNavigation } = navigationSlice.actions;

export type navigationSliceType = typeof navigationSlice;

export default navigationSlice.reducer;

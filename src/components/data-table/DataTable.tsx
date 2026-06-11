import { MaterialReactTable, useMaterialReactTable, MaterialReactTableProps, MRT_Icons } from 'material-react-table';
import _ from 'lodash';
import { useMemo } from 'react';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import { Theme } from '@mui/material/styles/createTheme';
import DataTableTopToolbar from './DataTableTopToolbar';

const tableIcons: Partial<MRT_Icons> = {
	ArrowDownwardIcon: (props) => (
		<ObjectAGISvgIcon
			size={20}
			{...props}
		>
			heroicons-outline:arrow-down-circle
		</ObjectAGISvgIcon>
	),
	ClearAllIcon: () => <ObjectAGISvgIcon size={20}>heroicons-outline:adjustments-horizontal</ObjectAGISvgIcon>,
	DensityLargeIcon: () => <ObjectAGISvgIcon size={20}>heroicons-outline:bars-3-bottom-left</ObjectAGISvgIcon>,
	DensityMediumIcon: () => <ObjectAGISvgIcon size={20}>heroicons-outline:bars-3</ObjectAGISvgIcon>,
	DensitySmallIcon: () => <ObjectAGISvgIcon size={20}>heroicons-outline:bars-2</ObjectAGISvgIcon>,
	DragHandleIcon: () => (
		<ObjectAGISvgIcon
			className="rotate-45"
			size={14}
		>
			heroicons-outline:arrows-pointing-out
		</ObjectAGISvgIcon>
	),
	FilterListIcon: (props) => (
		<ObjectAGISvgIcon
			size={16}
			{...props}
		>
			heroicons-outline:funnel
		</ObjectAGISvgIcon>
	),
	FilterListOffIcon: () => <ObjectAGISvgIcon size={20}>heroicons-outline:funnel</ObjectAGISvgIcon>,
	FullscreenExitIcon: () => <ObjectAGISvgIcon size={20}>heroicons-outline:arrows-pointing-in</ObjectAGISvgIcon>,
	FullscreenIcon: () => <ObjectAGISvgIcon size={20}>heroicons-outline:arrows-pointing-out</ObjectAGISvgIcon>,
	SearchIcon: (props) => (
		<ObjectAGISvgIcon
			color="action"
			size={20}
			{...props}
		>
			heroicons-outline:magnifying-glass
		</ObjectAGISvgIcon>
	),
	SearchOffIcon: () => <ObjectAGISvgIcon size={20}>heroicons-outline:magnifying-glass</ObjectAGISvgIcon>,
	ViewColumnIcon: () => <ObjectAGISvgIcon size={20}>heroicons-outline:view-columns</ObjectAGISvgIcon>,
	MoreVertIcon: () => <ObjectAGISvgIcon size={20}>heroicons-outline:ellipsis-vertical</ObjectAGISvgIcon>,
	MoreHorizIcon: () => <ObjectAGISvgIcon size={20}>heroicons-outline:ellipsis-horizontal</ObjectAGISvgIcon>,
	SortIcon: (props) => (
		<ObjectAGISvgIcon
			size={20}
			{...props}
		>
			heroicons-outline:arrows-up-down
		</ObjectAGISvgIcon>
	),
	PushPinIcon: (props) => (
		<ObjectAGISvgIcon
			size={20}
			{...props}
		>
			heroicons-outline:bookmark
		</ObjectAGISvgIcon>
	),
	VisibilityOffIcon: () => <ObjectAGISvgIcon size={20}>heroicons-outline:eye-slash</ObjectAGISvgIcon>
};

function DataTable<TData>(props: MaterialReactTableProps<TData>) {
	const { columns, data, ...rest } = props;

	const defaults = useMemo(
		() =>
			_.defaults(rest, {
				initialState: {
					density: 'spacious',
					showColumnFilters: false,
					showGlobalFilter: true,
					columnPinning: {
						left: ['mrt-row-expand', 'mrt-row-select'],
						right: ['mrt-row-actions']
					},
					pagination: {
						pageSize: 15
					},
					enableFullScreenToggle: false
				},
				enableFullScreenToggle: false,
				enableColumnFilterModes: true,
				enableColumnOrdering: true,
				enableGrouping: true,
				enableColumnPinning: true,
				enableFacetedValues: true,
				enableRowActions: true,
				enableRowSelection: true,
				muiBottomToolbarProps: {
					className: 'flex items-center min-h-14 h-14'
				},
				muiTablePaperProps: {
					elevation: 0,
					square: true,
					className: 'flex flex-col flex-auto h-full'
				},
				muiTableContainerProps: {
					className: 'flex-auto'
				},
				enableStickyHeader: true,
				// enableStickyFooter: true,
				paginationDisplayMode: 'pages',
				positionToolbarAlertBanner: 'top',
				muiPaginationProps: {
					color: 'secondary',
					rowsPerPageOptions: [10, 20, 30],
					shape: 'rounded',
					variant: 'outlined',
					showRowsPerPage: false
				},
				muiSearchTextFieldProps: {
					placeholder: 'Search',
					sx: { minWidth: '300px' },
					variant: 'outlined',
					size: 'small'
				},
				muiFilterTextFieldProps: {
					variant: 'outlined',
					size: 'small',
					sx: {
						'& .MuiInputBase-root': {
							padding: '0px 8px',
							height: '32px!important',
							minHeight: '32px!important'
						}
					}
				},
				muiSelectAllCheckboxProps: {
					className: 'w-12'
				},
				muiSelectCheckboxProps: {
					className: 'w-12'
				},
				muiTableBodyRowProps: ({ row, table }) => {
					const { density } = table.getState();

					if (density === 'compact') {
						return {
							sx: {
								backgroundColor: 'initial',
								opacity: 1,
								boxShadow: 'none',
								height: row.getIsPinned() ? `${37}px` : undefined
							}
						};
					}

					return {
						sx: {
							backgroundColor: 'initial',
							opacity: 1,
							boxShadow: 'none',
							// Set a fixed height for pinned rows
							height: row.getIsPinned() ? `${density === 'comfortable' ? 53 : 69}px` : undefined
						}
					};
				},
				muiTableHeadCellProps: ({ column }) => ({
					sx: {
						'& .Mui-TableHeadCell-Content-Labels': {
							flex: 1,
							justifyContent: 'space-between'
						},
						'& .Mui-TableHeadCell-Content-Actions': {
							'& > button': {
								marginX: '2px'
							}
						},
						'& .MuiFormHelperText-root': {
							textAlign: 'center',
							marginX: 0,
							color: (theme: Theme) => theme.palette.text.disabled,
							fontSize: 11
						},
						backgroundColor: (theme) => (column.getIsPinned() ? theme.palette.background.paper : 'inherit')
					}
				}),
				mrtTheme: (theme) => ({
					baseBackgroundColor: theme.palette.background.paper,
					menuBackgroundColor: theme.palette.background.paper,
					pinnedRowBackgroundColor: theme.palette.background.paper,
					pinnedColumnBackgroundColor: theme.palette.background.paper
				}),
				renderTopToolbar: (_props) => <DataTableTopToolbar {..._props} />,
				icons: tableIcons
			} as Partial<MaterialReactTableProps<TData>>),
		[rest]
	);

	const tableOptions = useMemo(
		() => ({
			columns,
			data,
			...defaults,
			...rest
		}),
		[columns, data, defaults, rest]
	);

	const tableInstance = useMaterialReactTable<TData>(tableOptions);

	return <MaterialReactTable table={tableInstance} />;
}

export default DataTable;

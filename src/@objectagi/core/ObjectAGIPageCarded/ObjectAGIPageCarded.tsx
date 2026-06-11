'use client';

import ObjectAGIScrollbars from '@objectagi/core/ObjectAGIScrollbars';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo, ReactNode, useImperativeHandle, useRef, RefObject } from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import { SystemStyleObject } from '@mui/system/styleFunctionSx/styleFunctionSx';
import { Theme } from '@mui/system';
import ObjectAGIPageCardedSidebar from './ObjectAGIPageCardedSidebar';
import ObjectAGIPageCardedHeader from './ObjectAGIPageCardedHeader';
import { ObjectAGIScrollbarsProps } from '../ObjectAGIScrollbars/ObjectAGIScrollbars';

const headerHeight = 120;
const toolbarHeight = 64;

type ObjectAGIPageCardedProps = SystemStyleObject<Theme> & {
	className?: string;
	leftSidebarContent?: ReactNode;
	leftSidebarVariant?: 'permanent' | 'persistent' | 'temporary';
	rightSidebarContent?: ReactNode;
	rightSidebarVariant?: 'permanent' | 'persistent' | 'temporary';
	header?: ReactNode;
	content?: ReactNode;
	scroll?: 'normal' | 'page' | 'content';
	leftSidebarOpen?: boolean;
	rightSidebarOpen?: boolean;
	leftSidebarWidth?: number;
	rightSidebarWidth?: number;
	rightSidebarOnClose?: () => void;
	leftSidebarOnClose?: () => void;
	contentScrollbarsProps?: ObjectAGIScrollbarsProps;
	ref?: RefObject<{ toggleLeftSidebar: (val: boolean) => void; toggleRightSidebar: (val: boolean) => void }>;
};

const Root = styled('div')<ObjectAGIPageCardedProps>(({ theme, ...props }) => ({
	display: 'flex',
	flexDirection: 'column',
	minWidth: 0,
	minHeight: '100%',
	position: 'relative',
	flex: '1 1 auto',
	width: '100%',
	height: 'auto',
	padding: '0 16px',
	backgroundColor: theme.palette.background.default,

	'& .ObjectAGIPageCarded-scroll-content': {
		height: '100%'
	},

	'& .ObjectAGIPageCarded-wrapper': {
		display: 'flex',
		flexDirection: 'row',
		flex: '1 1 auto',
		zIndex: 2,
		maxWidth: '100%',
		minWidth: 0,
		height: '100%',
		backgroundColor: theme.palette.background.paper,

		...(props.scroll === 'content' && {
			position: 'absolute',
			top: 0,
			bottom: 0,
			right: 0,
			left: 0,
			overflow: 'hidden'
		})
	},

	'& .ObjectAGIPageCarded-header': {
		display: 'flex',
		flex: '0 0 auto'
	},

	'& .ObjectAGIPageCarded-contentWrapper': {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 1 auto',
		overflow: 'auto',
		WebkitOverflowScrolling: 'touch',
		zIndex: 9999
	},

	'& .ObjectAGIPageCarded-toolbar': {
		height: toolbarHeight,
		minHeight: toolbarHeight,
		display: 'flex',
		alignItems: 'center'
	},

	'& .ObjectAGIPageCarded-content': {
		flex: '1 0 auto'
	},

	'& .ObjectAGIPageCarded-sidebarWrapper': {
		overflow: 'hidden',
		backgroundColor: 'transparent',
		position: 'absolute',
		'&.permanent': {
			[theme.breakpoints.up('lg')]: {
				position: 'relative',
				marginLeft: 0,
				marginRight: 0,
				transition: theme.transitions.create('margin', {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.leavingScreen
				}),
				'&.closed': {
					transition: theme.transitions.create('margin', {
						easing: theme.transitions.easing.easeOut,
						duration: theme.transitions.duration.enteringScreen
					}),

					'&.ObjectAGIPageCarded-leftSidebar': {
						marginLeft: -props.leftSidebarWidth
					},
					'&.ObjectAGIPageCarded-rightSidebar': {
						marginRight: -props.rightSidebarWidth
					}
				}
			}
		}
	},

	'& .ObjectAGIPageCarded-sidebar': {
		position: 'absolute',
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.text.primary,

		'&.permanent': {
			[theme.breakpoints.up('lg')]: {
				position: 'relative'
			}
		},
		maxWidth: '100%',
		height: '100%'
	},

	'& .ObjectAGIPageCarded-leftSidebar': {
		width: props.leftSidebarWidth,

		[theme.breakpoints.up('lg')]: {
			// borderRight: `1px solid ${theme.palette.divider}`,
			// borderLeft: 0,
		}
	},

	'& .ObjectAGIPageCarded-rightSidebar': {
		width: props.rightSidebarWidth,

		[theme.breakpoints.up('lg')]: {
			// borderLeft: `1px solid ${theme.palette.divider}`,
			// borderRight: 0,
		}
	},

	'& .ObjectAGIPageCarded-sidebarHeader': {
		height: headerHeight,
		minHeight: headerHeight,
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.primary.contrastText
	},

	'& .ObjectAGIPageCarded-sidebarHeaderInnerSidebar': {
		backgroundColor: 'transparent',
		color: 'inherit',
		height: 'auto',
		minHeight: 'auto'
	},

	'& .ObjectAGIPageCarded-sidebarContent': {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100%'
	},

	'& .ObjectAGIPageCarded-backdrop': {
		position: 'absolute'
	}
}));

function ObjectAGIPageCarded(props: ObjectAGIPageCardedProps) {
	const {
		scroll = 'page',
		className,
		header,
		content,
		leftSidebarContent,
		rightSidebarContent,
		leftSidebarOpen = false,
		rightSidebarOpen = false,
		rightSidebarWidth = 240,
		leftSidebarWidth = 240,
		leftSidebarVariant = 'permanent',
		rightSidebarVariant = 'permanent',
		rightSidebarOnClose,
		leftSidebarOnClose,
		contentScrollbarsProps,
		ref
	} = props;

	const leftSidebarRef = useRef<{ toggleSidebar: (T: boolean) => void }>(null);
	const rightSidebarRef = useRef<{ toggleSidebar: (T: boolean) => void }>(null);
	const rootRef = useRef(null);

	useImperativeHandle(ref, () => ({
		toggleLeftSidebar: (val: boolean) => {
			if (leftSidebarRef.current) {
				leftSidebarRef.current.toggleSidebar(val);
			}
		},
		toggleRightSidebar: (val: boolean) => {
			if (rightSidebarRef.current) {
				rightSidebarRef.current.toggleSidebar(val);
			}
		}
	}));

	return (
		<>
			<GlobalStyles
				styles={() => ({
					...(scroll !== 'page' && {
						'#objectagi-toolbar': {
							position: 'static'
						},
						'#objectagi-footer': {
							position: 'static'
						}
					}),
					...(scroll === 'page' && {
						'#objectagi-toolbar': {
							position: 'sticky',
							top: 0
						},
						'#objectagi-footer': {
							position: 'sticky',
							bottom: 0
						}
					})
				})}
			/>
			<Root
				className={clsx('ObjectAGIPageCarded-root', `ObjectAGIPageCarded-scroll-${scroll}`, className)}
				ref={rootRef}
				scroll={scroll}
				leftSidebarWidth={leftSidebarWidth}
				rightSidebarWidth={rightSidebarWidth}
			>
				{header && <ObjectAGIPageCardedHeader header={header} />}

				<div className="container relative z-10 flex h-full flex-auto flex-col overflow-hidden rounded-t-lg shadow-1">
					<div className="ObjectAGIPageCarded-wrapper">
						{leftSidebarContent && (
							<ObjectAGIPageCardedSidebar
								position="left"
								variant={leftSidebarVariant}
								ref={leftSidebarRef}
								open={leftSidebarOpen}
								onClose={leftSidebarOnClose}
							>
								{leftSidebarContent}
							</ObjectAGIPageCardedSidebar>
						)}
						<ObjectAGIScrollbars
							className="ObjectAGIPageCarded-contentWrapper"
							enable={scroll === 'content'}
							{...contentScrollbarsProps}
						>
							{content && <div className={clsx('ObjectAGIPageCarded-content')}>{content}</div>}
						</ObjectAGIScrollbars>
						{rightSidebarContent && (
							<ObjectAGIPageCardedSidebar
								position="right"
								variant={rightSidebarVariant || 'permanent'}
								ref={rightSidebarRef}
								open={rightSidebarOpen}
								onClose={rightSidebarOnClose}
							>
								{rightSidebarContent}
							</ObjectAGIPageCardedSidebar>
						)}
					</div>
				</div>
			</Root>
		</>
	);
}

const StyledObjectAGIPageCarded = memo(styled(ObjectAGIPageCarded)``);

export default StyledObjectAGIPageCarded;

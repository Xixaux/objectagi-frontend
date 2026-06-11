import ObjectAGIScrollbars from '@objectagi/core/ObjectAGIScrollbars';
import { styled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Tooltip from '@mui/material/Tooltip';
import clsx from 'clsx';
import { memo, ReactNode, useState } from 'react';
import ObjectAGISvgIcon from '../ObjectAGISvgIcon';
import useThemeMediaQuery from '../../hooks/useThemeMediaQuery';

const Root = styled('div')(({ theme }) => ({
	'& .ObjectAGISidePanel-paper': {
		display: 'flex',
		width: 56,
		transition: theme.transitions.create(['transform', 'width', 'min-width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.shorter
		}),
		paddingBottom: 64,
		height: '100%',
		maxHeight: '100vh',
		position: 'sticky',
		top: 0,
		zIndex: 999,
		'&.left': {
			'& .ObjectAGISidePanel-buttonWrapper': {
				left: 0,
				right: 'auto'
			},
			'& .ObjectAGISidePanel-buttonIcon': {
				transform: 'rotate(0deg)'
			}
		},
		'&.right': {
			'& .ObjectAGISidePanel-buttonWrapper': {
				right: 0,
				left: 'auto'
			},
			'& .ObjectAGISidePanel-buttonIcon': {
				transform: 'rotate(-180deg)'
			}
		},
		'&.closed': {
			[theme.breakpoints.up('lg')]: {
				width: 0
			},
			'&.left': {
				'& .ObjectAGISidePanel-buttonWrapper': {
					justifyContent: 'start'
				},
				'& .ObjectAGISidePanel-button': {
					borderBottomLeftRadius: 0,
					borderTopLeftRadius: 0,
					paddingLeft: 4
				},
				'& .ObjectAGISidePanel-buttonIcon': {
					transform: 'rotate(-180deg)'
				}
			},
			'&.right': {
				'& .ObjectAGISidePanel-buttonWrapper': {
					justifyContent: 'flex-end'
				},
				'& .ObjectAGISidePanel-button': {
					borderBottomRightRadius: 0,
					borderTopRightRadius: 0,
					paddingRight: 4
				},
				'& .ObjectAGISidePanel-buttonIcon': {
					transform: 'rotate(0deg)'
				}
			},
			'& .ObjectAGISidePanel-buttonWrapper': {
				width: 'auto'
			},
			'& .ObjectAGISidePanel-button': {
				backgroundColor: theme.palette.background.paper,
				borderRadius: 38,
				transition: theme.transitions.create(
					['background-color', 'border-radius', 'width', 'min-width', 'padding'],
					{
						easing: theme.transitions.easing.easeInOut,
						duration: theme.transitions.duration.shorter
					}
				),
				width: 24,
				'&:hover': {
					width: 52,
					paddingLeft: 8,
					paddingRight: 8
				}
			},
			'& .ObjectAGISidePanel-content': {
				opacity: 0
			}
		}
	},
	'& .ObjectAGISidePanel-content': {
		overflow: 'hidden',
		opacity: 1,
		transition: theme.transitions.create(['opacity'], {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.short
		})
	},
	'& .ObjectAGISidePanel-buttonWrapper': {
		position: 'absolute',
		bottom: 0,
		left: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '12px 0',
		width: '100%',
		minWidth: 56
	},
	'& .ObjectAGISidePanel-button': {
		padding: 8,
		width: 40,
		height: 40
	},
	'& .ObjectAGISidePanel-buttonIcon': {
		transition: theme.transitions.create(['transform'], {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.short
		})
	},
	'& .ObjectAGISidePanel-mobileButton': {
		height: 40,
		position: 'fixed',
		zIndex: 99,
		bottom: 12,
		width: 24,
		borderRadius: 38,
		padding: 8,
		backgroundColor: theme.palette.background.paper,
		transition: theme.transitions.create(['background-color', 'border-radius', 'width', 'min-width', 'padding'], {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.shorter
		}),
		'&:hover': {
			width: 52,
			paddingLeft: 8,
			paddingRight: 8
		},
		'&.left': {
			borderBottomLeftRadius: 0,
			borderTopLeftRadius: 0,
			paddingLeft: 4,
			left: 0
		},
		'&.right': {
			borderBottomRightRadius: 0,
			borderTopRightRadius: 0,
			paddingRight: 4,
			right: 0,
			'& .ObjectAGISidePanel-buttonIcon': {
				transform: 'rotate(-180deg)'
			}
		}
	}
}));

type ObjectAGISidePanelProps = {
	position?: 'left';
	opened?: true;
	className?: string;
	children?: ReactNode;
};

/**
 * The ObjectAGISidePanel component is responsible for rendering a side panel that can be opened and closed.
 * It uses various MUI components to render the panel and its contents.
 * The component is memoized to prevent unnecessary re-renders.
 */
function ObjectAGISidePanel(props: ObjectAGISidePanelProps) {
	const { position = 'left', opened = true, className, children } = props;
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const [panelOpened, setPanelOpened] = useState(Boolean(opened));
	const [mobileOpen, setMobileOpen] = useState(false);

	function toggleOpened() {
		setPanelOpened(!panelOpened);
	}

	function toggleMobileDrawer() {
		setMobileOpen(!mobileOpen);
	}

	return (
		<Root>
			{!isMobile && (
				<Paper
					className={clsx(
						'ObjectAGISidePanel-paper',
						className,
						panelOpened ? 'opened' : 'closed',
						position,
						'shadow-lg'
					)}
					square
				>
					<ObjectAGIScrollbars className={clsx('content', 'ObjectAGISidePanel-content')}>{children}</ObjectAGIScrollbars>

					<div className="ObjectAGISidePanel-buttonWrapper">
						<Tooltip
							title="Toggle side panel"
							placement={position === 'left' ? 'right' : 'right'}
						>
							<IconButton
								className="ObjectAGISidePanel-button"
								onClick={toggleOpened}
								disableRipple
								size="large"
							>
								<ObjectAGISvgIcon className="ObjectAGISidePanel-buttonIcon">
									heroicons-outline:chevron-left
								</ObjectAGISvgIcon>
							</IconButton>
						</Tooltip>
					</div>
				</Paper>
			)}

			{isMobile && (
				<>
					<SwipeableDrawer
						classes={{
							paper: clsx('ObjectAGISidePanel-paper', className)
						}}
						anchor={position}
						open={mobileOpen}
						onOpen={() => {}}
						onClose={toggleMobileDrawer}
						disableSwipeToOpen
					>
						<ObjectAGIScrollbars className={clsx('content', 'ObjectAGISidePanel-content')}>{children}</ObjectAGIScrollbars>
					</SwipeableDrawer>

					<Tooltip
						title="Hide side panel"
						placement={position === 'left' ? 'right' : 'right'}
					>
						<Fab
							className={clsx('ObjectAGISidePanel-mobileButton', position)}
							onClick={toggleMobileDrawer}
							disableRipple
						>
							<ObjectAGISvgIcon className="ObjectAGISidePanel-buttonIcon">
								heroicons-outline:chevron-right
							</ObjectAGISvgIcon>
						</Fab>
					</Tooltip>
				</>
			)}
		</Root>
	);
}

export default memo(ObjectAGISidePanel);

'use client';
import NavLinkAdapter from '@objectagi/core/NavLinkAdapter';
import { alpha, styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import List, { ListProps } from '@mui/material/List';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { ListItemButton } from '@mui/material';
import usePathname from '@objectagi/hooks/usePathname';
import ObjectAGINavBadge from '../../ObjectAGINavBadge';
import ObjectAGINavItem, { ObjectAGINavItemComponentProps } from '../../ObjectAGINavItem';
import ObjectAGISvgIcon from '../../../ObjectAGISvgIcon';
import { ObjectAGINavItemType } from '../../types/ObjectAGINavItemType';
import isUrlInChildren from '../../isUrlInChildren'; 

type ListComponentProps = ListProps & {
    itempadding: number;
};

const Root = styled(List)<ListComponentProps>(({ theme, ...props }) => ({
    padding: 0,
    '&.open': {},
    '& > .objectagi-list-item': {
        minHeight: 32, // Significantly reduced from 36
        width: '100%',
        borderRadius: '8px',
        margin: '0 0 2px 0', // Significantly reduced from 4px
        paddingRight: 16,
        paddingLeft: props.itempadding > 80 ? 80 : props.itempadding,
        paddingTop: 4, // Significantly reduced from 10
        paddingBottom: 4, // Significantly reduced from 10
        color: '#000000', // Hardcoded default state to black
        '&:hover': {
            color: '#000000' // Hardcoded hover state to black
        },
        '& > .objectagi-list-item-icon': {
            marginRight: 16,
            color: '#000000 !important' 
        },
        '& .arrow-icon-container': {
            color: '#000000 !important', 
            '& .arrow-icon': {
                color: '#000000 !important', 
                fill: '#000000 !important', 
                stroke: '#000000 !important' 
            }
        }
    }
}));

function needsToBeOpened(pathname: string, item: ObjectAGINavItemType) {
    return pathname && isUrlInChildren(item, pathname);
}

/**
 * ObjectAGINavVerticalCollapse component used for vertical navigation items with collapsible children.
 */
function ObjectAGINavVerticalCollapse(props: ObjectAGINavItemComponentProps) {
    const pathname = usePathname();
    const { item, nestedLevel = 0, onItemClick, checkPermission } = props;
    const [open, setOpen] = useState(() => needsToBeOpened(pathname, item));
    const itempadding = nestedLevel > 0 ? 38 + nestedLevel * 16 : 16;
    const component = item.url ? NavLinkAdapter : 'li';

    const itemProps = useMemo(
        () => ({
            ...(component !== 'li' && {
                disabled: item.disabled,
                to: item.url,
                end: item.end,
                role: 'button',
                exact: item?.exact
            })
        }),
        [item, component]
    );

    const memoizedContent = useMemo(
        () => (
            <Root
                className={clsx(open && 'open')}
                itempadding={itempadding}
                sx={item.sx}
            >
                <ListItemButton
                    component={component}
                    className="objectagi-list-item"
                    onClick={() => {
                        setOpen(!open);
                    }}
                    {...itemProps}
                >
                    {item.icon && (
                        <ObjectAGISvgIcon
                            className={clsx('objectagi-list-item-icon shrink-0 force-dark-icon', item.iconClass)}
                            sx={{ color: '#000000 !important', fill: '#000000 !important', stroke: '#000000 !important' }} 
                        >
                            {item.icon}
                        </ObjectAGISvgIcon>
                    )}

                    <ListItemText
                        className="objectagi-list-item-text"
                        primary={item.title}
                        secondary={item.subtitle}
                        /* 
                         * Tailwinds classes updated to sync with Administration Tab typography specs:
                         * - textTransform: 'none' mapped via normal-case
                         * - fontWeight: 600 mapped via font-semibold
                         * - fontSize: '0.9rem' mapped via text-[0.9rem]
                         */
                        classes={{
                            primary: 'text-[0.9rem] font-semibold normal-case tracking-normal text-black objectagi-list-item-text-primary truncate',
                            secondary: 'text-sm font-medium text-black objectagi-list-item-text-secondary leading-[1.2] truncate'
                        }}
                    />

                    {item.badge && (
                        <ObjectAGINavBadge
                            className="mx-1"
                            badge={item.badge}
                        />
                    )}

                    <IconButton
                        disableRipple
                        className={clsx("-mx-3 h-5 w-5 p-0 hover:bg-transparent focus:bg-transparent", "arrow-icon-container")}
                        onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            setOpen(!open);
                        }}
                    >
                        <ObjectAGISvgIcon
                            size={13}
                            className={clsx("arrow-icon force-dark-icon")}
                            sx={{ color: '#000000 !important', fill: '#000000 !important', stroke: '#000000 !important' }} 
                        >
                            {open ? 'heroicons-solid:chevron-down' : 'heroicons-solid:chevron-right'}
                        </ObjectAGISvgIcon>
                    </IconButton>
                </ListItemButton>

                {item.children && (
                    <Collapse
                        in={open}
                        className="collapse-children"
                    >
                        {item.children.map((_item) => (
                            <ObjectAGINavItem
                                key={_item.id}
                                type={`vertical-${_item.type}`}
                                item={_item}
                                nestedLevel={nestedLevel + 1}
                                onItemClick={onItemClick}
                                checkPermission={checkPermission}
                            />
                        ))}
                    </Collapse>
                )}
            </Root>
        ),
        [
            checkPermission,
            component,
            item.badge,
            item.children,
            item.icon,
            item.iconClass,
            item.subtitle,
            item.sx,
            item.title,
            itemProps,
            itempadding,
            nestedLevel,
            onItemClick,
            open
        ]
    );

    if (checkPermission && !item?.hasPermission) {
        return null;
    }

    return memoizedContent;
}

const NavVerticalCollapse = ObjectAGINavVerticalCollapse;

export default NavVerticalCollapse;
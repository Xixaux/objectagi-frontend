'use client';
import NavLinkAdapter from '@objectagi/core/NavLinkAdapter';
import { alpha, styled } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import clsx from 'clsx';
import { useMemo } from 'react';
import { ListItemButton, ListItemButtonProps } from '@mui/material';
import ObjectAGINavBadge from '../../ObjectAGINavBadge';
import ObjectAGISvgIcon from '../../../ObjectAGISvgIcon';
import { ObjectAGINavItemComponentProps } from '../../ObjectAGINavItem';

type ListItemButtonStyleProps = ListItemButtonProps & {
  itempadding: number;
};

const Root = styled(ListItemButton)<ListItemButtonStyleProps>(({ theme, ...props }) => ({
  minHeight: 32, // Reduced from 36
  width: '100%',
  borderRadius: '8px',
  margin: '0 0 2px 0', // Reduced from 4px to tighten gap between items
  paddingRight: 16,
  paddingLeft: props.itempadding > 80 ? 80 : props.itempadding,
  paddingTop: 4, // Reduced from 10 to make item thinner
  paddingBottom: 4, // Reduced from 10 to make item thinner
  color: '#000000', 
  cursor: 'pointer',
  textDecoration: 'none!important',
  '&:hover': {
    color: '#000000' 
  },
  '&.active': {
    color: '#000000', 
    backgroundColor:
      theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .05)!important' : 'rgba(255, 255, 255, .1)!important',
    transition: 'border-radius .15s cubic-bezier(0.4,0.0,0.2,1)',
    '& > .objectagi-list-item-text-primary': {
      color: '#000000 !important' 
    },
    '& > .objectagi-list-item-icon': {
      color: '#000000 !important'
    }
  },
  '& > .objectagi-list-item-icon': {
    marginRight: 16,
    color: '#000000 !important'
  },
  '& > .objectagi-list-item-text': {}
}));

/**
 * ObjectAGINavVerticalItem is a React component used to render ObjectAGINavItem as part of the ObjectAGI navigational component.
 */
function ObjectAGINavVerticalItem(props: ObjectAGINavItemComponentProps) {
  const { item, nestedLevel = 0, onItemClick, checkPermission } = props;
  const itempadding = nestedLevel > 0 ? 38 + nestedLevel * 16 : 16;
  const component = item.url ? NavLinkAdapter : 'li';

  const itemProps = useMemo(
    () => ({
      ...(component !== 'li' && {
        disabled: item.disabled,
        to: item.url || '',
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
        component={component}
        className={clsx('objectagi-list-item', item.active && 'active')}
        onClick={() => onItemClick && onItemClick(item)}
        itempadding={itempadding}
        sx={item.sx}
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
           * Tailwinds classes updated to sync with new Administration Tab typography specs:
           * - textTransform: 'none' mapped via normal-case
           * - fontWeight: 600 mapped via font-semibold
           * - fontSize: '0.9rem' mapped via text-[0.9rem]
           */
          classes={{
            primary: 'text-[0.9rem] font-semibold normal-case tracking-normal text-black objectagi-list-item-text-primary truncate',
            secondary: 'text-sm font-medium text-black objectagi-list-item-text-secondary leading-[1.2] truncate'
          }}
        />
        {item.badge && <ObjectAGINavBadge badge={item.badge} />}
      </Root>
    ),
    [component, item, itemProps, itempadding, onItemClick]
  );

  if (checkPermission && !item?.hasPermission) {
    return null;
  }

  return memoizedContent;
}

const NavVerticalItem = ObjectAGINavVerticalItem;

export default NavVerticalItem;
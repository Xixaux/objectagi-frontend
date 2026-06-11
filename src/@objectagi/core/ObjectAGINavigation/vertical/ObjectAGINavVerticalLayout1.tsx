import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import ObjectAGINavItem from '../ObjectAGINavItem';
import { ObjectAGINavigationProps } from '../ObjectAGINavigation';
import { ObjectAGINavItemType } from '../types/ObjectAGINavItemType';

const StyledList = styled(List)(({ theme }) => ({
    '& .objectagi-list-item': {
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,.04)',
            ...theme.applyStyles('dark', {
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
            })
        },
        '&:focus:not(.active)': {
            backgroundColor: 'rgba(0,0,0,.05)',
            ...theme.applyStyles('dark', {
                backgroundColor: 'rgba(255, 255, 255, 0.06)'
            })
        },
        // Use CSS variables for standard theme icon colors
        '& .MuiSvgIcon-root': {
            color: 'var(--text-primary)',
            ...theme.applyStyles('dark', {
                color: 'var(--text-primary)'
            })
        }
    },
    '& .objectagi-list-item-text': {
        margin: 0
    },
    // Use CSS variables for primary font colors
    '& .objectagi-list-item-text-primary': {
        lineHeight: '20px',
        color: 'var(--text-primary)',
        ...theme.applyStyles('dark', {
            color: 'var(--text-primary)'
        })
    },
    '&.active-square-list': {
        '& .objectagi-list-item, & .active.objectagi-list-item': {
            width: '100%',
            borderRadius: '0'
        }
    },
    '&.dense': {
        '& .objectagi-list-item': {
            pt: 0,
            pb: 0,
            height: 32
        }
    }
}));

/**
 * ObjectAGINavVerticalLayout1
 * This component is used to render vertical navigations using
 * the Material-UI List component. It accepts the ObjectAGINavigationProps props
 * and renders the ObjectAGINavItem components accordingly
 */
function ObjectAGINavVerticalLayout1(props: ObjectAGINavigationProps) {
    const { navigation, active, dense, className, onItemClick, checkPermission } = props;

    function handleItemClick(item: ObjectAGINavItemType) {
        onItemClick?.(item);
    }

    return (
        <StyledList
            className={clsx(
                'navigation whitespace-nowrap px-3 py-0',
                `active-${active}-list`,
                dense && 'dense',
                className
            )}
        >
            {navigation.map((_item) => (
                <ObjectAGINavItem
                    key={_item.id}
                    type={`vertical-${_item.type}`}
                    item={_item}
                    nestedLevel={0}
                    onItemClick={handleItemClick}
                    checkPermission={checkPermission}
                />
            ))}
        </StyledList>
    );
}

export default ObjectAGINavVerticalLayout1;
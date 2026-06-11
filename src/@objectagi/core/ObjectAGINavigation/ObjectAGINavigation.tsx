import Divider from '@mui/material/Divider';
import { memo } from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import ObjectAGINavHorizontalLayout1 from './horizontal/ObjectAGINavHorizontalLayout1';
import ObjectAGINavVerticalLayout1 from './vertical/ObjectAGINavVerticalLayout1';
import ObjectAGINavVerticalLayout2 from './vertical/ObjectAGINavVerticalLayout2'; // Fixed: added ./
import ObjectAGINavHorizontalCollapse from './horizontal/types/ObjectAGINavHorizontalCollapse';
import ObjectAGINavHorizontalGroup from './horizontal/types/ObjectAGINavHorizontalGroup';
import ObjectAGINavHorizontalItem from './horizontal/types/ObjectAGINavHorizontalItem';
import ObjectAGINavHorizontalLink from './horizontal/types/ObjectAGINavHorizontalLink';
import ObjectAGINavVerticalCollapse from './vertical/types/ObjectAGINavVerticalCollapse';
import ObjectAGINavVerticalGroup from './vertical/types/ObjectAGINavVerticalGroup';
import ObjectAGINavVerticalItem from './vertical/types/ObjectAGINavVerticalItem';
import ObjectAGINavVerticalLink from './vertical/types/ObjectAGINavVerticalLink';
import { ObjectAGINavItemType } from './types/ObjectAGINavItemType';
import { registerComponent } from './utils/registerComponent';

const inputGlobalStyles = (
    <GlobalStyles
        styles={() => ({
            '.popper-navigation-list': {
                '& .objectagi-list-item': {
                    padding: '8px 12px 8px 12px',
                    height: 36,
                    minHeight: 36,
                    '& .objectagi-list-item-text': {
                        padding: '0 0 0 8px'
                    }
                },
                '&.dense': {
                    '& .objectagi-list-item': {
                        minHeight: 32,
                        height: 32,
                        '& .objectagi-list-item-text': {
                            padding: '0 0 0 8px'
                        }
                    }
                }
            }
        })}
    />
);

/*
Register ObjectAGI Navigation Components
 */
registerComponent('vertical-group', ObjectAGINavVerticalGroup);
registerComponent('vertical-collapse', ObjectAGINavVerticalCollapse);
registerComponent('vertical-item', ObjectAGINavVerticalItem);
registerComponent('vertical-link', ObjectAGINavVerticalLink);
registerComponent('horizontal-group', ObjectAGINavHorizontalGroup);
registerComponent('horizontal-collapse', ObjectAGINavHorizontalCollapse);
registerComponent('horizontal-item', ObjectAGINavHorizontalItem);
registerComponent('horizontal-link', ObjectAGINavHorizontalLink);

// Keep normal horizontal dividers
registerComponent('divider', () => <Divider className="my-4" />);
registerComponent('horizontal-divider', () => <Divider className="my-4" />);

// PERMANENTLY KILL THE VERTICAL DIVIDER (the 1px dark line in the left sidebar)
registerComponent('vertical-divider', () => null);

export type ObjectAGINavigationProps = {
    className?: string;
    dense?: boolean;
    active?: boolean;
    onItemClick?: (T: ObjectAGINavItemType) => void;
    navigation?: ObjectAGINavItemType[];
    layout?: 'horizontal' | 'vertical' | 'vertical-2';
    firstLevel?: boolean;
    selectedId?: string;
    checkPermission?: boolean;
};

/**
 * ObjectAGINavigation
 * Component for displaying a navigation bar which contains ObjectAGINavItem components
 * and acts as parent for providing props to its children components
 */
function ObjectAGINavigation(props: ObjectAGINavigationProps) {
    const { navigation, layout = 'vertical' } = props;

    if (!navigation || navigation.length === 0) {
        return null;
    }

    return (
        <>
            {inputGlobalStyles}
            {layout === 'horizontal' && (
                <ObjectAGINavHorizontalLayout1
                    checkPermission={false}
                    {...props}
                />
            )}
            {layout === 'vertical' && (
                <ObjectAGINavVerticalLayout1
                    checkPermission={false}
                    {...props}
                />
            )}
            {layout === 'vertical-2' && (
                <ObjectAGINavVerticalLayout2
                    checkPermission={false}
                    {...props}
                />
            )}
        </>
    );
}

export default memo(ObjectAGINavigation);
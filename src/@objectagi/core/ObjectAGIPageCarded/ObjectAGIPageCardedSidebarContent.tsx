import ObjectAGIScrollbars from '@objectagi/core/ObjectAGIScrollbars';
import { ReactNode } from 'react';

/**
 * Props for the ObjectAGIPageCardedSidebarContent component.
 */
type ObjectAGIPageCardedSidebarContentProps = {
	innerScroll?: boolean;
	children?: ReactNode;
};

/**
 * The ObjectAGIPageCardedSidebarContent component is a content container for the ObjectAGIPageCardedSidebar component.
 */
function ObjectAGIPageCardedSidebarContent(props: ObjectAGIPageCardedSidebarContentProps) {
	const { innerScroll, children } = props;

	if (!children) {
		return null;
	}

	return (
		<ObjectAGIScrollbars enable={innerScroll}>
			<div className="ObjectAGIPageCarded-sidebarContent min-w-80 lg:min-w-0">{children}</div>
		</ObjectAGIScrollbars>
	);
}

export default ObjectAGIPageCardedSidebarContent;

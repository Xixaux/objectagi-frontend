import ObjectAGIScrollbars from '@objectagi/core/ObjectAGIScrollbars';
import { ReactNode } from 'react';

/**
 * Props for the ObjectAGIPageSimpleSidebarContent component.
 */
type ObjectAGIPageSimpleSidebarContentProps = {
	innerScroll?: boolean;
	children?: ReactNode;
};

/**
 * The ObjectAGIPageSimpleSidebarContent component is a content container for the ObjectAGIPageSimpleSidebar component.
 */
function ObjectAGIPageSimpleSidebarContent(props: ObjectAGIPageSimpleSidebarContentProps) {
	const { innerScroll, children } = props;

	if (!children) {
		return null;
	}

	return (
		<ObjectAGIScrollbars enable={innerScroll}>
			<div className="ObjectAGIPageSimple-sidebarContent flex flex-col min-h-full min-w-80 lg:min-w-0">{children}</div>
		</ObjectAGIScrollbars>
	);
}

export default ObjectAGIPageSimpleSidebarContent;

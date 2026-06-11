import clsx from 'clsx';
import { ReactNode } from 'react';

/**
 * Props for the ObjectAGIPageSimpleHeader component.
 */
type ObjectAGIPageSimpleHeaderProps = {
	className?: string;
	header?: ReactNode;
};

/**
 * The ObjectAGIPageSimpleHeader component is a sub-component of the ObjectAGIPageSimple layout component.
 * It provides a header area for the layout.
 */
function ObjectAGIPageSimpleHeader(props: ObjectAGIPageSimpleHeaderProps) {
	const { header = null, className } = props;
	return (
		<div className={clsx('ObjectAGIPageSimple-header', className)}>
			<div className="container">{header}</div>
		</div>
	);
}

export default ObjectAGIPageSimpleHeader;

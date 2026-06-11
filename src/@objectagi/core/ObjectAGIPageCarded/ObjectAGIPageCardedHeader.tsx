import clsx from 'clsx';
import { ReactNode } from 'react';

/**
 * Props for the ObjectAGIPageCardedHeader component.
 */
type ObjectAGIPageCardedHeaderProps = {
	header?: ReactNode;
};

/**
 * The ObjectAGIPageCardedHeader component is a header for the ObjectAGIPageCarded component.
 */
function ObjectAGIPageCardedHeader(props: ObjectAGIPageCardedHeaderProps) {
	const { header = null } = props;

	return <div className={clsx('ObjectAGIPageCarded-header', 'container')}>{header}</div>;
}

export default ObjectAGIPageCardedHeader;

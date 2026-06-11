import ObjectAGILoading from '@objectagi/core/ObjectAGILoading';
import { ReactNode, Suspense } from 'react';
import { ObjectAGILoadingProps } from '@objectagi/core/ObjectAGILoading/ObjectAGILoading';

type ObjectAGISuspenseProps = {
	loadingProps?: ObjectAGILoadingProps;
	children: ReactNode;
};

/**
 * The ObjectAGISuspense component is a wrapper around the React Suspense component.
 * It is used to display a loading spinner while the wrapped components are being loaded.
 * The component is memoized to prevent unnecessary re-renders.
 * React Suspense defaults
 * For to Avoid Repetition
 */
function ObjectAGISuspense(props: ObjectAGISuspenseProps) {
	const { children, loadingProps } = props;
	return <Suspense fallback={<ObjectAGILoading {...loadingProps} />}>{children}</Suspense>;
}

export default ObjectAGISuspense;

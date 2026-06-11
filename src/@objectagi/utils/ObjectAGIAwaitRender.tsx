import { useEffect, useState } from 'react';

type ObjectAGIAwaitRenderProps = {
	delay?: number;
	children: React.ReactNode;
};

function ObjectAGIAwaitRender(props: ObjectAGIAwaitRenderProps) {
	const { delay = 0, children } = props;
	const [awaitRender, setAwaitRender] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setAwaitRender(false);
		}, delay);
	}, [delay]);

	return awaitRender ? null : children;
}

export default ObjectAGIAwaitRender;

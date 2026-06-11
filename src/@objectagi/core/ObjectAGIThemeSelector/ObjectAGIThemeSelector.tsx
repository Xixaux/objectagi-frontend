import { memo } from 'react';
import ThemePreview, { ObjectAGIThemeOption } from '@objectagi/core/ObjectAGIThemeSelector/ThemePreview';

type ObjectAGIThemeSchemesProps = {
	onSelect?: (t: ObjectAGIThemeOption) => void;
	options: ObjectAGIThemeOption[];
};

/**
 * The ObjectAGIThemeSchemes component is responsible for rendering a list of theme schemes with preview images.
 * It uses the SchemePreview component to render each scheme preview.
 * The component is memoized to prevent unnecessary re-renders.
 */
function ObjectAGIThemeSelector(props: ObjectAGIThemeSchemesProps) {
	const { onSelect, options } = props;

	return (
		<div>
			<div className="w-full grid grid-cols-2 gap-3">
				{options.map((item) => (
					<ThemePreview
						key={item.id}
						className=""
						theme={item}
						onSelect={onSelect}
					/>
				))}
			</div>
		</div>
	);
}

export default memo(ObjectAGIThemeSelector);

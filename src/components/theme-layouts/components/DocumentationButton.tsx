import Button from '@mui/material/Button';
import Link from '@objectagi/core/Link';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';

type DocumentationButtonProps = {
	className?: string;
};

/**
 * The documentation button.
 */
function DocumentationButton(props: DocumentationButtonProps) {
	const { className = '' } = props;

	return (
		<Button
			component={Link}
			to="/documentation"
			role="button"
			className={className}
			variant="contained"
			color="primary"
			startIcon={<ObjectAGISvgIcon size={16}>heroicons-outline:book-open</ObjectAGISvgIcon>}
		>
			Documentation
		</Button>
	);
}

export default DocumentationButton;

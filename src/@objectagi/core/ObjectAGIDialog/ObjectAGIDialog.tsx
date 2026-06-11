import Dialog from '@mui/material/Dialog';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { closeDialog, selectObjectAGIDialogProps } from '@objectagi/core/ObjectAGIDialog/objectagiDialogSlice';

/**
 * ObjectAGIDialog component
 * This component renders a material UI ```Dialog``` component
 * with properties pulled from the redux store
 */
function ObjectAGIDialog() {
	const dispatch = useAppDispatch();
	const options = useAppSelector(selectObjectAGIDialogProps);

	return (
		<Dialog
			onClose={() => dispatch(closeDialog())}
			aria-labelledby="objectagi-dialog-title"
			classes={{
				paper: 'rounded-lg'
			}}
			{...options}
		/>
	);
}

export default ObjectAGIDialog;

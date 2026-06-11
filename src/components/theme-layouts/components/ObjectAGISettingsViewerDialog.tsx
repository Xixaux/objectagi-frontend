import { useState } from 'react';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import ObjectAGISvgIcon from '@objectagi/core/ObjectAGISvgIcon';
import Dialog from '@mui/material/Dialog';
import ObjectAGIHighlight from '@objectagi/core/ObjectAGIHighlight';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import qs from 'qs';
import Typography from '@mui/material/Typography';
import useObjectAGISettings from '@objectagi/core/ObjectAGISettings/hooks/useObjectAGISettings';

type ObjectAGISettingsViewerDialogProps = {
	className?: string;
};

/**
 * The settings viewer dialog.
 */
function ObjectAGISettingsViewerDialog(props: ObjectAGISettingsViewerDialogProps) {
	const { className = '' } = props;

	const [openDialog, setOpenDialog] = useState(false);
	const { data: settings } = useObjectAGISettings();

	const jsonStringifiedSettings = JSON.stringify(settings);
	const queryString = qs.stringify({
		defaultSettings: jsonStringifiedSettings,
		strictNullHandling: true
	});

	function handleOpenDialog() {
		setOpenDialog(true);
	}

	function handleCloseDialog() {
		setOpenDialog(false);
	}

	return (
		<div className={clsx('', className)}>
			<Button
				variant="contained"
				color="secondary"
				className="w-full"
				onClick={handleOpenDialog}
				startIcon={<ObjectAGISvgIcon>heroicons-outline:eye</ObjectAGISvgIcon>}
			>
				Update Privacy Settings
			</Button>

			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle>ObjectAGI Settings Viewer</DialogTitle>
				<DialogContent>
					<Typography className="mb-4 mt-6 text-lg font-bold">JSON</Typography>

					<ObjectAGIHighlight
						component="pre"
						className="language-json"
					>
						{JSON.stringify(settings, null, 2)}
					</ObjectAGIHighlight>

					<Typography className="mb-4 mt-6 text-lg font-bold">Query Params</Typography>

					{queryString}
				</DialogContent>
				<DialogActions>
					<Button
						color="secondary"
						variant="contained"
						onClick={handleCloseDialog}
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default ObjectAGISettingsViewerDialog;

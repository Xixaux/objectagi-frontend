import { MenuItem, Select } from '@mui/material';
import { useGetEnvironments } from '../../api/hooks/environments/useGetEnvironments';
import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';

function ProjectSelector() {
  const { data: projects } = useGetEnvironments();

  const [selectedProject, setSelectedProject] = useState<{ id: number; menuEl: HTMLElement | null }>({
    id: 1,
    menuEl: null,
  });

  function handleChangeProject(event: SelectChangeEvent<number>) {
    setSelectedProject({
      id: event.target.value as number,
      menuEl: null,
    });
  }

  return (
    <div className="flex items-center">
      {projects && projects.length > 0 && (
        <Select
          value={selectedProject?.id}
          onChange={handleChangeProject}
          className="flex items-center"
          sx={(theme) => ({
            backgroundColor: `${theme.palette.background.default}!important`, // Fixed: Use theme.palette
            borderColor: theme.palette.divider, // Fixed: Use theme.palette
          })}
        >
          {projects?.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  );
}

export default ProjectSelector;
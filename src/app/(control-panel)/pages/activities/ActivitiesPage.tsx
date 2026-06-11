// src/app/(control-panel)/pages/activities/ActivitiesPage.tsx
'use client';

import ObjectAGIPageSimple from '@objectagi/core/ObjectAGIPageSimple';
import useThemeMediaQuery from '@objectagi/hooks/useThemeMediaQuery';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

import ActionOutputBox from './ActionOutputBox';
import ActivitiesPageHeader from './ActivitiesPageHeader';   // ← IMPORT ADDED

// Reusable section header
export const SectionHeader = ({ children, accentColor = 'text-gray-700' }: { children: React.ReactNode; accentColor?: string }) => (
  <Typography variant="h6" className={`font-bold mb-3 ${accentColor}`}>
    {children}
  </Typography>
);

function ActivitiesPage() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  const [submissions, setSubmissions] = useState<string[]>(() => {
    const saved = localStorage.getItem('submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [inputs, setInputs] = useState<string[]>(Array(8).fill(''));

  const [currentOperation, setCurrentOperation] = useState<'none' | 'compare' | 'repeat' | 'stop'>('none');

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [actionResult, setActionResult] = useState<string[]>([]);

  const [repeatCount, setRepeatCount] = useState<number>(() => {
    const saved = localStorage.getItem('repeatCount');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [tempRepeatInput, setTempRepeatInput] = useState<string>('1');

  const [keywords, setKeywords] = useState<string[]>(() => {
    const saved = localStorage.getItem('keywords');
    return saved ? JSON.parse(saved) : [];
  });

  const [newKeyword, setNewKeyword] = useState<string>('');

  const [setConfirmation, setSetConfirmation] = useState<string>('');

  const [pendingSummary, setPendingSummary] = useState<string[]>([]);

  const [executedTasks, setExecutedTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem('executedTasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [taskCounter, setTaskCounter] = useState<{ compare: number; repeat: number }>(() => {
    const saved = localStorage.getItem('taskCounter');
    return saved ? JSON.parse(saved) : { compare: 0, repeat: 0 };
  });

  const [userInput, setUserInput] = useState<string>('');

  const [selectedExecutedTask, setSelectedExecutedTask] = useState<string | null>(null);

  const [triggerPhraseInput, setTriggerPhraseInput] = useState<string>('');

  const [triggerToTask, setTriggerToTask] = useState<Map<string, string>>(() => {
    const saved = localStorage.getItem('triggerToTask');
    return saved ? new Map(JSON.parse(saved)) : new Map();
  });

  const [associateConfirmation, setAssociateConfirmation] = useState<string>('');

  const [taskParams, setTaskParams] = useState<Map<string, { operation: string; selectedItems: string[]; repeatCount?: number }>>(
    () => {
      const saved = localStorage.getItem('taskParams');
      return saved ? new Map(JSON.parse(saved)) : new Map();
    }
  );

  // Save states to localStorage
  useEffect(() => { localStorage.setItem('submissions', JSON.stringify(submissions)); }, [submissions]);
  useEffect(() => { localStorage.setItem('repeatCount', repeatCount.toString()); }, [repeatCount]);
  useEffect(() => { localStorage.setItem('keywords', JSON.stringify(keywords)); }, [keywords]);
  useEffect(() => { localStorage.setItem('executedTasks', JSON.stringify(executedTasks)); }, [executedTasks]);
  useEffect(() => { localStorage.setItem('taskCounter', JSON.stringify(taskCounter)); }, [taskCounter]);
  useEffect(() => { localStorage.setItem('triggerToTask', JSON.stringify(Array.from(triggerToTask.entries()))); }, [triggerToTask]);
  useEffect(() => { localStorage.setItem('taskParams', JSON.stringify(Array.from(taskParams.entries()))); }, [taskParams]);

  // Update pending summary
  useEffect(() => {
    const lines: string[] = [];

    if (currentOperation !== 'none') {
      lines.push(`Operation: ${currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)}`);
    }

    if (currentOperation === 'repeat') {
      lines.push(`Repeat count: ${repeatCount}`);
    }

    if (selectedItems.length > 0) {
      lines.push(`Selected items (${selectedItems.length}):`);
      selectedItems.forEach((item, idx) => {
        lines.push(`  - ${idx + 1}. ${item}`);
      });
    } else if (currentOperation !== 'none') {
      lines.push('No items selected yet');
    }

    if (lines.length === 0) {
      lines.unshift('No action configured yet');
    }

    setPendingSummary(lines);
  }, [currentOperation, repeatCount, selectedItems]);

  const handleSubmit = (value: string, inputIndex: number) => {
    if (value.trim() !== '') {
      setSubmissions((prev) => [...prev, value.trim()]);
      const newInputs = [...inputs];
      newInputs[inputIndex] = '';
      setInputs(newInputs);
    }
  };

  const handleDelete = (indexToRemove: number) => {
    const itemToRemove = submissions[indexToRemove];
    setSubmissions((prev) => prev.filter((_, i) => i !== indexToRemove));
    setSelectedItems((prev) => prev.filter((i) => i !== itemToRemove));
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleToggleSelect = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSetRepeat = () => {
    const num = parseInt(tempRepeatInput, 10);
    if (!isNaN(num)) {
      const clamped = Math.max(1, Math.min(10, num));
      setRepeatCount(clamped);
      setSetConfirmation(`Value set to ${clamped}!`);
      setTimeout(() => setSetConfirmation(''), 3000);
    } else {
      setSetConfirmation('Invalid number');
      setTimeout(() => setSetConfirmation(''), 3000);
    }
  };

  const handleInitiateAction = () => {
    if (selectedItems.length < 1) {
      setActionResult(['Please select at least 1 object in the Submitted Objects list.']);
      return;
    }

    if (currentOperation === 'none') return;

    const opKey = currentOperation;
    const count = taskCounter[opKey] + 1;
    const taskName = `${opKey}${count}`;

    setExecutedTasks((prev) => [taskName, ...prev]);
    setTaskCounter((prev) => ({ ...prev, [opKey]: count }));

    setTaskParams((prev) => {
      const newMap = new Map(prev);
      newMap.set(taskName, {
        operation: currentOperation,
        selectedItems: [...selectedItems],
        repeatCount: currentOperation === 'repeat' ? repeatCount : undefined,
      });
      return newMap;
    });

    let results: string[] = [];

    if (currentOperation === 'compare') {
      const valueToIndex = new Map<string, number>();
      submissions.forEach((val, idx) => {
        if (!valueToIndex.has(val)) valueToIndex.set(val, idx + 1);
      });

      const selectedWithIndex = selectedItems.map((val) => ({
        value: val,
        itemNumber: valueToIndex.get(val) || 0,
      }));

      for (const itemA of selectedWithIndex) {
        for (const itemB of selectedWithIndex) {
          const relation = itemA.value === itemB.value ? 'the same as' : 'different from';
          results.push(
            `Item ${itemA.itemNumber} (${itemA.value}) is ${relation} Item ${itemB.itemNumber} (${itemB.value})`
          );
        }
      }
    } else if (currentOperation === 'repeat') {
      selectedItems.forEach((item) => {
        for (let i = 1; i <= repeatCount; i++) {
          results.push(`Repeat ${i}: ${item}`);
        }
      });
    }

    setActionResult(results);
  };

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (trimmed !== '' && !keywords.includes(trimmed)) {
      setKeywords((prev) => [...prev, trimmed]);
      setNewKeyword('');
    }
  };

  const handleAssociateTrigger = () => {
    const trimmed = triggerPhraseInput.trim();
    if (trimmed === '' || !selectedExecutedTask) return;

    setTriggerToTask((prev) => {
      const newMap = new Map(prev);
      newMap.set(trimmed.toLowerCase(), selectedExecutedTask);
      return newMap;
    });

    setTriggerPhraseInput('');
    setAssociateConfirmation('Action associated!');
    setTimeout(() => setAssociateConfirmation(''), 3000);
    setSelectedExecutedTask(null);
  };

  const handleUserInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = userInput.trim();
    if (trimmed === '') return;

    const lowerTrimmed = trimmed.toLowerCase();
    const matchedTask = triggerToTask.get(lowerTrimmed);

    if (matchedTask) {
      const params = taskParams.get(matchedTask);
      if (params) {
        let results: string[] = [];
        const { operation, selectedItems: storedSelected, repeatCount: storedRepeat } = params;

        if (operation === 'compare') {
          const valueToIndex = new Map<string, number>();
          submissions.forEach((val, idx) => {
            if (!valueToIndex.has(val)) valueToIndex.set(val, idx + 1);
          });

          const selectedWithIndex = storedSelected.map((val) => ({
            value: val,
            itemNumber: valueToIndex.get(val) || 0,
          }));

          for (const itemA of selectedWithIndex) {
            for (const itemB of selectedWithIndex) {
              const relation = itemA.value === itemB.value ? 'the same as' : 'different from';
              results.push(
                `Item ${itemA.itemNumber} (${itemA.value}) is ${relation} Item ${itemB.itemNumber} (${itemB.value})`
              );
            }
          }
        } else if (operation === 'repeat') {
          storedSelected.forEach((item) => {
            for (let i = 1; i <= (storedRepeat || 1); i++) {
              results.push(`Repeat ${i}: ${item}`);
            }
          });
        }

        setActionResult(results);
      } else {
        setActionResult(['Associated task found, but no stored params available.']);
      }
    } else {
      setActionResult((prev) => [...prev, `Note: ${userInput}`]);
    }

    setUserInput('');
  };

  const operations = [
    'repeat', 'add', 'subtract', 'divide', 'multiply', 'save', 'match', 'copy',
    'compare', 'create', 'choose', 'talk', 'sing', 'dance', 'speak', 'sit',
    'delete', 'do', 'go', 'find', 'search', 'walk', 'run', 'draw', 'write',
    'say', 'stop', 'catch', 'throw', 'put', 'move', 'mix', 'replace', 'turn',
    'reverse', 'combine', 'break', 'attach', 'connect', 'order', 'sort',
    'filter', 'remove', 'append', 'back', 'forward', 'toward', 'away', 'fast',
    'slow', 'slowly', 'speed_up', 'cancel', 'flip', 'twist', 'right', 'left',
    'up', 'down', 'diagonal', 'next_to', 'insert', 'beside', 'separate',
    'detach', 'extend', 'shrink', 'resize', 'turn_it_around', 'slow_down'
  ];

  const cells = [
    'A', 'B', 'C',
    'E', 'F', 'G',
    'I', 'J', 'K',
    'M', 'N', 'O',
  ];

  const canInitiate = currentOperation !== 'none' && selectedItems.length > 0;

  return (
    <ObjectAGIPageSimple
      content={
        <div className="flex flex-col w-full h-full p-6 md:p-12">

          {/* Page Header – using the separate component */}
          <ActivitiesPageHeader />

          {/* Main grid */}
          <div
            className="
              grid
              grid-cols-[30fr_40fr_30fr]
              grid-rows-[1.6fr_1fr_1fr_1fr]
              gap-4 sm:gap-6
              w-full max-w-6xl
              aspect-[4/4.2]
              mx-auto
              mb-6
            "
          >
            {cells.map((letter, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;

              const isBoxA = col === 0 && row === 0;
              const isBoxB = col === 1 && row === 0;
              const isBoxC = col === 2 && row === 0;
              const isBoxE = col === 0 && row === 1;
              const isBoxF = col === 1 && row === 1;
              const isBoxG = col === 2 && row === 1;
              const isBoxI = col === 0 && row === 2;
              const isBoxJ = col === 1 && row === 2;
              const isBoxKPlaceholder = col === 2 && row === 2;
              const isBoxM = col === 0 && row === 3;
              const isBoxN = col === 1 && row === 3;
              const isBoxO = col === 2 && row === 3;

              const cellClasses = `
                flex flex-col
                w-full h-full
                p-4 sm:p-6
                ${col === 1 ? 'bg-gray-50 border-gray-400 shadow-md' : ''}
                ${col === 2 && row === 0 ? 'bg-white border-blue-400 shadow-md' : ''}
                border border-gray-300
                rounded-lg
                overflow-hidden
              `;

              if (isBoxA) {
                return (
                  <div key={index} className={cellClasses}>
                    <SectionHeader accentColor="text-indigo-800">Set Keywords</SectionHeader>
                    <List
                      dense
                      sx={{
                        flex: 1,
                        overflowY: 'auto',
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        mb: 2,
                      }}
                    >
                      {keywords.length === 0 ? (
                        <ListItem sx={{ px: 3, py: 2 }}>
                          <ListItemText
                            primary="No keywords added yet"
                            primaryTypographyProps={{ color: 'text.secondary', fontStyle: 'italic' }}
                          />
                        </ListItem>
                      ) : (
                        keywords.map((kw, idx) => (
                          <ListItem key={idx} disablePadding sx={{ px: 3, py: 1.5 }}>
                            <ListItemText primary={kw} primaryTypographyProps={{ fontSize: '0.95rem' }} />
                          </ListItem>
                        ))
                      )}
                    </List>
                    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAddKeyword(); }} sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="New Keyword"
                        variant="outlined"
                        size="small"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        fullWidth
                      />
                      <Button type="submit" variant="contained" size="small" disabled={newKeyword.trim() === ''}>
                        Add
                      </Button>
                    </Box>
                  </div>
                );
              }

              if (isBoxB) {
                return (
                  <div key={index} className={cellClasses}>
                    <SectionHeader>Active Objects</SectionHeader>
                    <div className="flex-1 overflow-y-auto">
                      {Array.from({ length: 8 }, (_, i) => (
                        <Box
                          key={i}
                          component="form"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(inputs[i], i);
                          }}
                          className="flex items-center gap-3 mb-4 w-full"
                        >
                          <TextField
                            label={`Active Object ${i + 1}`}
                            variant="outlined"
                            size="small"
                            value={inputs[i]}
                            onChange={(e) => handleInputChange(i, e.target.value)}
                            fullWidth
                          />
                          <Button type="submit" variant="contained" size="small" disabled={!inputs[i].trim()}>
                            Submit
                          </Button>
                        </Box>
                      ))}
                    </div>
                  </div>
                );
              }

              if (isBoxC) {
                return (
                  <div key={index} className={cellClasses}>
                    <SectionHeader>Submitted Objects</SectionHeader>
                    <List dense sx={{ flex: 1, overflowY: 'auto' }}>
                      {submissions.length === 0 ? (
                        <ListItem sx={{ py: 4, justifyContent: 'center' }}>
                          <Typography color="text.secondary" fontStyle="italic">
                            No objects submitted yet
                          </Typography>
                        </ListItem>
                      ) : (
                        submissions.map((item, idx) => (
                          <ListItem
                            key={idx}
                            disablePadding
                            secondaryAction={
                              <>
                                <Checkbox
                                  edge="end"
                                  checked={selectedItems.includes(item)}
                                  onChange={() => handleToggleSelect(item)}
                                  sx={{ mr: 1 }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(idx)}
                                  aria-label="delete"
                                >
                                  <CloseIcon fontSize="small" color="error" />
                                </IconButton>
                              </>
                            }
                          >
                            <ListItemText
                              primary={item}
                              primaryTypographyProps={{ fontSize: '0.98rem' }}
                              sx={{ pl: 2 }}
                            />
                          </ListItem>
                        ))
                      )}
                    </List>
                  </div>
                );
              }

              if (isBoxF) {
                return (
                  <div key={index} className={cellClasses}>
                    <SectionHeader>Operation Categories</SectionHeader>
                    <List
                      dense
                      sx={{
                        flex: 1,
                        overflowY: 'auto',
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {operations.map((op) => (
                        <ListItem key={op} disablePadding>
                          <ListItemButton
                            sx={{ py: 1.5, px: 3 }}
                            onClick={() => {
                              setCurrentOperation(op as any);
                              setActionResult([]);
                            }}
                            selected={currentOperation === op}
                          >
                            <ListItemText primary={op} primaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </div>
                );
              }

              if (isBoxE) {
                return (
                  <div key={index} className={`${cellClasses} items-center justify-center text-center text-gray-800 font-medium px-4`}>
                    {currentOperation === 'compare' ? (
                      <Typography variant="body1">
                        Compare every pair of selected (checked) objects
                      </Typography>
                    ) : currentOperation === 'repeat' ? (
                      <Typography variant="body1">
                        Repeat each selected object {repeatCount} time{repeatCount !== 1 ? 's' : ''}
                      </Typography>
                    ) : currentOperation === 'stop' ? (
                      <Typography variant="body1">
                        Object must be in motion
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        Select an operation to begin
                      </Typography>
                    )}
                  </div>
                );
              }

              if (isBoxG) {
                return (
                  <div key={index} className={cellClasses}>
                    {currentOperation === 'repeat' ? (
                      <div className="flex flex-col h-full">
                        <SectionHeader accentColor="text-green-800">Repeat Attributes</SectionHeader>
                        <div className="flex flex-col flex-1 gap-4 p-2">
                          <TextField
                            label="Repeat Count"
                            variant="outlined"
                            type="number"
                            value={tempRepeatInput}
                            onChange={(e) => setTempRepeatInput(e.target.value)}
                            inputProps={{ min: 1, max: 10 }}
                            fullWidth
                          />
                          <Button variant="outlined" color="primary" fullWidth onClick={handleSetRepeat}>
                            Set
                          </Button>
                          {setConfirmation && (
                            <Typography variant="body2" color="success.main" sx={{ mt: 1, textAlign: 'center' }}>
                              {setConfirmation}
                            </Typography>
                          )}
                        </div>
                      </div>
                    ) : currentOperation === 'compare' ? (
                      <div className="flex-1 flex items-center justify-center text-center px-4">
                        <Typography variant="body1" color="text.secondary">
                          Comparison requires no additional attributes
                        </Typography>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-center text-gray-500 italic px-4">
                        Attributes pending operation category selection
                      </div>
                    )}
                  </div>
                );
              }

              if (isBoxI) {
                return (
                  <div
                    key={index}
                    className={`${cellClasses} flex flex-col p-6 items-center justify-start`}
                  >
                    <SectionHeader>Pending Execution</SectionHeader>
                    {pendingSummary.length === 0 ? (
                      <Typography color="text.secondary" sx={{ mt: 2 }}>
                        No action configured
                      </Typography>
                    ) : (
                      <List dense sx={{ width: '100%', mt: 1 }}>
                        {pendingSummary.map((line, idx) => (
                          <ListItem key={idx} sx={{ py: 0.5 }}>
                            <ListItemText primary={line} primaryTypographyProps={{ fontSize: '0.95rem' }} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </div>
                );
              }

              if (isBoxJ) {
                return (
                  <div
                    key={index}
                    className={`${cellClasses} flex flex-col p-6 items-center justify-start`}
                  >
                    <SectionHeader>Executed Tasks</SectionHeader>

                    {executedTasks.length === 0 ? (
                      <Typography color="text.secondary" sx={{ mt: 2 }}>
                        No tasks executed
                      </Typography>
                    ) : (
                      <List dense sx={{ width: '100%', mt: 1, flex: 1, overflowY: 'auto' }}>
                        {executedTasks.map((task, idx) => (
                          <ListItem
                            key={idx}
                            disablePadding
                            selected={selectedExecutedTask === task}
                            sx={{ py: 0.5 }}
                          >
                            <ListItemButton onClick={() => setSelectedExecutedTask(task)}>
                              <ListItemText primary={task} primaryTypographyProps={{ fontSize: '0.95rem' }} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    )}

                    <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <TextField
                        label="Associate trigger phrase"
                        variant="outlined"
                        size="small"
                        value={triggerPhraseInput}
                        onChange={(e) => setTriggerPhraseInput(e.target.value)}
                        fullWidth
                        disabled={!selectedExecutedTask}
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={handleAssociateTrigger}
                        disabled={!selectedExecutedTask || triggerPhraseInput.trim() === ''}
                      >
                        Associate Action
                      </Button>
                      {associateConfirmation && (
                        <Typography variant="body2" color="success.main" sx={{ mt: 1, textAlign: 'center' }}>
                          {associateConfirmation}
                        </Typography>
                      )}
                    </Box>
                  </div>
                );
              }

              if (isBoxKPlaceholder) {
                return (
                  <div key={index} className={cellClasses}>
                    <SectionHeader accentColor="text-purple-800">Trigger Phrases</SectionHeader>
                    {triggerToTask.size === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-gray-500 italic text-center px-4">
                        No trigger phrases assigned yet
                      </div>
                    ) : (
                      <List dense sx={{ flex: 1, overflowY: 'auto' }}>
                        {Array.from(triggerToTask.entries()).map(([phrase, task], idx) => (
                          <ListItem key={idx} divider sx={{ py: 1.2 }}>
                            <ListItemText
                              primary={<Typography component="span" fontWeight={500}>"{phrase}"</Typography>}
                              secondary={<Typography component="span" color="text.primary">→ {task}</Typography>}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </div>
                );
              }

              if (isBoxM) {
                return (
                  <div key={index} className={cellClasses}>
                    <SectionHeader accentColor="text-teal-800">Learned Objects</SectionHeader>
                    <div className="flex-1 flex items-center justify-center text-center text-gray-500 italic px-4">
                      Learned objects will appear here
                    </div>
                  </div>
                );
              }

              if (isBoxN) {
                return (
                  <div key={index} className={cellClasses}>
                    <SectionHeader accentColor="text-indigo-800">Actions Acquired</SectionHeader>
                    <div className="flex-1 flex items-center justify-center text-center text-gray-500 italic px-4">
                      Acquired actions will appear here
                    </div>
                  </div>
                );
              }

              if (isBoxO) {
                return (
                  <div key={index} className={cellClasses}>
                    <SectionHeader accentColor="text-orange-800">Execute Action</SectionHeader>
                    <div className="flex-1 flex items-center justify-center text-center text-gray-500 italic px-4">
                      Action execution results / controls will appear here
                    </div>
                  </div>
                );
              }

              const textSize = row === 1 ? 'text-4xl' : 'text-6xl';

              return (
                <div
                  key={index}
                  className={`${cellClasses} items-center justify-center ${textSize} font-bold text-gray-800 hover:bg-gray-200 transition-colors`}
                >
                  {letter}
                </div>
              );
            })}
          </div>

          {/* Bottom Action Output box */}
          <ActionOutputBox
            actionResult={actionResult}
            userInput={userInput}
            setUserInput={setUserInput}
            handleUserInputSubmit={handleUserInputSubmit}
            handleInitiateAction={handleInitiateAction}
            canInitiate={canInitiate}
            currentOperation={currentOperation}
            selectedItemsLength={selectedItems.length}
          />
        </div>
      }
      scroll={isMobile ? 'normal' : 'page'}
    />
  );
}

export default ActivitiesPage;
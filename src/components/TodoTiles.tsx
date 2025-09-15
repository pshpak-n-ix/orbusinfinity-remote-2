import { useState, useCallback } from 'react';
import { useTodos } from '../utils/hooks/useTodos';
import {
  makeStyles,
  mergeClasses,
  tokens,
  Badge,
  Button,
  Spinner,
  MessageBar,
  Checkbox,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@fluentui/react-components';
import {
  Add24Regular,
  CheckmarkCircle24Regular,
  Circle24Regular,
  MoreVertical24Regular,
  ArrowClockwise24Regular,
  Calendar24Regular,
  Clock24Regular,
} from '@fluentui/react-icons';
import { PageContentWrapper } from '@orbusinfinity-shared/ui-components';
import { TodoPriority } from '../apollo/operations';
import type { Todo } from '../apollo/types';

const useStyles = makeStyles({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow:
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    padding: '16px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 200px)',
    minHeight: '400px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  controlsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  tilesContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    minHeight: 0,
  },
  tilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    padding: '4px',
  },
  todoCard: {
    height: 'auto',
    minHeight: '240px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: tokens.shadow4,
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: tokens.colorNeutralBackground4,
  },
  cardHeader: {
    padding: tokens.spacingHorizontalM,
    paddingBottom: tokens.spacingVerticalS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
    flexShrink: 0,
  },
  cardContent: {
    padding: tokens.spacingHorizontalM,
    paddingTop: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    flexGrow: 1,
    minHeight: '80px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacingHorizontalM,
    paddingTop: tokens.spacingVerticalS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
    marginTop: 'auto',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '8px',
  },
  titleText: {
    flexGrow: 1,
    lineHeight: '1.3',
    fontSize: '16px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    wordBreak: 'break-word',
    marginBottom: '4px',
    maxHeight: '2.6em', // Approximately 2 lines
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  todoId: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    fontWeight: '400',
    letterSpacing: '0.5px',
  },
  completedTitle: {
    textDecoration: 'line-through',
    color: tokens.colorNeutralForeground3,
    opacity: 0.7,
  },
  description: {
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.4',
    fontSize: '14px',
    marginBottom: '8px',
    maxHeight: '3.2em', // Approximately 2-3 lines
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  priorityBadge: {
    textTransform: 'capitalize',
  },
  dateInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
  },
  statusIcon: {
    cursor: 'pointer',
    marginTop: '2px',
  },
  menuButton: {
    minWidth: 'auto',
    padding: '4px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: tokens.colorNeutralForeground2,
  },
});

const getPriorityColor = (priority: TodoPriority) => {
  switch (priority) {
    case TodoPriority.URGENT:
      return 'danger';
    case TodoPriority.HIGH:
      return 'important';
    case TodoPriority.MEDIUM:
      return 'warning';
    case TodoPriority.LOW:
      return 'success';
    default:
      return 'informative';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatOptionalDate = (dateString?: string | null) => {
  if (!dateString || dateString.length === 0) {
    return null;
  }
  return formatDate(dateString);
};

const isOverdue = (dueDate?: string | null) => {
  if (!dueDate) {return false;}
  return new Date(dueDate) < new Date();
};

interface TodoCardProps {
  todo: Todo;
  onToggleComplete: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

const TodoCard = ({ todo, onToggleComplete, onEdit, onDelete }: TodoCardProps) => {
  const styles = useStyles();
  const dueDate = formatOptionalDate(todo.dueDate);
  const overdue = isOverdue(todo.dueDate);

  const handleToggleComplete = useCallback(() => {
    onToggleComplete(todo);
  }, [todo, onToggleComplete]);

  const handleEdit = useCallback(() => {
    onEdit(todo);
  }, [todo, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(todo);
  }, [todo, onDelete]);

  return (
    <div 
      className={mergeClasses(
        styles.todoCard,
        todo.completed && styles.completedCard
      )}
    >
      {/* Title Section */}
      <div className={styles.cardHeader}>
        <div className={styles.titleSection}>
          {todo.completed ? (
            <CheckmarkCircle24Regular
              className={styles.statusIcon}
              style={{ color: tokens.colorPaletteGreenBackground2 }}
              onClick={handleToggleComplete}
            />
          ) : (
            <Circle24Regular 
              className={styles.statusIcon}
              onClick={handleToggleComplete}
            />
          )}
          <div className={styles.titleContainer}>
            <div 
              className={mergeClasses(
                styles.titleText,
                todo.completed && styles.completedTitle
              )}
              title={todo.title} // Tooltip for long titles
            >
              {todo.title}
            </div>
            <div className={styles.todoId}>
              ID: {todo.id.slice(-8)} {/* Show last 8 characters of ID */}
            </div>
          </div>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button
                appearance="subtle"
                icon={<MoreVertical24Regular />}
                size="small"
                className={styles.menuButton}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleToggleComplete}>
                  {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.cardContent}>
        {todo.description && (
          <div className={styles.description}>
            {todo.description}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Badge
            color={getPriorityColor(todo.priority)}
            className={styles.priorityBadge}
            size="small"
          >
            {todo.priority.toLowerCase()}
          </Badge>
          {dueDate && (
            <div className={styles.dateInfo} style={{ 
              color: overdue && !todo.completed 
                ? tokens.colorPaletteRedForeground1 
                : tokens.colorNeutralForeground3 
            }}
            >
              <Calendar24Regular fontSize="12px" />
              <span>{dueDate}</span>
              {overdue && !todo.completed && <span>(Overdue)</span>}
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className={styles.cardFooter}>
        <div className={styles.dateInfo}>
          <Clock24Regular fontSize="12px" />
          <span>Created {formatDate(todo.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

const TodoTiles = () => {
  const [avoidCache, setAvoidCache] = useState(false);
  const styles = useStyles();

  const { loading, error, todos, refresh } = useTodos();

  const handleRefresh = async () => {
    try {
      await refresh(avoidCache);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error refreshing todos:', err);
    }
  };

  const handleToggleComplete = useCallback((todo: Todo) => {
    // TODO: Implement toggle complete functionality
    // eslint-disable-next-line no-console
    console.log('Toggle complete for todo:', todo.id);
  }, []);

  const handleEdit = useCallback((todo: Todo) => {
    // TODO: Implement edit functionality
    // eslint-disable-next-line no-console
    console.log('Edit todo:', todo.id);
  }, []);

  const handleDelete = useCallback((todo: Todo) => {
    // TODO: Implement delete functionality
    // eslint-disable-next-line no-console
    console.log('Delete todo:', todo.id);
  }, []);

  const handleCreateTodo = useCallback(() => {
    // TODO: Implement create todo functionality
    // eslint-disable-next-line no-console
    console.log('Create new todo');
  }, []);

  if (error && todos.length === 0) {
    return (
      <PageContentWrapper title='TODO Tiles'>
        <MessageBar intent='error'>
          Failed to load todos: {(error as Error).message || 'Unknown error'}
        </MessageBar>
      </PageContentWrapper>
    );
  }

  return (
    <PageContentWrapper title='TODO Tiles'>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2>TODO Tiles ({todos.length})</h2>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.controlsGroup}>
              <Checkbox
                label='Avoid cache'
                checked={avoidCache}
                onChange={(_, data) => {
                  setAvoidCache(data.checked === true);
                }}
              />
              <Button
                appearance='subtle'
                icon={<ArrowClockwise24Regular />}
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
            <Button
              appearance='primary'
              icon={<Add24Regular />}
              onClick={handleCreateTodo}
            >
              Add TODO
            </Button>
          </div>
        </div>

        {loading && !todos.length ? (
          <div className={styles.loadingContainer}>
            <Spinner label='Loading todos...' />
          </div>
        ) : todos.length === 0 ? (
          <div className={styles.emptyState}>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              No todos found
            </div>
            <div style={{ fontSize: '14px', color: tokens.colorNeutralForeground2 }}>
              Create your first TODO to get started!
            </div>
          </div>
        ) : (
          <div className={styles.tilesContainer}>
            <div className={styles.tilesGrid}>
              {todos.map(todo => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContentWrapper>
  );
};

export default TodoTiles;

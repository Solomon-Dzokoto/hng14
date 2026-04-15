import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppText } from '@/components/ui/AppText';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors, spacing, radius } from '@/lib/design/tokens';
import { useTasks, Task } from '@/features/tasks/hooks/useTasks';
import { TaskCard } from '@/features/tasks/components/TaskCard';
import { TaskForm } from '@/features/tasks/components/TaskForm';

type Filter = 'all' | 'active' | 'done';
type Priority = 'low' | 'medium' | 'high';

const PRIORITY_NUM_MAP: Record<string, Priority> = {
  '0': 'low',
  '1': 'medium',
  '2': 'high',
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'done', label: 'Done' },
];

export default function TasksScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    tasks,
    isLoading,
    fetchTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  } = useTasks();

  useFocusEffect(
    useCallback(() => {
      fetchTasks(filter, search);
    }, [filter, search]),
  );

  const handleSave = async (title: string, description: string, priority: Priority) => {
    if (editingTask) {
      await updateTask(editingTask.id, title, description, priority);
    } else {
      await createTask(title, description, priority);
    }
    setFormVisible(false);
    setEditingTask(null);
    fetchTasks(filter, search);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormVisible(true);
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTask(id, completed);
    fetchTasks(filter, search);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    fetchTasks(filter, search);
  };

  const handleClearDone = () => {
    const doneCount = tasks.filter((t) => t.completed === 1).length;
    if (doneCount === 0) return;
    Alert.alert(
      'Clear Completed',
      `Remove ${doneCount} completed task${doneCount > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearCompleted();
            fetchTasks(filter, search);
          },
        },
      ],
    );
  };

  const activeCount = tasks.filter((t) => t.completed === 0).length;
  const doneCount = tasks.filter((t) => t.completed === 1).length;

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <AppText variant="xxl" weight="bold">Tasks</AppText>
          <AppText variant="sm" color="textMuted" style={{ marginTop: 2 }}>
            {activeCount} remaining · {doneCount} done
          </AppText>
        </View>
        {doneCount > 0 && (
          <TouchableOpacity onPress={handleClearDone} style={styles.clearBtn} activeOpacity={0.7}>
            <Ionicons name="checkmark-done" size={14} color={colors.error} />
            <AppText variant="xs" style={{ color: colors.error }} weight="medium">
              Clear done
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Input placeholder="Search tasks…" value={search} onChangeText={setSearch} />
      </View>

      {/* Filter pills */}
      <View style={styles.filterRow}>
        {FILTERS.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterPill, filter === key && styles.filterPillActive]}
            onPress={() => setFilter(key)}
            activeOpacity={0.7}
          >
            <AppText
              variant="sm"
              weight={filter === key ? 'semibold' : 'medium'}
              color={filter === key ? 'textInverse' : 'text'}
            >
              {label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task list */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="checkbox-outline"
              title={search ? 'No matching tasks' : filter === 'done' ? 'Nothing completed yet' : 'No tasks yet'}
              description={
                search
                  ? 'Try a different search term'
                  : filter === 'active'
                    ? 'All tasks are done! 🎉'
                    : 'Tap + to add your first task'
              }
            />
          ) : null
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => {
          setEditingTask(null);
          setFormVisible(true);
        }}
      >
        <Ionicons name="add" size={28} color={colors.textInverse} />
      </TouchableOpacity>

      {/* Task Form Modal */}
      <TaskForm
        visible={formVisible}
        mode={editingTask ? 'edit' : 'create'}
        initialTitle={editingTask?.title}
        initialDescription={editingTask?.description}
        initialPriority={editingTask ? PRIORITY_NUM_MAP[editingTask.priority] ?? 'medium' : 'medium'}
        onClose={() => {
          setFormVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.errorSubtle,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  searchWrap: { paddingHorizontal: spacing.md, marginTop: spacing.sm },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});

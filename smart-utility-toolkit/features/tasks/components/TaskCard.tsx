import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { colors, spacing, radius, shadows } from '@/lib/design/tokens';
import type { Task } from '../hooks/useTasks';

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  '0': { label: 'Low', color: colors.success },
  '1': { label: 'Med', color: colors.warning },
  '2': { label: 'High', color: colors.error },
};

interface Props {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  const isCompleted = task.completed === 1;
  const priority = PRIORITY_MAP[task.priority] ?? PRIORITY_MAP['1'];

  const confirmDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
    ]);
  };

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      {/* Left: Checkbox */}
      <TouchableOpacity
        style={styles.checkArea}
        onPress={() => onToggle(task.id, !isCompleted)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, isCompleted && styles.checkboxDone]}>
          {isCompleted && <Ionicons name="checkmark" size={13} color={colors.textInverse} />}
        </View>
      </TouchableOpacity>

      {/* Middle: Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <AppText
            variant="md"
            weight="semibold"
            numberOfLines={2}
            style={[styles.title, isCompleted && styles.titleDone]}
          >
            {task.title}
          </AppText>
          {/* Priority badge */}
          <View style={[styles.badge, { borderColor: priority.color + '60', backgroundColor: priority.color + '18' }]}>
            <View style={[styles.badgeDot, { backgroundColor: priority.color }]} />
            <AppText variant="xs" style={{ color: priority.color, fontWeight: '600' }}>
              {priority.label}
            </AppText>
          </View>
        </View>

        {task.description ? (
          <AppText variant="sm" color="textMuted" numberOfLines={2} style={styles.desc}>
            {task.description}
          </AppText>
        ) : null}

        <AppText variant="xs" color="textMuted" style={styles.date}>
          {new Date(task.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </AppText>
      </View>

      {/* Right: Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(task)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="pencil-outline" size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={confirmDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
    ...shadows.sm,
  },
  cardCompleted: {
    opacity: 0.65,
    backgroundColor: colors.background,
  },
  checkArea: { paddingTop: 2 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  content: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  title: { flex: 1, lineHeight: 21 },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  badgeDot: { width: 5, height: 5, borderRadius: 2.5 },
  desc: { marginTop: 2, marginBottom: 4, lineHeight: 18 },
  date: { marginTop: 2 },
  actions: { flexDirection: 'column', gap: spacing.sm },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

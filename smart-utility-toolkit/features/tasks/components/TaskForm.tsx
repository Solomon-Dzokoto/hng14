import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { colors, spacing, radius, shadows } from '@/lib/design/tokens';

type Priority = 'low' | 'medium' | 'high';

interface Props {
  visible: boolean;
  initialTitle?: string;
  initialDescription?: string;
  initialPriority?: Priority;
  onClose: () => void;
  onSave: (title: string, description: string, priority: Priority) => void;
  mode: 'create' | 'edit';
}

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: colors.success },
  { value: 'medium', label: 'Medium', color: colors.warning },
  { value: 'high', label: 'High', color: colors.error },
];

export function TaskForm({
  visible,
  initialTitle = '',
  initialDescription = '',
  initialPriority = 'medium',
  onClose,
  onSave,
  mode,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState<Priority>(initialPriority);

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setPriority(initialPriority);
    }
  }, [visible, initialTitle, initialDescription, initialPriority]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), description.trim(), priority);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
            <AppText variant="lg" weight="bold">
              {mode === 'create' ? 'New Task' : 'Edit Task'}
            </AppText>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveBtn, !title.trim() && { opacity: 0.4 }]}
              disabled={!title.trim()}
            >
              <AppText variant="sm" weight="semibold" color="textInverse">
                {mode === 'create' ? 'Add' : 'Save'}
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.field}>
            <AppText variant="xs" color="textMuted" style={styles.label}>TITLE *</AppText>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.textMuted}
              autoFocus={mode === 'create'}
              returnKeyType="next"
              maxLength={120}
            />
          </View>

          {/* Description */}
          <View style={styles.field}>
            <AppText variant="xs" color="textMuted" style={styles.label}>DESCRIPTION</AppText>
            <TextInput
              style={[styles.input, styles.multiInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add details (optional)…"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={400}
            />
          </View>

          {/* Priority */}
          <View style={styles.field}>
            <AppText variant="xs" color="textMuted" style={styles.label}>PRIORITY</AppText>
            <View style={styles.priorityRow}>
              {PRIORITY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.priorityPill,
                    priority === opt.value && { borderColor: opt.color, backgroundColor: opt.color + '15' },
                  ]}
                  onPress={() => setPriority(opt.value)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.priorityDot, { backgroundColor: opt.color }]} />
                  <AppText
                    variant="sm"
                    weight={priority === opt.value ? 'semibold' : 'medium'}
                    style={{ color: priority === opt.value ? opt.color : colors.textSecondary }}
                  >
                    {opt.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  closeBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.background,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  field: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  label: { marginBottom: spacing.xs, letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    color: colors.text,
    ...shadows.sm,
  },
  multiInput: { minHeight: 80, paddingTop: spacing.sm },
  priorityRow: { flexDirection: 'row', gap: spacing.sm },
  priorityPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
});

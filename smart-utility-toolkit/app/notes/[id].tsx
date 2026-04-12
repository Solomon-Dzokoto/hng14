import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '@/features/notes/hooks/useNotes';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppText } from '@/components/ui/AppText';
import { colors, spacing, typography } from '@/lib/design/tokens';

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getNote, createNote, updateNote, deleteNote } = useNotes();
  const isNew = id === 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!isNew && id) {
      getNote(id).then((n) => {
        if (n) { setTitle(n.title); setContent(n.content); }
      });
    }
  }, [id, isNew]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) { router.back(); return; }
    if (isNew) {
      await createNote(title || 'Untitled', content);
    } else if (id) {
      await updateNote(id, title || 'Untitled', content);
    }
    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          if (id) await deleteNote(id);
          router.back();
        } },
    ]);
  };

  return (
    <ScreenWrapper>
      <View style={styles.bar}>
        <TouchableOpacity onPress={handleSave} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.barActions}>
          {!isNew && (
            <TouchableOpacity onPress={handleDelete} hitSlop={8} style={{ marginRight: spacing.md }}>
              <Ionicons name="trash-outline" size={22} color={colors.error} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSave} hitSlop={8}>
            <AppText weight="semibold" color="primary">Save</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Start writing…"
          placeholderTextColor={colors.textMuted}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  barActions: { flexDirection: 'row', alignItems: 'center' },
  body: { padding: spacing.lg, flexGrow: 1 },
  titleInput: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  contentInput: {
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: 24,
    minHeight: 300,
  },
});

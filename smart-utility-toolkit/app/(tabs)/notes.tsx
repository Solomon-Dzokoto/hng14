import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useNotes, Note } from '@/features/notes/hooks/useNotes';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppText } from '@/components/ui/AppText';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors, spacing } from '@/lib/design/tokens';

export default function NotesScreen() {
  const router = useRouter();
  const { notes, fetchNotes, isLoading } = useNotes();
  const [search, setSearch] = useState('');

  // Refetch whenever the tab is focused (so edits/creates are reflected)
  useFocusEffect(
    useCallback(() => {
      fetchNotes(search);
    }, [search]),
  );

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity onPress={() => router.push(`/notes/${item.id}`)} activeOpacity={0.7}>
      <Card>
        <AppText variant="lg" weight="semibold" numberOfLines={1} style={styles.noteTitle}>
          {item.title || 'Untitled'}
        </AppText>
        <AppText variant="sm" color="textMuted" numberOfLines={2} style={styles.noteBody}>
          {item.content || 'No content'}
        </AppText>
        <View style={styles.noteMeta}>
          {item.category ? (
            <View style={styles.tag}>
              <AppText variant="xs" color="primary">{item.category}</AppText>
            </View>
          ) : null}
          <AppText variant="xs" color="textMuted">
            {new Date(item.updatedAt).toLocaleDateString()}
          </AppText>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.headerRow}>
        <AppText variant="xxl" weight="bold">Notes</AppText>
      </View>
      <View style={styles.searchWrap}>
        <Input placeholder="Search notes…" value={search} onChangeText={setSearch} />
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="document-text-outline"
              title={search ? 'No results' : 'No notes yet'}
              description={search ? 'Try another search term' : 'Tap + to create your first note'}
            />
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/notes/new')}
      >
        <Ionicons name="add" size={28} color={colors.textInverse} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  searchWrap: { paddingHorizontal: spacing.md },
  list: { paddingHorizontal: spacing.md, paddingBottom: 100, flexGrow: 1 },
  noteTitle: { marginBottom: 2 },
  noteBody: { marginBottom: spacing.sm },
  noteMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tag: {
    backgroundColor: colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
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
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

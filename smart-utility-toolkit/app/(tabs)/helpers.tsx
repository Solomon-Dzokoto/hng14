import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { colors, spacing, radius } from '@/lib/design/tokens';

interface Tool {
  id: string;
  title: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const TOOLS: Tool[] = [
  { id: 'split', title: 'Bill Splitter', desc: 'Divide expenses evenly', icon: 'people-outline', route: '/helpers/split' },
  { id: 'tip', title: 'Tip Calculator', desc: 'Calculate tips quickly', icon: 'cash-outline', route: '/helpers/tip' },
  { id: 'fuel', title: 'Fuel Estimator', desc: 'Estimate trip fuel costs', icon: 'car-outline', route: '/helpers/fuel' },
  { id: 'pct', title: 'Percentage Math', desc: 'Discounts & differences', icon: 'calculator-outline', route: '/helpers/percentage' },
];

export default function HelpersScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppText variant="xxl" weight="bold" style={styles.header}>Daily Helpers</AppText>

        {TOOLS.map((t) => (
          <TouchableOpacity
            key={t.id}
            activeOpacity={0.75}
            onPress={() => router.push(t.route as any)}
          >
            <Card style={styles.card}>
              <View style={styles.iconWrap}>
                <Ionicons name={t.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.cardBody}>
                <AppText variant="lg" weight="semibold">{t.title}</AppText>
                <AppText variant="sm" color="textMuted">{t.desc}</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  header: { marginTop: spacing.lg, marginBottom: spacing.lg },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primarySubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardBody: { flex: 1 },
});

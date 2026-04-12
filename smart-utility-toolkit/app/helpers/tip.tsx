import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppText } from '@/components/ui/AppText';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { calculateTip } from '@/features/helpers/services/formulas';
import { colors, spacing, radius } from '@/lib/design/tokens';

const TIPS = [10, 15, 18, 20, 25];

export default function TipScreen() {
  const router = useRouter();
  const [bill, setBill] = useState('');
  const [pct, setPct] = useState(15);
  const [result, setResult] = useState<{ tip: number; total: number } | null>(null);

  useEffect(() => {
    const b = parseFloat(bill);
    setResult(!isNaN(b) && b > 0 ? calculateTip(b, pct) : null);
  }, [bill, pct]);

  return (
    <ScreenWrapper>
      <View style={styles.bar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="lg" weight="bold">Tip Calculator</AppText>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.body}>
        <Card style={styles.formCard}>
          <Input label="Bill Amount" placeholder="0.00" value={bill} onChangeText={setBill} keyboardType="numeric" />
          <AppText variant="sm" weight="medium" color="textSecondary" style={{ marginBottom: spacing.sm }}>Tip %</AppText>
          <View style={styles.tipRow}>
            {TIPS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tipPill, t === pct && styles.tipPillActive]}
                onPress={() => setPct(t)}
              >
                <AppText variant="sm" weight={t === pct ? 'bold' : 'medium'} color={t === pct ? 'textInverse' : 'text'}>
                  {t}%
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {result && (
          <View style={styles.results}>
            <Card variant="outline" style={styles.half}>
              <AppText variant="xs" color="textMuted" align="center">Tip</AppText>
              <AppText variant="xl" weight="bold" color="primary" align="center">${result.tip.toFixed(2)}</AppText>
            </Card>
            <Card style={styles.half}>
              <AppText variant="xs" color="textMuted" align="center">Total</AppText>
              <AppText variant="xl" weight="bold" align="center">${result.total.toFixed(2)}</AppText>
            </Card>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  body: { paddingHorizontal: spacing.md },
  formCard: { padding: spacing.lg, marginBottom: spacing.lg },
  tipRow: { flexDirection: 'row', justifyContent: 'space-between' },
  tipPill: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.md, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  tipPillActive: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  results: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1, paddingVertical: spacing.lg, alignItems: 'center' },
});

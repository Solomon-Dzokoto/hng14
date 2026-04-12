import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppText } from '@/components/ui/AppText';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { percentage } from '@/features/helpers/services/formulas';
import { colors, spacing } from '@/lib/design/tokens';

export default function PercentageScreen() {
  const router = useRouter();
  const [val, setVal] = useState('');
  const [pct, setPct] = useState('10');

  const v = parseFloat(val);
  const p = parseFloat(pct);
  const valid = !isNaN(v) && !isNaN(p);
  const result = valid ? percentage(v, p) : null;

  return (
    <ScreenWrapper>
      <View style={styles.bar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="lg" weight="bold">Percentage</AppText>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.body}>
        <Card style={styles.formCard}>
          <AppText variant="md" weight="medium" style={styles.question}>
            What is <AppText weight="bold" color="primary">{pct || '?'}%</AppText> of <AppText weight="bold" color="primary">{val || '?'}</AppText> ?
          </AppText>
          <Input label="Value" placeholder="100" value={val} onChangeText={setVal} keyboardType="numeric" />
          <Input label="Percentage" placeholder="10" value={pct} onChangeText={setPct} keyboardType="numeric" />
        </Card>

        {result !== null && (
          <Card variant="outline" style={styles.resultCard}>
            <AppText variant="sm" color="textMuted" align="center">Result</AppText>
            <AppText variant="xxxl" weight="bold" color="primary" align="center">{result.toFixed(2)}</AppText>
          </Card>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  body: { paddingHorizontal: spacing.md },
  formCard: { padding: spacing.lg, marginBottom: spacing.lg },
  question: { marginBottom: spacing.lg, lineHeight: 26 },
  resultCard: { paddingVertical: spacing.xl, backgroundColor: colors.primarySubtle, borderColor: colors.primaryLight },
});

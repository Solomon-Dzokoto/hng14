import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppText } from '@/components/ui/AppText';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { splitBill } from '@/features/helpers/services/formulas';
import { colors, spacing } from '@/lib/design/tokens';

export default function BillSplitScreen() {
  const router = useRouter();
  const [total, setTotal] = useState('');
  const [people, setPeople] = useState('2');
  const [result, setResult] = useState<number | null>(null);

  const calc = () => {
    const t = parseFloat(total);
    const p = parseInt(people, 10);
    setResult(!isNaN(t) && !isNaN(p) && p > 0 ? splitBill(t, p) : null);
  };

  return (
    <ScreenWrapper>
      <View style={styles.bar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="lg" weight="bold">Bill Splitter</AppText>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.body}>
        <Card style={styles.formCard}>
          <Input label="Total Bill" placeholder="0.00" value={total} onChangeText={setTotal} keyboardType="numeric" />
          <Input label="People" placeholder="2" value={people} onChangeText={setPeople} keyboardType="number-pad" />
          <Button label="Calculate" onPress={calc} />
        </Card>

        {result !== null && (
          <Card variant="outline" style={styles.resultCard}>
            <AppText variant="sm" color="textMuted" align="center">Each person pays</AppText>
            <AppText variant="xxxl" weight="bold" color="primary" align="center">
              ${result.toFixed(2)}
            </AppText>
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
  resultCard: { paddingVertical: spacing.xl, backgroundColor: colors.primarySubtle, borderColor: colors.primaryLight },
});

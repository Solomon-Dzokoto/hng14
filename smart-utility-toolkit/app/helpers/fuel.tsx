import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppText } from '@/components/ui/AppText';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { fuelCost } from '@/features/helpers/services/formulas';
import { colors, spacing } from '@/lib/design/tokens';

export default function FuelScreen() {
  const router = useRouter();
  const [dist, setDist] = useState('');
  const [eff, setEff] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calc = () => {
    const d = parseFloat(dist);
    const e = parseFloat(eff);
    const p = parseFloat(price);
    setResult(!isNaN(d) && !isNaN(e) && !isNaN(p) && e > 0 ? fuelCost(d, e, p) : null);
  };

  return (
    <ScreenWrapper>
      <View style={styles.bar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <AppText variant="lg" weight="bold">Fuel Estimator</AppText>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.body}>
        <Card style={styles.formCard}>
          <Input label="Distance" placeholder="e.g. 100" value={dist} onChangeText={setDist} keyboardType="numeric" />
          <Input label="Fuel Efficiency (mpg / km/l)" placeholder="e.g. 25" value={eff} onChangeText={setEff} keyboardType="numeric" />
          <Input label="Fuel Price per Unit" placeholder="e.g. 3.50" value={price} onChangeText={setPrice} keyboardType="numeric" />
          <Button label="Calculate" onPress={calc} />
        </Card>

        {result !== null && (
          <Card variant="outline" style={styles.resultCard}>
            <AppText variant="sm" color="textMuted" align="center">Estimated Cost</AppText>
            <AppText variant="xxxl" weight="bold" color="primary" align="center">${result.toFixed(2)}</AppText>
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

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { AppText } from '@/components/ui/AppText';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing, radius } from '@/lib/design/tokens';
import { useCurrencyRates } from '@/features/converter/services/currency';
import {
  lengthUnits, weightUnits, tempUnits,
  convertStandard, convertTemperature,
} from '@/features/converter/services/conversions';
import { useConverterStore } from '@/features/converter/store';

type Category = 'Length' | 'Weight' | 'Temp' | 'Currency';

const CATEGORIES: Category[] = ['Length', 'Weight', 'Temp', 'Currency'];

function getUnitsForCategory(cat: Category, currencyKeys: string[]): string[] {
  if (cat === 'Length') return Object.keys(lengthUnits);
  if (cat === 'Weight') return Object.keys(weightUnits);
  if (cat === 'Temp') return [...tempUnits];
  return currencyKeys.slice(0, 20); // top 20 currencies
}

export default function ConverterScreen() {
  const [category, setCategory] = useState<Category>('Length');
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');
  const [fromUnit, setFromUnit] = useState('Meters');
  const [toUnit, setToUnit] = useState('Feet');

  const { data: currencyData, isLoading: currencyLoading } = useCurrencyRates();
  const { history, addHistory } = useConverterStore();

  const currencyKeys = currencyData ? Object.keys(currencyData.rates) : ['USD', 'EUR', 'GBP'];
  const units = getUnitsForCategory(category, currencyKeys);

  const selectCategory = useCallback((cat: Category) => {
    setCategory(cat);
    setFromValue('1');
    setToValue('');
    const u = getUnitsForCategory(cat, currencyKeys);
    setFromUnit(u[0]);
    setToUnit(u[1] ?? u[0]);
  }, [currencyKeys]);

  const handleConvert = () => {
    const v = parseFloat(fromValue);
    if (isNaN(v)) { setToValue('Invalid'); return; }

    let result = 0;
    if (category === 'Length') {
      result = convertStandard(v, lengthUnits[fromUnit], lengthUnits[toUnit]);
    } else if (category === 'Weight') {
      result = convertStandard(v, weightUnits[fromUnit], weightUnits[toUnit]);
    } else if (category === 'Temp') {
      result = convertTemperature(v, fromUnit, toUnit);
    } else if (category === 'Currency' && currencyData) {
      result = (v / currencyData.rates[fromUnit]) * currencyData.rates[toUnit];
    }

    const out = result.toFixed(category === 'Currency' ? 2 : 4);
    setToValue(out);
    addHistory({ category, fromValue, fromUnit, toValue: out, toUnit });
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue || '1');
    setToValue('');
  };

  // Simple unit picker as scrollable pills
  const UnitPicker = ({ selected, onSelect }: { selected: string; onSelect: (u: string) => void }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 38, marginBottom: spacing.sm }}>
      {units.map((u) => (
        <TouchableOpacity
          key={u}
          style={[styles.unitPill, u === selected && styles.unitPillActive]}
          onPress={() => onSelect(u)}
        >
          <AppText variant="sm" weight={u === selected ? 'bold' : 'medium'} color={u === selected ? 'textInverse' : 'text'}>
            {u}
          </AppText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <AppText variant="xxl" weight="bold" style={styles.header}>Converter</AppText>

        {/* Category Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, category === cat && styles.catPillActive]}
              onPress={() => selectCategory(cat)}
            >
              <AppText
                variant="sm"
                weight={category === cat ? 'bold' : 'medium'}
                color={category === cat ? 'textInverse' : 'text'}
              >
                {cat}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Conversion Card */}
        <Card style={styles.convertCard}>
          <AppText variant="xs" color="textMuted" style={{ marginBottom: 2 }}>From</AppText>
          <UnitPicker selected={fromUnit} onSelect={setFromUnit} />
          <Input value={fromValue} onChangeText={setFromValue} keyboardType="numeric" placeholder="Enter value" />

          <TouchableOpacity onPress={handleSwap} style={styles.swapBtn}>
            <Ionicons name="swap-vertical" size={22} color={colors.primary} />
          </TouchableOpacity>

          <AppText variant="xs" color="textMuted" style={{ marginBottom: 2 }}>To</AppText>
          <UnitPicker selected={toUnit} onSelect={setToUnit} />
          <Input value={toValue} editable={false} placeholder="Result" />

          <Button label="Convert" onPress={handleConvert} isLoading={category === 'Currency' && currencyLoading} />
        </Card>

        {/* History */}
        {history.length > 0 && (
          <>
            <AppText variant="lg" weight="bold" style={styles.sectionTitle}>Recent</AppText>
            {history.slice(0, 5).map((h) => (
              <View key={h.id} style={styles.historyRow}>
                <AppText variant="xs" color="textMuted">{h.category}</AppText>
                <AppText variant="sm" weight="medium">
                  {h.fromValue} {h.fromUnit} → {h.toValue} {h.toUnit}
                </AppText>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  header: { marginTop: spacing.lg, marginBottom: spacing.md },
  catRow: { maxHeight: 44, marginBottom: spacing.lg },
  catPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  catPillActive: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  convertCard: { padding: spacing.lg, marginBottom: spacing.lg },
  swapBtn: {
    alignSelf: 'center',
    padding: spacing.sm,
    backgroundColor: colors.primarySubtle,
    borderRadius: radius.full,
    marginVertical: spacing.xs,
  },
  unitPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
  },
  unitPillActive: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  sectionTitle: { marginBottom: spacing.sm },
  historyRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
});

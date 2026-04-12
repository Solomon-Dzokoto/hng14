import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { initDb } from '@/lib/sqlite';
import { colors } from '@/lib/design/tokens';

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initDb().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

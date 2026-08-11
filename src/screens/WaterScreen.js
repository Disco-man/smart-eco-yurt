import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { getWaterData } from '../data/mockSensors';

export default function WaterScreen() {
  const [data, setData] = useState(getWaterData());
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setData(getWaterData());
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    const t = setInterval(() => setData(getWaterData()), 5000);
    return () => clearInterval(t);
  }, []);

  const tankProgress = data.tankLevelPercent / 100;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[theme.accent]} />
        }
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="pulse-outline" size={24} color={theme.accent} />
            <Text style={styles.cardTitle}>Датчик потока</Text>
          </View>
          <Text style={styles.cardDesc}>Считает расход воды в реальном времени.</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{data.flowRate}</Text>
              <Text style={styles.metricLabel}>л/мин сейчас</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{data.totalConsumptionToday}</Text>
              <Text style={styles.metricLabel}>л за сегодня</Text>
            </View>
          </View>
          <Text style={styles.lastUpdate}>Обновлено: {data.lastUpdate}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="water-outline" size={24} color={theme.primary} />
            <Text style={styles.cardTitle}>Уровень бака</Text>
          </View>
          <View style={styles.tankWrap}>
            <View style={styles.tankBarBg}>
              <View style={[styles.tankBarFill, { width: `${data.tankLevelPercent}%` }]} />
            </View>
            <Text style={styles.tankPercent}>{data.tankLevelPercent}%</Text>
          </View>
          <Text style={styles.lastUpdate}>Обновлено: {data.lastUpdate}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flash-outline" size={24} color={theme.warning} />
            <Text style={styles.cardTitle}>Насос</Text>
          </View>
          <Text style={styles.cardDesc}>
            Автоматическое отключение насоса при достижении уровня или по таймеру. Сейчас: <Text style={styles.bold}>{data.pumpOn ? 'включён' : 'выключен'}</Text>.
          </Text>
        </View>

        <View style={[styles.card, styles.reuseCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="repeat-outline" size={28} color={theme.success} />
            <Text style={styles.cardTitle}>Повторное использование серой воды</Text>
          </View>
          <Text style={styles.reuseValue}>{data.greyWaterReusePercent}%</Text>
          <Text style={styles.cardDesc}>
            Доля повторно используемой серой воды в системе.
          </Text>
          <Text style={styles.lastUpdate}>Обновлено: {data.lastUpdate}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scroll: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  cardTitle: { flex: 1, fontSize: 17, fontWeight: '600', color: theme.text },
  cardDesc: { fontSize: 14, color: theme.textMuted, lineHeight: 20 },
  metricsRow: { flexDirection: 'row', marginVertical: 12 },
  metric: { flex: 1, alignItems: 'center' },
  metricValue: { fontSize: 26, fontWeight: '700', color: theme.primary },
  metricLabel: { fontSize: 12, color: theme.textMuted, marginTop: 4 },
  lastUpdate: { fontSize: 11, color: theme.textMuted, marginTop: 10 },
  tankWrap: { marginVertical: 8 },
  tankBarBg: {
    height: 12,
    backgroundColor: theme.background,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tankBarFill: {
    height: '100%',
    backgroundColor: theme.accent,
    borderRadius: 6,
  },
  tankPercent: { fontSize: 14, fontWeight: '600', color: theme.text, marginTop: 6 },
  bold: { fontWeight: '700', color: theme.text },
  reuseCard: { borderLeftWidth: 4, borderLeftColor: theme.success },
  reuseValue: { fontSize: 32, fontWeight: '800', color: theme.success, marginVertical: 8 },
});

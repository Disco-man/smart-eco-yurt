import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { getClimateData, getAirData, getWaterData } from '../data/mockSensors';

function StatCard({ icon, label, value, unit, status, statusColor }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.iconWrap, statusColor && { backgroundColor: statusColor + '20' }]}>
        <Ionicons name={icon} size={28} color={statusColor || theme.accent} />
      </View>
      <Text style={styles.statValue}>{value}{unit}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {status ? <Text style={[styles.statStatus, { color: statusColor || theme.textMuted }]}>{status}</Text> : null}
    </View>
  );
}

export default function DashboardScreen() {
  const [climate, setClimate] = useState(getClimateData());
  const [air, setAir] = useState(getAirData());
  const [water, setWater] = useState(getWaterData());
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setClimate(getClimateData());
    setAir(getAirData());
    setWater(getWaterData());
    setTimeout(() => setRefreshing(false), 600);
  };

  useEffect(() => {
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[theme.accent]} />
        }
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Smart Eco Yurt</Text>
          <Text style={styles.heroSub}>Умная юрта — обзор</Text>
          <Text style={styles.lastUpdate}>Обновлено: {climate.lastUpdate}</Text>
        </View>

        <Text style={styles.sectionTitle}>Климат</Text>
        <View style={styles.row}>
          <StatCard
            icon="thermometer-outline"
            label="Температура"
            value={climate.temperature}
            unit="°C"
            status={climate.heaterOn ? 'Обогрев вкл.' : 'Норма'}
            statusColor={climate.heaterOn ? theme.warning : theme.success}
          />
          <StatCard
            icon="water-outline"
            label="Влажность"
            value={climate.humidity}
            unit="%"
          />
        </View>
        <View style={styles.row}>
          <StatCard
            icon="leaf-outline"
            label="Экономия энергии"
            value={climate.energySavingPercent}
            unit="%"
            status="до 20–30%"
          />
          <StatCard
            icon="airplane-outline"
            label="Вентиляция"
            value={climate.ventilationOn ? 'Вкл' : 'Выкл'}
            unit=""
          />
        </View>

        <Text style={styles.sectionTitle}>Воздух</Text>
        <View style={styles.row}>
          <StatCard
            icon="cloud-outline"
            label="CO₂"
            value={air.co2}
            unit=" ppm"
            status={air.co2Status === 'normal' ? 'Норма' : air.co2Status === 'warning' ? 'Проветрить' : 'Высоко'}
            statusColor={air.co2Status === 'danger' ? theme.danger : air.co2Status === 'warning' ? theme.warning : theme.success}
          />
          <StatCard
            icon="flask-outline"
            label="VOC"
            value={air.voc}
            unit=" mg/m³"
            status={air.vocStatus}
          />
        </View>

        <Text style={styles.sectionTitle}>Вода</Text>
        <View style={styles.row}>
          <StatCard
            icon="water-outline"
            label="Уровень бака"
            value={water.tankLevelPercent}
            unit="%"
          />
          <StatCard
            icon="pulse-outline"
            label="Расход сегодня"
            value={water.totalConsumptionToday}
            unit=" л"
          />
        </View>
        <View style={styles.row}>
          <StatCard
            icon="repeat-outline"
            label="Повтор воды"
            value={water.greyWaterReusePercent}
            unit="%"
            status="серая вода"
          />
          <StatCard
            icon="flash-outline"
            label="Насос"
            value={water.pumpOn ? 'Вкл' : 'Выкл'}
            unit=""
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Прототип • Данные имитированы</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scroll: { padding: 16, paddingBottom: 32 },
  hero: {
    backgroundColor: theme.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  heroTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  lastUpdate: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 12,
    marginTop: 8,
  },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 20, fontWeight: '700', color: theme.text },
  statLabel: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  statStatus: { fontSize: 10, marginTop: 2 },
  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 11, color: theme.textMuted },
});

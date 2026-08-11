import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { getClimateData } from '../data/mockSensors';

export default function ClimateScreen() {
  const [data, setData] = useState(getClimateData());
  const [ventilationOn, setVentilationOn] = useState(data.ventilationOn);
  const [heaterOn, setHeaterOn] = useState(data.heaterOn);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    const next = getClimateData();
    setData(next);
    setVentilationOn(next.ventilationOn);
    setHeaterOn(next.heaterOn);
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    const t = setInterval(() => setData(getClimateData()), 4000);
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
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="thermometer-outline" size={24} color={theme.accent} />
            <Text style={styles.cardTitle}>Температура и влажность</Text>
          </View>
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{data.temperature}°C</Text>
              <Text style={styles.metricLabel}>Температура</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{data.humidity}%</Text>
              <Text style={styles.metricLabel}>Влажность</Text>
            </View>
          </View>
          <Text style={styles.lastUpdate}>Обновлено: {data.lastUpdate}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="airplane-outline" size={24} color={theme.primary} />
            <Text style={styles.cardTitle}>Вентиляция</Text>
            <Switch
              value={ventilationOn}
              onValueChange={setVentilationOn}
              trackColor={{ false: '#ccc', true: theme.accentLight }}
              thumbColor="#fff"
            />
          </View>
          <Text style={styles.cardDesc}>
            Автоматическое включение вентиляции по данным датчика. Сейчас: {ventilationOn ? 'включена' : 'выключена'}.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flame-outline" size={24} color={theme.warning} />
            <Text style={styles.cardTitle}>Электрический обогреватель</Text>
            <Switch
              value={heaterOn}
              onValueChange={setHeaterOn}
              trackColor={{ false: '#ccc', true: theme.warning }}
              thumbColor="#fff"
            />
          </View>
          <Text style={styles.cardDesc}>
            Ручное или автоматическое управление обогревом. Сейчас: {heaterOn ? 'включён' : 'выключен'}.
          </Text>
        </View>

        <View style={[styles.card, styles.savingsCard]}>
          <Ionicons name="leaf" size={32} color={theme.success} />
          <Text style={styles.savingsTitle}>Экономия энергии</Text>
          <Text style={styles.savingsValue}>{data.energySavingPercent}%</Text>
          <Text style={styles.savingsDesc}>до 20–30% за счёт умного климат-контроля</Text>
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  cardTitle: { flex: 1, fontSize: 17, fontWeight: '600', color: theme.text },
  cardDesc: { fontSize: 14, color: theme.textMuted, lineHeight: 20 },
  metricsRow: { flexDirection: 'row', marginVertical: 8 },
  metric: { flex: 1, alignItems: 'center' },
  metricValue: { fontSize: 28, fontWeight: '700', color: theme.primary },
  metricLabel: { fontSize: 13, color: theme.textMuted, marginTop: 4 },
  lastUpdate: { fontSize: 11, color: theme.textMuted, marginTop: 8 },
  savingsCard: { alignItems: 'center', padding: 24 },
  savingsTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginTop: 8 },
  savingsValue: { fontSize: 36, fontWeight: '800', color: theme.success, marginTop: 4 },
  savingsDesc: { fontSize: 13, color: theme.textMuted, marginTop: 4, textAlign: 'center' },
});

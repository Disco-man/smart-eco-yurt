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
import { getAirData } from '../data/mockSensors';

function statusColor(s) {
  if (s === 'danger') return theme.danger;
  if (s === 'warning') return theme.warning;
  return theme.success;
}

function statusText(s) {
  if (s === 'danger') return 'Требуется проветривание';
  if (s === 'warning') return 'Рекомендуется проветрить';
  return 'Норма';
}

export default function AirScreen() {
  const [data, setData] = useState(getAirData());
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setData(getAirData());
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    const t = setInterval(() => setData(getAirData()), 5000);
    return () => clearInterval(t);
  }, []);

  const co2Color = statusColor(data.co2Status);
  const vocColor = statusColor(data.vocStatus);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[theme.accent]} />
        }
      >
        <View style={styles.infoBox}>
          <Ionicons name="phone-portrait-outline" size={20} color={theme.primary} />
          <Text style={styles.infoText}>
            Данные с датчиков передаются на экран внутри юрты и владельцу в приложение.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cloud-outline" size={28} color={co2Color} />
            <Text style={styles.cardTitle}>Датчик CO₂</Text>
          </View>
          <Text style={[styles.bigValue, { color: co2Color }]}>{data.co2} ppm</Text>
          <View style={[styles.badge, { backgroundColor: co2Color + '20' }]}>
            <Text style={[styles.badgeText, { color: co2Color }]}>{statusText(data.co2Status)}</Text>
          </View>
          <Text style={styles.hint}>Норма до ~1000 ppm</Text>
          <Text style={styles.lastUpdate}>Обновлено: {data.lastUpdate}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="flask-outline" size={28} color={vocColor} />
            <Text style={styles.cardTitle}>Датчик VOC</Text>
          </View>
          <Text style={[styles.bigValue, { color: vocColor }]}>{data.voc} mg/m³</Text>
          <View style={[styles.badge, { backgroundColor: vocColor + '20' }]}>
            <Text style={[styles.badgeText, { color: vocColor }]}>{data.vocStatus === 'normal' ? 'Норма' : 'Внимание'}</Text>
          </View>
          <Text style={styles.hint}>Летучие органические соединения</Text>
          <Text style={styles.lastUpdate}>Обновлено: {data.lastUpdate}</Text>
        </View>

        <View style={[styles.card, styles.footerCard]}>
          <Text style={styles.footerTitle}>Мониторинг воздуха</Text>
          <Text style={styles.footerDesc}>
            Повышает уровень сервиса: гости видят качество воздуха в юрте, вы получаете данные в приложении.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scroll: { padding: 16, paddingBottom: 32 },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.primaryLight + '15',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  infoText: { flex: 1, fontSize: 13, color: theme.text, lineHeight: 20 },
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: '600', color: theme.text },
  bigValue: { fontSize: 32, fontWeight: '800' },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
  },
  badgeText: { fontSize: 14, fontWeight: '600' },
  hint: { fontSize: 12, color: theme.textMuted, marginTop: 8 },
  lastUpdate: { fontSize: 11, color: theme.textMuted, marginTop: 12 },
  footerCard: { backgroundColor: theme.primary + '12' },
  footerTitle: { fontSize: 15, fontWeight: '600', color: theme.text },
  footerDesc: { fontSize: 13, color: theme.textMuted, marginTop: 6, lineHeight: 20 },
});

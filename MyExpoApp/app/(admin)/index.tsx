import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Stack, router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI } from '@/services/api';
import { wp, hp, fontScale, padding } from '@/utils/responsive';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState('');

  const inFlightRef = useRef(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      setError('');
      const response = await adminAPI.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      inFlightRef.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Admin Dashboard', headerShown: false }} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1A3A69" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Admin Dashboard', headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome, {user?.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadDashboard} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
                <MaterialIcons name="people" size={40} color="#FFF" />
                <Text style={styles.statValue}>{dashboardData?.totals?.users || 0}</Text>
                <Text style={styles.statLabel}>Total Users</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
                <MaterialIcons name="admin-panel-settings" size={40} color="#FFF" />
                <Text style={styles.statValue}>{dashboardData?.totals?.admins || 0}</Text>
                <Text style={styles.statLabel}>Admins</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
                <MaterialIcons name="person" size={40} color="#FFF" />
                <Text style={styles.statValue}>{dashboardData?.totals?.regularUsers || 0}</Text>
                <Text style={styles.statLabel}>Regular Users</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#9C27B0' }]}>
                <MaterialIcons name="account-tree" size={40} color="#FFF" />
                <Text style={styles.statValue}>{dashboardData?.totals?.familyTreeEntries || 0}</Text>
                <Text style={styles.statLabel}>Family Trees</Text>
              </View>
            </View>

            {/* Pending approvals */}
            <View style={styles.section}>
              <View style={styles.pendingRow}>
                <View style={styles.pendingLeft}>
                  <Text style={styles.sectionTitle}>Pending Approvals</Text>
                  <Text style={styles.pendingCount}>
                    {dashboardData?.totals?.pendingApprovals || 0} pending
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push('/(admin)/approvals')}
                  style={styles.pendingButton}
                >
                  <Text style={styles.pendingButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Signups */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Signups (Last 30 Days)</Text>
              {dashboardData?.recentSignups?.length > 0 ? (
                dashboardData.recentSignups.slice(0, 5).map((signup: any, index: number) => (
                  <View key={signup.id || index} style={styles.listItem}>
                    <MaterialIcons name="person-add" size={24} color="#4CAF50" />
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemTitle}>{signup.name}</Text>
                      <Text style={styles.listItemSubtitle}>
                        {signup.email} • {signup.role} • {new Date(signup.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No recent signups</Text>
              )}
            </View>

            {/* Most Active Users */}
            {dashboardData?.activeUsers?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Most Active Users</Text>
                {dashboardData.activeUsers.map((activeUser: any, index: number) => (
                  <View key={activeUser._id || index} style={styles.listItem}>
                    <MaterialIcons name="star" size={24} color="#FFD700" />
                    <View style={styles.listItemContent}>
                      <Text style={styles.listItemTitle}>{activeUser.name}</Text>
                      <Text style={styles.listItemSubtitle}>
                        {activeUser.entryCount} family tree entries
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Signup Trend */}
            {dashboardData?.signupTrend?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Signup Trend (Last 6 Months)</Text>
                {dashboardData.signupTrend.map((trend: any, index: number) => (
                  <View key={index} style={styles.trendItem}>
                    <Text style={styles.trendMonth}>
                      {new Date(trend._id.year, trend._id.month - 1).toLocaleDateString('default', { 
                        month: 'long',
                        year: 'numeric' 
                      })}
                    </Text>
                    <Text style={styles.trendCount}>{trend.count} signups</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: fontScale(16),
    color: '#666',
  },
  header: {
    backgroundColor: '#1A3A69',
    paddingHorizontal: padding.lg,
    paddingTop: hp(6),
    paddingBottom: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: fontScale(14),
    color: '#FFFFFF',
    opacity: 0.8,
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingLeft: {
    flex: 1,
  },
  pendingCount: {
    marginTop: hp(0.5),
    fontSize: fontScale(13),
    color: '#666',
  },
  pendingButton: {
    backgroundColor: '#1A3A69',
    paddingHorizontal: padding.md,
    paddingVertical: hp(1),
    borderRadius: 10,
    marginLeft: wp(3),
  },
  pendingButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: fontScale(13),
  },
    marginTop: hp(0.5),
  },
  logoutButton: {
    padding: padding.sm,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: padding.md,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: padding.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: padding.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: fontScale(32),
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: hp(1),
  },
  statLabel: {
    fontSize: fontScale(14),
    color: '#FFFFFF',
    marginTop: hp(0.5),
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: padding.md,
    padding: padding.lg,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: fontScale(18),
    fontWeight: '600',
    color: '#1A3A69',
    marginBottom: hp(1.5),
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listItemContent: {
    flex: 1,
    marginLeft: padding.md,
  },
  listItemTitle: {
    fontSize: fontScale(16),
    fontWeight: '500',
    color: '#333',
  },
  listItemSubtitle: {
    fontSize: fontScale(13),
    color: '#666',
    marginTop: hp(0.3),
  },
  emptyText: {
    fontSize: fontScale(14),
    color: '#999',
    textAlign: 'center',
    paddingVertical: hp(2),
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  trendMonth: {
    fontSize: fontScale(14),
    color: '#333',
  },
  trendCount: {
    fontSize: fontScale(14),
    fontWeight: '600',
    color: '#1A3A69',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: padding.xl,
  },
  errorText: {
    fontSize: fontScale(16),
    color: '#666',
    textAlign: 'center',
    marginTop: hp(2),
  },
  retryButton: {
    marginTop: hp(2),
    backgroundColor: '#1A3A69',
    paddingHorizontal: padding.xl,
    paddingVertical: padding.md,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(16),
    fontWeight: '600',
  },
});

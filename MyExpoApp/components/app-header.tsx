import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { wp, hp, fontScale, padding } from '@/utils/responsive';
import { useAuth } from '@/contexts/AuthContext';

export function AppHeader({ showBack = true }: { showBack?: boolean }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + hp(1.5), hp(5)) }]}>
        {showBack ? (
          <>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="#1A3A69" />
            </TouchableOpacity>
            <Text style={styles.headerLogo}>THALI YUVA SANGH</Text>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <MaterialIcons name="menu" size={24} color="#1A3A69" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.logoContainer}>
              <Text style={styles.headerLogo}>THALI YUVA SANGH</Text>
            </View>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <MaterialIcons name="menu" size={24} color="#1A3A69" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Navigation Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <MaterialIcons name="close" size={24} color="#1A3A69" />
              </TouchableOpacity>
            </View>
            <View style={styles.menuItems}>
              <Link href="/(tabs)" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Home</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/about-us" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>About</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/committee" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Committee</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/sponsors" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Sponsors</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/temples" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Temples</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/events" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Events</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/gallery" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Gallery</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/contact" asChild>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.menuItemText}>Contact</Text>
                </TouchableOpacity>
              </Link>
              
              {/* Authentication Links */}
              {isAuthenticated ? (
                <>
                  <Link href="/profile" asChild>
                    <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                      <MaterialIcons name="person" size={20} color="#1A3A69" style={styles.menuIcon} />
                      <Text style={styles.menuItemText}>Profile</Text>
                      {user?.role === 'admin' && (
                        <View style={styles.adminBadge}>
                          <Text style={styles.adminBadgeText}>Admin</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" asChild>
                    <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                      <Text style={styles.menuItemText}>Login</Text>
                    </TouchableOpacity>
                  </Link>
                  <Link href="/signup" asChild>
                    <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                      <Text style={styles.menuItemText}>Sign Up</Text>
                    </TouchableOpacity>
                  </Link>
                </>
              )}
            </View>
            {!isAuthenticated && (
              <Link href="/signup" asChild>
                <TouchableOpacity style={styles.joinUsButton} onPress={() => setMenuVisible(false)}>
                  <Text style={styles.joinUsText}>Join Us</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding.md,
    paddingBottom: hp(2),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  logoContainer: {
    flex: 1,
  },
  headerLogo: {
    fontSize: fontScale(12),
    fontWeight: '700',
    color: '#1A3A69',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    backgroundColor: '#F5F5F0',
    width: wp(80),
    height: '100%',
    paddingTop: hp(8),
    paddingHorizontal: padding.md,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(4),
  },
  menuTitle: {
    fontSize: fontScale(24),
    fontWeight: '700',
    color: '#1A3A69',
  },
  menuItems: {
    gap: hp(1),
    marginBottom: hp(3),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: padding.md,
  },
  menuIcon: {
    marginRight: wp(2),
  },
  menuItemText: {
    fontSize: fontScale(18),
    color: '#333333',
    flex: 1,
  },
  adminBadge: {
    backgroundColor: '#FFF4E6',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(1),
  },
  adminBadgeText: {
    fontSize: fontScale(12),
    fontWeight: '600',
    color: '#FF8C00',
  },
  joinUsButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: hp(2),
    paddingHorizontal: padding.lg,
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: hp(5),
  },
  joinUsText: {
    color: '#FFFFFF',
    fontSize: fontScale(18),
    fontWeight: '700',
  },
});

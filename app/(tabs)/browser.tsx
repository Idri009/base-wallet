import React, { useLayoutEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles, spacing, typography, borderRadius } from '@/utils/theme';
import { ArrowLeft, Bookmark, Globe, History, Search, Star } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


interface DappItem {
  name: string;
  url: string;
  icon: string;
  description: string;
  category: string;
}

const popularDapps: DappItem[] = [
  {
    name: 'Base Bridge',
    url: 'https://bridge.base.org',
    icon: 'https://bridge.base.org/favicon.ico',
    description: 'Bridge assets to and from Base',
    category: 'Bridge'
  },
  {
    name: 'Aerodrome',
    url: 'https://aerodrome.finance',
    icon: 'https://aerodrome.finance/favicon.ico',
    description: 'Decentralized exchange on Base',
    category: 'DEX'
  },
  {
    name: 'Baseswap',
    url: 'https://baseswap.fi',
    icon: 'https://baseswap.fi/favicon.ico',
    description: 'Leading DEX on Base',
    category: 'DEX'
  }
];

export default function BrowserScreen() {
  const navigation = useNavigation()
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'popular' | 'recent' | 'bookmarks'>('popular');
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);

  const webViewRef = useRef<WebView>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: webViewUrl ? 'none' : 'flex' },
    });
    // navigation.setOptions
  }, [webViewUrl, navigation]);

  const handleUrlSubmit = () => {
    if (url.trim()) {
      let formattedUrl = url.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }
      setWebViewUrl(formattedUrl);
    }
  };

  const handleDappPress = (dapp: DappItem) => {
    setWebViewUrl(dapp.url);
  };


  const renderDappItem = (dapp: DappItem) => (
    <TouchableOpacity 
      key={dapp.name}
      style={styles.dappItem}
      activeOpacity={0.7}
      onPress={() => handleDappPress(dapp)}
    >
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.dappIcon}>
        <Globe size={24} color={colors.primary.default} />
      </View>
      <View style={styles.dappInfo}>
        <Text style={styles.dappName}>{dapp.name}</Text>
        <Text style={styles.dappDescription}>{dapp.description}</Text>
      </View>
      <TouchableOpacity style={styles.bookmarkButton}>
        <Star size={16} color={colors.text.secondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );


  if (webViewUrl) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <StatusBar style='dark' backgroundColor={colors.background.light}/>
        <View style={styles.webviewHeader}>
          <TouchableOpacity onPress={() => setWebViewUrl(null)} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.webviewTitle} numberOfLines={1}>
            {webViewUrl}
          </Text>
        </View>
        <WebView 
          ref={webViewRef}
          source={{ uri: webViewUrl }}
          style={{ flex: 1 }}
          startInLoadingState
          
        />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={commonStyles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Browser</Text>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search or enter website URL"
            placeholderTextColor={colors.text.hint}
            value={url}
            onChangeText={setUrl}
            onSubmitEditing={handleUrlSubmit}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'popular' && styles.activeTab]}
            onPress={() => setActiveTab('popular')}
          >
            <Globe size={16} color={activeTab === 'popular' ? colors.primary.default : colors.text.secondary} />
            <Text style={[styles.tabText, activeTab === 'popular' && styles.activeTabText]}>Popular</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
            onPress={() => setActiveTab('recent')}
          >
            <History size={16} color={activeTab === 'recent' ? colors.primary.default : colors.text.secondary} />
            <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>Recent</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'bookmarks' && styles.activeTab]}
            onPress={() => setActiveTab('bookmarks')}
          >
            <Bookmark size={16} color={activeTab === 'bookmarks' ? colors.primary.default : colors.text.secondary} />
            <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.activeTabText]}>Bookmarks</Text>
          </TouchableOpacity>
        </View> */}

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[colors.primary.fade, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.accent}
          />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured on Base</Text>
            <View style={styles.dappsList}>
              {popularDapps.map(renderDappItem)}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular DEXs</Text>
            <View style={styles.dappsList}>
              {popularDapps.filter(d => d.category === 'DEX').map(renderDappItem)}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.deep,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
    paddingVertical: spacing.md,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.md,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.light,
  },
  activeTab: {
    backgroundColor: colors.primary.fade,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  activeTabText: {
    color: colors.primary.default,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  dappsList: {
    gap: spacing.md,
  },
  dappItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.ui.border,
    overflow: 'hidden',
  },
  dappIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dappInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  dappName: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  dappDescription: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  bookmarkButton: {
    padding: spacing.sm,
  },
  accent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 150,
    height: 150,
    borderBottomLeftRadius: 150,
    opacity: 0.2,
  },
  webviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.light,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  backButton: {
    marginRight: spacing.md,
  },
  webviewTitle: {
    ...typography.bodySmall,
    color: colors.text.primary,
    flex: 1,
  },
});
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { demos, type Category } from './animationDemos';

const categories = ['All', 'Motion', 'Reveal', 'Style'] as const;
type Filter = (typeof categories)[number];
type Demo = (typeof demos)[number];

const categoryColors: Record<Category, { ink: string; wash: string }> = {
  Motion: { ink: '#145979', wash: '#DDF4FC' },
  Reveal: { ink: '#2B5279', wash: '#E3EEFC' },
  Style: { ink: '#424C7D', wash: '#EAEFFD' },
};

const darkCategoryColors: typeof categoryColors = {
  Motion: { ink: '#ADE9FA', wash: '#254354' },
  Reveal: { ink: '#C6DDFF', wash: '#303F58' },
  Style: { ink: '#DAD6FF', wash: '#3B3C59' },
};

function App() {
  const [isDark, setIsDark] = useState(false);
  const styles = isDark ? darkStyles : lightStyles;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea}>
        <AnimationLab
          isDark={isDark}
          onToggleTheme={() => setIsDark(current => !current)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function AnimationLab({
  isDark,
  onToggleTheme,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  const styles = isDark ? darkStyles : lightStyles;
  const { width } = useWindowDimensions();
  const wide = width >= 720;
  const compact = Dimensions.get('screen').height < 620;
  const list = useRef<FlatList<Demo>>(null);
  const [filter, setFilter] = useState<Filter>('All');
  const [demo, setDemo] = useState(demos[0]);
  const [variant, setVariant] = useState(0);
  const [replay, setReplay] = useState(0);
  const [sample, setSample] = useState('NATIVEBITS');
  const [draft, setDraft] = useState(sample);
  const visible =
    filter === 'All' ? demos : demos.filter(item => item.category === filter);
  const previewWidth = wide ? Math.min(width / 2, 510) : width - 40;
  const fontSize = Math.min(
    52,
    Math.max(
      16,
      Math.floor(
        (previewWidth - 66) / Math.max(6, Array.from(sample).length * 0.72),
      ),
    ),
  );

  function chooseDemo(item: Demo) {
    Keyboard.dismiss();
    setDemo(item);
    setVariant(0);
    setReplay(value => value + 1);
  }

  function chooseFilter(next: Filter) {
    setFilter(next);
    list.current?.scrollToOffset({ offset: 0, animated: false });
    if (next !== 'All' && demo.category !== next) {
      const first = demos.find(item => item.category === next);
      if (first) {
        chooseDemo(first);
      }
    }
  }

  function commitSample(value: string) {
    const next = value.trim() || 'NATIVEBITS';
    setSample(next);
    setDraft(next);
  }

  const stage = (
    <View style={styles.stage}>
      <View style={styles.themeRow}>
        <Text style={styles.stageEyebrow}>LIVE PREVIEW</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isDark ? 'Switch to light theme' : 'Switch to dark theme'
          }
          testID="toggle-theme"
          onPress={onToggleTheme}
          style={({ pressed }) => [
            styles.themeButton,
            pressed && styles.replayPressed,
          ]}
        >
          <Text accessible={false} style={styles.themeIcon}>
            {isDark ? '☀' : '☾'}
          </Text>
          <Text style={styles.replayLabel}>{isDark ? 'Light' : 'Dark'}</Text>
        </Pressable>
      </View>
      <View style={styles.stageHeader}>
        <View style={styles.stageHeading}>
          <Text
            accessibilityRole="header"
            testID="preview-title"
            style={styles.stageName}
          >
            {demo.name}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Replay animation"
          testID="replay-animation"
          hitSlop={8}
          onPress={() => setReplay(value => value + 1)}
          style={({ pressed }) => [
            styles.replay,
            pressed && styles.replayPressed,
          ]}
        >
          <Text style={styles.replayIcon}>↻</Text>
          <Text style={styles.replayLabel}>Replay</Text>
        </Pressable>
      </View>
      <Text style={styles.stageDescription}>{demo.description}</Text>
      <View style={[styles.canvas, compact && styles.canvasCompact]}>
        <View
          pointerEvents="none"
          accessible={false}
          style={StyleSheet.absoluteFill}
        >
          <View style={styles.guideHorizontal} />
          <View style={styles.guideVertical} />
        </View>
        <React.Fragment key={`${demo.name}/${sample}/${variant}/${replay}`}>
          {demo.render(
            {
              text: sample,
              style: {
                fontSize,
                fontWeight: '700',
                color: isDark ? '#61DAFB' : '#086181',
              },
              fontSize,
              isDark,
            },
            variant,
          )}
        </React.Fragment>
      </View>
      {demo.controls && (
        <View style={styles.variantSection}>
          <Text style={styles.stageLabel}>{demo.controls.label}</Text>
          <View accessibilityRole="tablist" style={styles.variantRow}>
            {demo.controls.options.map((option, index) => (
              <Pressable
                key={option}
                testID={`variant-${index}`}
                accessibilityRole="tab"
                accessibilityState={{ selected: variant === index }}
                onPress={() => setVariant(index)}
                style={[
                  styles.variant,
                  variant === index && styles.variantSelected,
                ]}
              >
                <Text
                  style={[
                    styles.variantLabel,
                    variant === index && styles.variantLabelSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      {demo.name !== 'CountUpText' && (
        <View style={styles.sampleRow}>
          <Text style={styles.stageLabel}>Sample text</Text>
          <TextInput
            accessibilityLabel="Sample text"
            testID="sample-text"
            value={draft}
            maxLength={16}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            keyboardAppearance={isDark ? 'dark' : 'light'}
            onChangeText={setDraft}
            onEndEditing={event => commitSample(event.nativeEvent.text)}
            selectionColor="#61DAFB"
            style={styles.sampleInput}
          />
        </View>
      )}
    </View>
  );

  const filters = (
    <View style={styles.catalogHeader}>
      <Text accessibilityRole="header" style={styles.catalogTitle}>
        Animations
      </Text>
      <View accessibilityRole="tablist" style={styles.filters}>
        {categories.map(category => (
          <Pressable
            key={category}
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === category }}
            testID={`filter-${category}`}
            onPress={() => chooseFilter(category)}
            style={[
              styles.filter,
              filter === category && styles.filterSelected,
            ]}
          >
            <Text
              style={[
                styles.filterLabel,
                filter === category && styles.filterLabelSelected,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  function renderDemo({ item }: { item: Demo }) {
    const selected = demo.name === item.name;
    const colors = (isDark ? darkCategoryColors : categoryColors)[
      item.category
    ];
    return (
      <Pressable
        testID={`effect-${item.name}`}
        accessibilityRole="tab"
        accessibilityLabel={`${item.name}. ${item.description}`}
        accessibilityState={{ selected }}
        onPress={() => chooseDemo(item)}
        style={({ pressed }) => [
          styles.demoCard,
          selected && styles.demoSelected,
          pressed && styles.demoPressed,
        ]}
      >
        <View style={styles.cardHeader}>
          <Text
            style={[
              styles.cardCategory,
              { color: colors.ink, backgroundColor: colors.wash },
            ]}
          >
            {item.category}
          </Text>
          <Text
            accessible={false}
            style={[styles.cardArrow, selected && styles.cardArrowSelected]}
          >
            ↗
          </Text>
        </View>
        <Text style={styles.demoName}>{item.name}</Text>
        <Text style={styles.demoDescription}>{item.description}</Text>
      </Pressable>
    );
  }

  const catalog = (
    <View style={styles.catalog}>
      {filters}
      {compact && !wide ? (
        <View style={styles.grid}>
          {visible.map(item => (
            <View key={item.name} style={styles.compactCard}>
              {renderDemo({ item })}
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          ref={list}
          data={visible}
          extraData={demo.name}
          keyExtractor={item => item.name}
          renderItem={renderDemo}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  const content = (
    <>
      <View style={styles.header}>
        <View style={styles.brandMark}>
          <Text style={styles.brandLetter}>N</Text>
        </View>
        <View style={styles.brandcopy}>
          <Text style={styles.brandName}>NativeBits</Text>
          <Text accessibilityRole="header" style={styles.title}>
            Animation lab
          </Text>
        </View>
        <Text style={styles.effectCount}>{demos.length} effects</Text>
      </View>
      <View style={[styles.content, wide && styles.wideContent]}>
        <View style={wide ? styles.stageColumn : undefined}>{stage}</View>
        {catalog}
      </View>
    </>
  );

  return compact && !wide ? (
    <ScrollView keyboardShouldPersistTaps="handled">{content}</ScrollView>
  ) : (
    <View style={styles.screen}>{content}</View>
  );
}

function createStyles(isDark: boolean) {
  const pick = (light: string, dark: string) => (isDark ? dark : light);
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: pick('#F0F7FB', '#141A23') },
    screen: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 17,
    },
    brandMark: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: '#61DAFB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandLetter: { fontSize: 24, fontWeight: '800', color: '#20232A' },
    brandcopy: { flex: 1 },
    brandName: {
      fontSize: 12,
      fontWeight: '700',
      color: pick('#086181', '#61DAFB'),
    },
    title: {
      fontSize: 28,
      letterSpacing: -1.15,
      fontWeight: '800',
      color: pick('#152536', '#F6FBFF'),
    },
    effectCount: {
      color: pick('#395B72', '#B9D5E6'),
      borderColor: pick('#CDDDE8', '#385265'),
      borderWidth: 1,
      borderRadius: 18,
      paddingHorizontal: 11,
      paddingVertical: 5,
      fontSize: 12,
      fontWeight: '700',
    },
    content: { flex: 1, paddingHorizontal: 20 },
    wideContent: { flexDirection: 'row', gap: 22, alignItems: 'stretch' },
    stageColumn: { width: '47%', maxWidth: 510 },
    stage: {
      backgroundColor: pick('#FFFFFF', '#20232A'),
      borderColor: pick('#D6E5EF', '#364757'),
      borderWidth: 1,
      borderRadius: 24,
      padding: 16,
    },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 4,
    },
    themeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      minHeight: 36,
      borderRadius: 12,
      paddingHorizontal: 11,
      backgroundColor: pick('#E1EEF6', '#2B3D4E'),
    },
    themeIcon: {
      color: pick('#086181', '#61DAFB'),
      fontSize: 16,
      fontWeight: '700',
    },
    stageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
    },
    stageHeading: { flex: 1 },
    stageEyebrow: {
      fontSize: 10,
      letterSpacing: 1.4,
      color: pick('#086181', '#61DAFB'),
      fontWeight: '800',
    },
    stageName: {
      color: pick('#152536', '#F6FBFF'),
      fontSize: 24,
      letterSpacing: -0.6,
      fontWeight: '800',
      marginTop: 3,
    },
    stageDescription: {
      color: pick('#405C73', '#CCDBE7'),
      fontSize: 13,
      lineHeight: 19,
      marginTop: 3,
      marginBottom: 12,
    },
    replay: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      borderRadius: 14,
      backgroundColor: pick('#E1EEF6', '#2B3D4E'),
      minHeight: 42,
      paddingHorizontal: 12,
    },
    replayPressed: { backgroundColor: pick('#DAF0FA', '#36546B') },
    replayIcon: {
      fontSize: 21,
      lineHeight: 24,
      color: pick('#086181', '#C8F2FF'),
    },
    replayLabel: {
      color: pick('#24465E', '#E5F8FF'),
      fontSize: 12,
      fontWeight: '700',
    },
    canvas: {
      minHeight: 138,
      borderRadius: 15,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: pick('#C4DCE9', '#466279'),
      backgroundColor: pick('#EBF7FD', '#253041'),
    },
    canvasCompact: { minHeight: 112 },
    guideHorizontal: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: StyleSheet.hairlineWidth,
      backgroundColor: pick('#C4DCE9', '#466279'),
    },
    guideVertical: {
      position: 'absolute',
      left: '50%',
      top: 0,
      bottom: 0,
      width: StyleSheet.hairlineWidth,
      backgroundColor: pick('#C4DCE9', '#466279'),
    },
    variantSection: { marginTop: 10 },
    stageLabel: {
      color: pick('#405C73', '#CCDBE7'),
      fontSize: 12,
      fontWeight: '700',
    },
    variantRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 5,
    },
    variant: {
      minHeight: 38,
      justifyContent: 'center',
      borderRadius: 10,
      paddingHorizontal: 11,
      backgroundColor: pick('#E1EEF6', '#2B3D4E'),
    },
    variantSelected: { backgroundColor: '#61DAFB' },
    variantLabel: {
      color: pick('#24465E', '#E7F5FB'),
      fontSize: 12,
      fontWeight: '700',
    },
    variantLabelSelected: { color: '#182D40' },
    sampleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      marginTop: 10,
    },
    sampleInput: {
      flex: 1,
      minHeight: 36,
      borderWidth: 1,
      borderColor: pick('#8AA8BB', '#56778E'),
      borderRadius: 10,
      color: pick('#152536', '#F6FBFF'),
      paddingHorizontal: 10,
      paddingVertical: 4,
      fontSize: 13,
    },
    catalog: { flex: 1, marginTop: 16 },
    catalogHeader: { marginBottom: 10 },
    catalogTitle: {
      fontSize: 22,
      letterSpacing: -0.5,
      fontWeight: '800',
      color: pick('#152536', '#F6FBFF'),
      marginBottom: 7,
    },
    filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    filter: {
      backgroundColor: pick('#E1EEF6', '#273747'),
      borderRadius: 14,
      paddingHorizontal: 12,
      minHeight: 37,
      justifyContent: 'center',
    },
    filterSelected: { backgroundColor: '#61DAFB' },
    filterLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: pick('#2B536F', '#CCDBE7'),
    },
    filterLabelSelected: { color: '#182D40' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 16 },
    gridRow: { gap: 8, marginBottom: 8 },
    listContent: { paddingBottom: 10 },
    compactCard: { width: '48%' },
    demoCard: {
      flex: 1,
      minWidth: 0,
      minHeight: 112,
      padding: 10,
      gap: 4,
      backgroundColor: pick('#FFFFFF', '#202A36'),
      borderRadius: 15,
      borderWidth: 1,
      borderColor: pick('#D6E5EF', '#364757'),
    },
    demoSelected: {
      borderColor: pick('#1885A8', '#61DAFB'),
      backgroundColor: pick('#E5F8FF', '#223C50'),
    },
    demoPressed: { backgroundColor: pick('#DAF0FA', '#324A5D') },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardCategory: {
      fontSize: 10,
      fontWeight: '800',
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 5,
      overflow: 'hidden',
    },
    cardArrow: {
      color: pick('#4F6F87', '#B9D5E6'),
      fontSize: 16,
      fontWeight: '700',
    },
    cardArrowSelected: { color: pick('#086181', '#61DAFB') },
    demoName: {
      fontSize: 15,
      fontWeight: '800',
      color: pick('#1A3349', '#F6FBFF'),
      letterSpacing: -0.25,
    },
    demoDescription: {
      fontSize: 12,
      lineHeight: 17,
      color: pick('#405C73', '#CCDBE7'),
    },
  });
}

const lightStyles = createStyles(false);
const darkStyles = createStyles(true);

export default App;

/**
 * src/screens/AddBookScreen.tsx
 *
 * Écran d'ajout ou de modification d'un livre de recettes.
 *
 * Fonctionnalités principales :
 * - Mode ajout ou édition selon les paramètres de route
 * - Recherche de livre via :
 *   * Scan de code-barres ISBN avec caméra
 *   * Recherche par titre
 *   * Recherche par auteur
 * - API Google Books pour récupérer automatiquement les informations
 * - Saisie manuelle de tous les champs (titre, auteur, éditeur, année, catégorie)
 * - Upload ou prise de photo pour la couverture
 * - Validation des données avant sauvegarde
 *
 * Technologies :
 * - expo-camera pour le scan de codes-barres
 * - expo-image-picker pour sélectionner/prendre des photos
 * - Google Books API pour la recherche de livres
 *
 * Design :
 * - Onglets de recherche (ISBN/Titre/Auteur)
 * - Résultats de recherche en cartes cliquables
 * - Formulaire avec tous les champs éditables
 * - Prévisualisation de l'image de couverture
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, FlatList, Image, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { Book } from '../models/types';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { spacing, fontSizes, borderRadius, iconSizes } from '../theme/responsive';

type AddBookScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddBook'>;
type AddBookScreenRouteProp = RouteProp<RootStackParamList, 'AddBook'>;

interface Props {
  navigation: AddBookScreenNavigationProp;
  route: AddBookScreenRouteProp;
}

interface BookData {
  title?: string;
  authors?: string[];
  publishedDate?: string;
  publisher?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  categories?: string[];
}

interface SearchResult {
  id: string;
  volumeInfo: BookData;
}

export default function AddBookScreen({ navigation, route }: Props) {
  const { addBook, updateBook, books, suggestBookCategory } = useApp();
  const { theme } = useTheme();
  const editBookId = route.params?.bookId;
  const editingBook = editBookId ? books.find(b => b.id === editBookId) : null;
  const isEditing = !!editingBook;

  const [searchMode, setSearchMode] = useState<'isbn' | 'title' | 'author'>('isbn');
  const [isbn, setIsbn] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [title, setTitle] = useState(editingBook?.title || '');
  const [author, setAuthor] = useState(editingBook?.author || '');
  const [pseudonym, setPseudonym] = useState(editingBook?.pseudonym || '');
  const [editor, setEditor] = useState(editingBook?.editor || '');
  const [year, setYear] = useState(editingBook?.year?.toString() || '');
  const [category, setCategory] = useState(editingBook?.category || '');
  const [coverImage, setCoverImage] = useState(editingBook?.coverImage || '');
  const [showCoverOptions, setShowCoverOptions] = useState(false);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!scannedRef.current) {
      scannedRef.current = true;
      setShowScanner(false);
      setIsbn(data);
      setSearchMode('isbn');
      searchByISBNWithData(data);
    }
  };

  const openScanner = async () => {
    if (!permission) {
      const { status } = await requestPermission();
      if (status === 'granted') {
        scannedRef.current = false;
        setShowScanner(true);
      } else {
        Alert.alert('Permission refusée', 'L\'accès à la caméra est nécessaire pour scanner les codes-barres.');
      }
    } else if (!permission.granted) {
      const { status } = await requestPermission();
      if (status === 'granted') {
        scannedRef.current = false;
        setShowScanner(true);
      } else {
        Alert.alert('Permission refusée', 'L\'accès à la caméra est nécessaire pour scanner les codes-barres.');
      }
    } else {
      scannedRef.current = false;
      setShowScanner(true);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'L\'accès à la galerie est nécessaire pour choisir une image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
      setShowCoverOptions(false);
    }
  };

  const addCoverUrl = () => {
    Alert.prompt(
      'URL de la couverture',
      'Entrez l\'URL de l\'image de couverture',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'OK',
          onPress: (url: string | undefined) => {
            if (url && url.trim()) {
              setCoverImage(url.trim());
              setShowCoverOptions(false);
            }
          },
        },
      ],
      'plain-text',
      coverImage
    );
  };

  const toHttps = (url: string | undefined): string =>
    url ? url.replace(/^http:\/\//, 'https://').replace('&edge=curl', '') : '';

  const getBookCoverUrl = (imageLinks: BookData['imageLinks'], volumeId: string): string => {
    if (imageLinks?.thumbnail) {
      return toHttps(imageLinks.thumbnail);
    }
    if (imageLinks?.smallThumbnail) {
      return toHttps(imageLinks.smallThumbnail);
    }
    if (volumeId) {
      return `https://books.google.com/books/content?id=${volumeId}&printsec=frontcover&img=1&zoom=1&source=gbs_api`;
    }
    return '';
  };

  const isCookingBook = (bookData: BookData): boolean => {
    const categories = bookData.categories || [];
    const title = (bookData.title || '').toLowerCase();

    // Mots-clés de cuisine dans les catégories Google Books
    const cookingKeywords = [
      'cooking', 'cookbooks', 'cuisine', 'recipe', 'recipes',
      'culinary', 'food', 'baking', 'pastry', 'gastronomie'
    ];

    // Vérifier les catégories
    const hasCookingCategory = categories.some(cat =>
      cookingKeywords.some(keyword => cat.toLowerCase().includes(keyword))
    );

    // Vérifier aussi le titre comme fallback
    const hasCookingInTitle = cookingKeywords.some(keyword => title.includes(keyword));

    return hasCookingCategory || hasCookingInTitle;
  };

  const fillBookData = (item: SearchResult, showWarningIfNotCooking: boolean = false) => {
    const bookData = item.volumeInfo;
    const coverUrl = getBookCoverUrl(bookData.imageLinks, item.id);

    // Vérifier si c'est un livre de cuisine
    const isCooking = isCookingBook(bookData);

    const applyData = () => {
      setTitle(bookData.title || '');
      setAuthor(bookData.authors ? bookData.authors.join(', ') : '');
      setPseudonym('');
      setEditor(bookData.publisher || '');
      setYear(bookData.publishedDate ? bookData.publishedDate.substring(0, 4) : '');
      setCategory(bookData.categories ? bookData.categories[0] : '');
      setCoverImage(coverUrl);
      setSearchResults([]);
    };

    if (showWarningIfNotCooking && !isCooking) {
      Alert.alert(
        '⚠️ Livre hors sujet détecté',
        `Ce livre ne semble pas être un livre de recettes.\n\nCatégories: ${bookData.categories?.join(', ') || 'Aucune'}\n\nVoulez-vous quand même l'ajouter ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Ajouter quand même', onPress: applyData },
        ]
      );
    } else {
      applyData();
    }
  };

  const searchByISBNWithData = async (isbnData: string) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnData.trim()}`,
        { signal: abortControllerRef.current.signal }
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        fillBookData(data.items[0], true);
      } else {
        Alert.alert('Non trouvé', 'Aucun livre trouvé avec cet ISBN. Essayez la recherche par titre.');
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        Alert.alert('Erreur', 'Impossible de rechercher le livre. Vérifiez votre connexion internet.');
        console.error('ISBN search error:', error);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const searchByISBN = async () => {
    if (!isbn.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un ISBN');
      return;
    }
    await searchByISBNWithData(isbn);
  };

  const searchByTitle = async () => {
    if (!searchTitle.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre');
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(searchTitle.trim())}+subject:cooking&maxResults=10`,
        { signal: abortControllerRef.current.signal }
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setSearchResults(data.items);
      } else {
        Alert.alert('Non trouvé', 'Aucun livre de cuisine trouvé avec ce titre. Vous pouvez saisir les informations manuellement.');
        setSearchResults([]);
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        Alert.alert('Erreur', 'Impossible de rechercher le livre. Vérifiez votre connexion internet.');
        console.error('Title search error:', error);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const searchByAuthor = async () => {
    if (!searchAuthor.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom d\'auteur');
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(searchAuthor.trim())}+subject:cooking&maxResults=15`,
        { signal: abortControllerRef.current.signal }
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setSearchResults(data.items);
      } else {
        Alert.alert('Non trouvé', 'Aucun livre de cuisine trouvé pour cet auteur. Vous pouvez saisir les informations manuellement.');
        setSearchResults([]);
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        Alert.alert('Erreur', 'Impossible de rechercher le livre. Vérifiez votre connexion internet.');
        console.error('Author search error:', error);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const getSuggestions = () => {
    if (title.trim() && author.trim()) {
      return suggestBookCategory(title, author, pseudonym);
    }
    return [];
  };

  const handleShowSuggestions = () => {
    const suggestions = getSuggestions();
    if (suggestions.length > 0) {
      setShowCategorySuggestions(true);
    } else {
      Alert.alert('Aucune suggestion', 'Nous n\'avons pas pu suggérer de catégorie pour ce livre. Veuillez saisir une catégorie manuellement.');
    }
  };

  const handleSuggestionSelect = (suggestedCategory: string) => {
    setCategory(suggestedCategory);
    setShowCategorySuggestions(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert('Erreur', 'Le titre et l\'auteur sont obligatoires');
      return;
    }

    const parsedYear = year.trim() ? parseInt(year.trim(), 10) : undefined;
    if (parsedYear !== undefined && (isNaN(parsedYear) || parsedYear < 1000 || parsedYear > new Date().getFullYear() + 1)) {
      Alert.alert('Erreur', 'L\'année doit être un nombre valide (ex: 2024)');
      return;
    }

    if (isEditing && editingBook) {
      const updatedBook: Book = {
        ...editingBook,
        title: title.trim(),
        author: author.trim(),
        pseudonym: pseudonym.trim() || undefined,
        editor: editor.trim() || undefined,
        year: parsedYear,
        category: category.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
      };
      await updateBook(updatedBook);
    } else {
      const newBook: Book = {
        id: Date.now().toString(),
        title: title.trim(),
        author: author.trim(),
        pseudonym: pseudonym.trim() || undefined,
        editor: editor.trim() || undefined,
        year: parsedYear,
        category: category.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      await addBook(newBook);
    }
    navigation.goBack();
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => {
    const bookData = item.volumeInfo;
    const title = bookData.title || 'Titre inconnu';
    const author = bookData.authors ? bookData.authors.join(', ') : 'Auteur inconnu';
    return (
      <TouchableOpacity
        style={styles.searchResultCard}
        onPress={() => fillBookData(item)}
        accessibilityRole="button"
        accessibilityLabel={`Sélectionner le livre ${title} par ${author}`}
        accessibilityHint="Appuyez pour remplir le formulaire avec ce livre"
      >
        {bookData.imageLinks?.thumbnail && (
          <Image
            source={{ uri: toHttps(bookData.imageLinks.thumbnail) }}
            style={styles.resultThumbnail}
            accessible={true}
            accessibilityLabel={`Couverture de ${title}`}
          />
        )}
        <View style={styles.resultInfo}>
          <Text
            style={styles.resultTitle}
            numberOfLines={2}
            ellipsizeMode="tail"
            allowFontScaling={false}
          >
            {title}
          </Text>
          <Text
            style={styles.resultAuthor}
            numberOfLines={1}
            ellipsizeMode="tail"
            allowFontScaling={false}
          >
            {author}
          </Text>
          {bookData.publisher && (
            <Text
              style={styles.resultPublisher}
              numberOfLines={1}
              ellipsizeMode="tail"
              allowFontScaling={false}
            >
              {bookData.publisher} {bookData.publishedDate ? `(${bookData.publishedDate.substring(0, 4)})` : ''}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    form: {
      padding: spacing.base,
    },
    searchSection: {
      backgroundColor: theme.card.background,
      padding: spacing.base,
      borderRadius: borderRadius.base,
      marginBottom: spacing.base,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    sectionTitle: {
      fontSize: fontSizes.lg,
      fontWeight: '700',
      color: theme.text.primary,
      marginBottom: spacing.base,
    },
    sectionSubtitle: {
      fontSize: fontSizes.base,
      color: theme.text.secondary,
      marginBottom: spacing.base,
    },
    searchModeTabs: {
      flexDirection: 'row',
      marginBottom: spacing.base,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.md,
      padding: spacing.xs,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: borderRadius.sm,
    },
    tabActive: {
      backgroundColor: theme.primary,
    },
    tabText: {
      fontSize: fontSizes.base,
      fontWeight: '600',
      color: theme.text.secondary,
    },
    tabTextActive: {
      color: theme.button.text,
    },
    searchInputContainer: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    searchInput: {
      flex: 1,
      backgroundColor: theme.surface,
      padding: spacing.base,
      borderRadius: borderRadius.md,
      fontSize: fontSizes.md,
      borderWidth: 1,
      borderColor: theme.card.border,
      color: theme.text.primary,
    },
    searchInputFull: {
      flex: 1,
      backgroundColor: theme.surface,
      padding: spacing.base,
      borderRadius: borderRadius.md,
      fontSize: fontSizes.md,
      borderWidth: 1,
      borderColor: theme.card.border,
      color: theme.text.primary,
    },
    scanButton: {
      backgroundColor: theme.accent,
      paddingHorizontal: spacing.base,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanButtonText: {
      fontSize: iconSizes.base,
    },
    searchButton: {
      backgroundColor: theme.primary,
      padding: spacing.base,
      borderRadius: borderRadius.md,
      alignItems: 'center',
    },
    searchButtonDisabled: {
      backgroundColor: theme.tag.background,
    },
    searchButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.base,
      fontWeight: '600',
    },
    resultsSection: {
      marginBottom: spacing.base,
    },
    resultsTitle: {
      fontSize: fontSizes.md,
      fontWeight: '700',
      color: theme.text.primary,
      marginBottom: spacing.xs,
    },
    resultsSubtitle: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
      marginBottom: spacing.base,
    },
    searchResultCard: {
      backgroundColor: theme.card.background,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      gap: spacing.md,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    resultThumbnail: {
      width: 60,
      height: 85,
      borderRadius: borderRadius.sm,
      backgroundColor: theme.surface,
    },
    resultInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    resultTitle: {
      fontSize: fontSizes.base,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: spacing.xs,
    },
    resultAuthor: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
      marginBottom: spacing.xs,
    },
    resultPublisher: {
      fontSize: fontSizes.xs,
      color: theme.text.tertiary,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.xl,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.divider,
    },
    dividerText: {
      marginHorizontal: spacing.base,
      color: theme.text.secondary,
      fontSize: fontSizes.base,
    },
    coverSection: {
      marginBottom: spacing.base,
      alignItems: 'center',
    },
    coverPreviewContainer: {
      position: 'relative',
      marginBottom: spacing.sm,
    },
    coverPreview: {
      width: 120,
      height: 170,
      borderRadius: borderRadius.md,
      backgroundColor: theme.surface,
    },
    removeCoverButton: {
      position: 'absolute',
      top: -10,
      right: -10,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.error,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeCoverText: {
      color: '#fff',
      fontSize: fontSizes.lg,
      fontWeight: 'bold',
    },
    noCoverPlaceholder: {
      width: 120,
      height: 170,
      backgroundColor: theme.primary,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    noCoverText: {
      fontSize: 48,
      marginBottom: spacing.xs,
    },
    noCoverSubtext: {
      color: theme.button.text,
      fontSize: fontSizes.xs,
    },
    addCoverButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },
    addCoverButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.base,
      fontWeight: '600',
    },
    label: {
      fontSize: fontSizes.md,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: spacing.xs,
      marginTop: spacing.base,
    },
    input: {
      backgroundColor: theme.surface,
      padding: spacing.base,
      borderRadius: borderRadius.md,
      fontSize: fontSizes.md,
      borderWidth: 1,
      borderColor: theme.card.border,
      color: theme.text.primary,
    },
    saveButton: {
      backgroundColor: theme.primary,
      padding: spacing.lg,
      borderRadius: borderRadius.base,
      alignItems: 'center',
      marginTop: spacing.xxl,
    },
    saveButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.md,
      fontWeight: '600',
    },
    scannerContainer: {
      flex: 1,
      backgroundColor: '#000',
    },
    scannerOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    scannerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.base,
      paddingTop: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    scannerTitle: {
      color: '#fff',
      fontSize: fontSizes.lg,
      fontWeight: '600',
    },
    closeScannerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeScannerButtonText: {
      color: '#fff',
      fontSize: iconSizes.base,
      fontWeight: 'bold',
    },
    scannerFrame: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scannerCorner: {
      width: 250,
      height: 150,
      borderWidth: 3,
      borderColor: theme.primary,
      borderRadius: borderRadius.md,
    },
    scannerInstruction: {
      color: '#fff',
      fontSize: fontSizes.md,
      textAlign: 'center',
      padding: spacing.base,
      paddingBottom: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.base,
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.base,
      padding: spacing.base,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: fontSizes.xl,
      fontWeight: 'bold',
      color: theme.text.primary,
      marginBottom: spacing.base,
      textAlign: 'center',
    },
    modalOption: {
      backgroundColor: theme.card.background,
      padding: spacing.base,
      borderRadius: borderRadius.md,
      marginBottom: spacing.sm,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    modalOptionText: {
      fontSize: fontSizes.md,
      color: theme.text.primary,
      fontWeight: '500',
    },
    modalCancelButton: {
      backgroundColor: theme.card.background,
      padding: spacing.base,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginTop: spacing.sm,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    modalCancelText: {
      fontSize: fontSizes.md,
      color: theme.text.secondary,
      fontWeight: '600',
    },
    suggestButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
      marginBottom: spacing.xs,
    },
    suggestButtonText: {
      color: theme.button.text,
      fontSize: fontSizes.sm,
      fontWeight: '600',
    },
    suggestionsScroll: {
      maxHeight: 400,
      width: '100%',
    },
    suggestionCard: {
      backgroundColor: theme.card.background,
      borderRadius: borderRadius.md,
      padding: spacing.base,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: theme.card.border,
    },
    suggestionCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    suggestionCardTitle: {
      fontSize: fontSizes.md,
      fontWeight: '600',
      color: theme.text.primary,
      flex: 1,
    },
    confidenceBadgeSmall: {
      backgroundColor: theme.primary + '20',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    confidenceText: {
      fontSize: fontSizes.xs,
      fontWeight: '600',
      color: theme.primary,
    },
    suggestionCardReason: {
      fontSize: fontSizes.sm,
      color: theme.text.secondary,
    },
  }), [theme]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {!isEditing && (
          <View style={styles.searchSection}>
            <Text
              style={styles.sectionTitle}
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              🔍 Rechercher un livre
            </Text>

            <View style={styles.searchModeTabs}>
              <TouchableOpacity
                style={[styles.tab, searchMode === 'isbn' && styles.tabActive]}
                onPress={() => {
                  setSearchMode('isbn');
                  setSearchResults([]);
                }}
                accessibilityRole="button"
                accessibilityLabel="Rechercher par ISBN"
                accessibilityState={{ selected: searchMode === 'isbn' }}
              >
                <Text
                  style={[styles.tabText, searchMode === 'isbn' && styles.tabTextActive]}
                  allowFontScaling={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  ISBN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, searchMode === 'title' && styles.tabActive]}
                onPress={() => {
                  setSearchMode('title');
                  setSearchResults([]);
                }}
                accessibilityRole="button"
                accessibilityLabel="Rechercher par titre"
                accessibilityState={{ selected: searchMode === 'title' }}
              >
                <Text
                  style={[styles.tabText, searchMode === 'title' && styles.tabTextActive]}
                  allowFontScaling={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Titre
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, searchMode === 'author' && styles.tabActive]}
                onPress={() => {
                  setSearchMode('author');
                  setSearchResults([]);
                }}
                accessibilityRole="button"
                accessibilityLabel="Rechercher par auteur"
                accessibilityState={{ selected: searchMode === 'author' }}
              >
                <Text
                  style={[styles.tabText, searchMode === 'author' && styles.tabTextActive]}
                  allowFontScaling={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Auteur
                </Text>
              </TouchableOpacity>
            </View>

            {searchMode === 'isbn' ? (
              <>
                <Text
                  style={styles.sectionSubtitle}
                  allowFontScaling={false}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  Entrez l'ISBN ou scannez le code-barre du livre
                </Text>
                <View style={styles.searchInputContainer}>
                  <TextInput
                    style={styles.searchInput}
                    value={isbn}
                    onChangeText={setIsbn}
                    placeholder="978-2-xxxxx-xxx-x"
                    placeholderTextColor={theme.text.tertiary}
                    keyboardType="numeric"
                    accessibilityLabel="Champ de saisie ISBN"
                    accessibilityHint="Entrez le code ISBN du livre"
                    allowFontScaling={false}
                  />
                  <TouchableOpacity
                    style={styles.scanButton}
                    onPress={openScanner}
                    accessibilityRole="button"
                    accessibilityLabel="Scanner le code-barre"
                    accessibilityHint="Ouvrir la caméra pour scanner le code-barre ISBN"
                  >
                    <Text
                      style={styles.scanButtonText}
                      allowFontScaling={false}
                    >
                      📷
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
                  onPress={searchByISBN}
                  disabled={isSearching}
                  accessibilityRole="button"
                  accessibilityLabel="Rechercher par ISBN"
                  accessibilityHint="Lancer la recherche du livre avec l'ISBN saisi"
                  accessibilityState={{ disabled: isSearching }}
                >
                  {isSearching ? (
                    <ActivityIndicator color={theme.button.text} />
                  ) : (
                    <Text
                      style={styles.searchButtonText}
                      allowFontScaling={false}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Rechercher par ISBN
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : searchMode === 'title' ? (
              <>
                <Text
                  style={styles.sectionSubtitle}
                  allowFontScaling={false}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Entrez le titre du livre de cuisine
                </Text>
                <View style={styles.searchInputContainer}>
                  <TextInput
                    style={styles.searchInputFull}
                    value={searchTitle}
                    onChangeText={setSearchTitle}
                    placeholder="Ex: La cuisine de référence"
                    placeholderTextColor={theme.text.tertiary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="Champ de saisie du titre"
                    accessibilityHint="Entrez le titre du livre à rechercher"
                    allowFontScaling={false}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
                  onPress={searchByTitle}
                  disabled={isSearching}
                  accessibilityRole="button"
                  accessibilityLabel="Rechercher par titre"
                  accessibilityHint="Lancer la recherche du livre avec le titre saisi"
                  accessibilityState={{ disabled: isSearching }}
                >
                  {isSearching ? (
                    <ActivityIndicator color={theme.button.text} />
                  ) : (
                    <Text
                      style={styles.searchButtonText}
                      allowFontScaling={false}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Rechercher par titre
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text
                  style={styles.sectionSubtitle}
                  allowFontScaling={false}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  Entrez le nom de l'auteur (ex: Yotam Ottolenghi, Jamie Oliver)
                </Text>
                <View style={styles.searchInputContainer}>
                  <TextInput
                    style={styles.searchInputFull}
                    value={searchAuthor}
                    onChangeText={setSearchAuthor}
                    placeholder="Ex: Philippe Etchebest"
                    placeholderTextColor={theme.text.tertiary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessibilityLabel="Champ de saisie de l'auteur"
                    accessibilityHint="Entrez le nom de l'auteur à rechercher"
                    allowFontScaling={false}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
                  onPress={searchByAuthor}
                  disabled={isSearching}
                  accessibilityRole="button"
                  accessibilityLabel="Rechercher par auteur"
                  accessibilityHint="Lancer la recherche du livre avec l'auteur saisi"
                  accessibilityState={{ disabled: isSearching }}
                >
                  {isSearching ? (
                    <ActivityIndicator color={theme.button.text} />
                  ) : (
                    <Text
                      style={styles.searchButtonText}
                      allowFontScaling={false}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      Rechercher par auteur
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {searchResults.length > 0 && (
          <View style={styles.resultsSection}>
            <Text
              style={styles.resultsTitle}
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Résultats ({searchResults.length})
            </Text>
            <Text
              style={styles.resultsSubtitle}
              allowFontScaling={false}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Appuyez sur un livre pour remplir le formulaire
            </Text>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text
            style={styles.dividerText}
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {isEditing ? 'Modifier le livre' : 'Informations du livre'}
          </Text>
          <View style={styles.dividerLine} />
        </View>

        <Text
          style={styles.label}
          allowFontScaling={false}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Couverture
        </Text>
        <View style={styles.coverSection}>
          {coverImage ? (
            <View style={styles.coverPreviewContainer}>
              <Image
                source={{ uri: coverImage }}
                style={styles.coverPreview}
                accessible={true}
                accessibilityLabel="Aperçu de la couverture du livre"
              />
              <TouchableOpacity
                style={styles.removeCoverButton}
                onPress={() => setCoverImage('')}
                accessibilityRole="button"
                accessibilityLabel="Retirer la couverture"
                accessibilityHint="Supprime l'image de couverture actuelle"
              >
                <Text
                  style={styles.removeCoverText}
                  allowFontScaling={false}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noCoverPlaceholder}>
              <Text
                style={styles.noCoverText}
                allowFontScaling={false}
              >
                📚
              </Text>
              <Text
                style={styles.noCoverSubtext}
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Aucune couverture
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.addCoverButton}
            onPress={() => setShowCoverOptions(true)}
            accessibilityRole="button"
            accessibilityLabel={coverImage ? 'Changer la couverture' : 'Ajouter une couverture'}
            accessibilityHint="Ouvre les options pour ajouter ou changer la couverture"
          >
            <Text
              style={styles.addCoverButtonText}
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {coverImage ? 'Changer la couverture' : 'Ajouter une couverture'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={styles.label}
          allowFontScaling={false}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Titre *
        </Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Titre du livre"
          placeholderTextColor={theme.text.tertiary}
          autoCapitalize="words"
          accessibilityLabel="Champ de saisie du titre"
          accessibilityHint="Entrez le titre du livre (obligatoire)"
          allowFontScaling={false}
        />

        <Text
          style={styles.label}
          allowFontScaling={false}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Auteur *
        </Text>
        <TextInput
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
          placeholder="Nom de l'auteur"
          placeholderTextColor={theme.text.tertiary}
          autoCapitalize="words"
          accessibilityLabel="Champ de saisie de l'auteur"
          accessibilityHint="Entrez le nom de l'auteur (obligatoire)"
          allowFontScaling={false}
        />

        <Text
          style={styles.label}
          allowFontScaling={false}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Pseudonyme
        </Text>
        <TextInput
          style={styles.input}
          value={pseudonym}
          onChangeText={setPseudonym}
          placeholder="Ex: Gastronogeek, Chef Damien..."
          placeholderTextColor={theme.text.tertiary}
          autoCapitalize="words"
          accessibilityLabel="Champ de saisie du pseudonyme"
          accessibilityHint="Entrez le pseudonyme de l'auteur (optionnel)"
          allowFontScaling={false}
        />

        <Text
          style={styles.label}
          allowFontScaling={false}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Éditeur
        </Text>
        <TextInput
          style={styles.input}
          value={editor}
          onChangeText={setEditor}
          placeholder="Maison d'édition"
          placeholderTextColor={theme.text.tertiary}
          autoCapitalize="words"
          accessibilityLabel="Champ de saisie de l'éditeur"
          accessibilityHint="Entrez la maison d'édition (optionnel)"
          allowFontScaling={false}
        />

        <Text
          style={styles.label}
          allowFontScaling={false}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Année
        </Text>
        <TextInput
          style={styles.input}
          value={year}
          onChangeText={setYear}
          placeholder="2024"
          placeholderTextColor={theme.text.tertiary}
          keyboardType="numeric"
          accessibilityLabel="Champ de saisie de l'année"
          accessibilityHint="Entrez l'année de publication (optionnel)"
          allowFontScaling={false}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text
            style={styles.label}
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Catégorie
          </Text>
          {title.trim() && author.trim() && (
            <TouchableOpacity
              onPress={handleShowSuggestions}
              style={styles.suggestButton}
              accessibilityRole="button"
              accessibilityLabel="Suggérer une catégorie"
              accessibilityHint="Ouvre la liste des catégories suggérées pour ce livre"
            >
              <Text
                style={styles.suggestButtonText}
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                ✨ Suggérer
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Cuisine du monde, Pâtisserie..."
          placeholderTextColor={theme.text.tertiary}
          autoCapitalize="sentences"
          accessibilityLabel="Champ de saisie de la catégorie"
          accessibilityHint="Entrez la catégorie du livre (optionnel)"
          allowFontScaling={false}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel={isEditing ? 'Mettre à jour le livre' : 'Enregistrer le livre'}
          accessibilityHint={isEditing ? 'Enregistrer les modifications du livre' : 'Ajouter le livre à la collection'}
        >
          <Text
            style={styles.saveButtonText}
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8'],
            }}
            onBarcodeScanned={handleBarcodeScanned}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerHeader}>
              <Text
                style={styles.scannerTitle}
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Scanner le code-barre ISBN
              </Text>
              <TouchableOpacity
                style={styles.closeScannerButton}
                onPress={() => setShowScanner(false)}
                accessibilityRole="button"
                accessibilityLabel="Fermer le scanner"
                accessibilityHint="Ferme le scanner de code-barre"
              >
                <Text
                  style={styles.closeScannerButtonText}
                  allowFontScaling={false}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.scannerFrame}>
              <View style={styles.scannerCorner} />
            </View>
            <Text
              style={styles.scannerInstruction}
              allowFontScaling={false}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Placez le code-barre dans le cadre
            </Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCoverOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCoverOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCoverOptions(false)}
          accessibilityRole="button"
          accessibilityLabel="Fermer le menu"
        >
          <View style={styles.modalContent}>
            <Text
              style={styles.modalTitle}
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Ajouter une couverture
            </Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={pickImage}
              accessibilityRole="button"
              accessibilityLabel="Choisir depuis la galerie"
              accessibilityHint="Ouvre la galerie pour sélectionner une image"
            >
              <Text
                style={styles.modalOptionText}
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                📁 Choisir depuis la galerie
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={addCoverUrl}
              accessibilityRole="button"
              accessibilityLabel="Entrer une URL"
              accessibilityHint="Saisir l'URL d'une image de couverture"
            >
              <Text
                style={styles.modalOptionText}
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                🔗 Entrer une URL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowCoverOptions(false)}
              accessibilityRole="button"
              accessibilityLabel="Annuler"
              accessibilityHint="Ferme le menu sans ajouter de couverture"
            >
              <Text
                style={styles.modalCancelText}
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Annuler
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showCategorySuggestions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategorySuggestions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategorySuggestions(false)}
          accessibilityRole="button"
          accessibilityLabel="Fermer les suggestions"
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text
              style={styles.modalTitle}
              allowFontScaling={false}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              ✨ Suggestions de catégorie
            </Text>
            <ScrollView style={styles.suggestionsScroll}>
              {getSuggestions().map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionCard}
                  onPress={() => handleSuggestionSelect(suggestion.category)}
                  accessibilityRole="button"
                  accessibilityLabel={`Sélectionner la catégorie ${suggestion.category}, confiance ${Math.round(suggestion.confidence * 100)} pourcent`}
                  accessibilityHint={suggestion.reason}
                >
                  <View style={styles.suggestionCardHeader}>
                    <Text
                      style={styles.suggestionCardTitle}
                      allowFontScaling={false}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {suggestion.category}
                    </Text>
                    <View style={styles.confidenceBadgeSmall}>
                      <Text
                        style={styles.confidenceText}
                        allowFontScaling={false}
                        numberOfLines={1}
                      >
                        {Math.round(suggestion.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={styles.suggestionCardReason}
                    allowFontScaling={false}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {suggestion.reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowCategorySuggestions(false)}
              accessibilityRole="button"
              accessibilityLabel="Annuler"
              accessibilityHint="Ferme les suggestions sans sélectionner de catégorie"
            >
              <Text
                style={styles.modalCancelText}
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Annuler
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}
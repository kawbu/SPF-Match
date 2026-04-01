import React, { useState } from 'react'
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import type { SunscreenProduct } from '../../types/index'

interface SunscreenCardProps {
  product: SunscreenProduct
  index: number
}

export function SunscreenCard({ product, index }: SunscreenCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleBuyPress = () => {
    if (product.link) {
      Linking.openURL(product.link)
    }
  }

  return (
    <View style={styles.card}>
      {/* Header row: index + name */}
      <View style={styles.header}>
        <View style={styles.indexBadge}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
      </View>

      {/* Product image */}
      {product.image && !imageError ? (
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}

      {/* Tags row */}
      <View style={styles.tagsRow}>
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>SPF</Text>
          <Text style={styles.tagValue}>{product.spf}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>Filter</Text>
          <Text style={styles.tagValue}>{product.filterType}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>Tint</Text>
          <Text style={styles.tagValue}>{product.tint}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>Form</Text>
          <Text style={styles.tagValue} numberOfLines={1}>
            {product.vehicle}
          </Text>
        </View>
      </View>

      {/* Price row */}
      <View style={styles.priceRow}>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>${product.price.toFixed(2)}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Size</Text>
          <Text style={styles.priceValue}>{product.size} fl oz</Text>
        </View>
        {product.unitPrice != null && (
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Per fl oz</Text>
            <Text style={styles.priceValue}>${product.unitPrice.toFixed(2)}</Text>
          </View>
        )}
      </View>

      {/* Skin type badges */}
      {product.skinTypes && product.skinTypes.length > 0 && (
        <View style={styles.skinTypesRow}>
          <Text style={styles.skinTypesLabel}>Works for: </Text>
          {product.skinTypes.map((type) => (
            <View key={type} style={styles.skinTypeBadge}>
              <Text style={styles.skinTypeBadgeText}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Purchase button */}
      {product.link ? (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buyButton}
          onPress={handleBuyPress}
        >
          <Text style={styles.buyButtonText}>View & Purchase →</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  indexBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  indexText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  imagePlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    minWidth: 60,
  },
  tagLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tagValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceItem: {
    gap: 2,
  },
  priceLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '500',
  },
  priceValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  skinTypesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  skinTypesLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '500',
  },
  skinTypeBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  skinTypeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  buyButton: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
})

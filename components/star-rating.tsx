import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface StarRatingProps {
  question: string;
  maxStars?: number;
  selectedRating?: number;
  onRate?: (rating: number) => void;
}

export function StarRating({
  question,
  maxStars = 5,
  selectedRating,
  onRate,
}: StarRatingProps) {
  const [localRating, setLocalRating] = useState<number | undefined>(
    selectedRating,
  );

  const rating = selectedRating ?? localRating;
  const isAnswered = rating !== undefined;

  function handlePress(star: number) {
    if (isAnswered) return;
    setLocalRating(star);
    onRate?.(star);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.starsRow}>
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
          <Pressable
            key={star}
            onPress={() => handlePress(star)}
            disabled={isAnswered}
            style={styles.starButton}
          >
            <Text
              style={[
                styles.star,
                rating !== undefined && star <= rating && styles.starFilled,
                isAnswered &&
                  rating !== undefined &&
                  star > rating &&
                  styles.starDimmed,
              ]}
            >
              ★
            </Text>
          </Pressable>
        ))}
      </View>
      {isAnswered && (
        <Text style={styles.ratingLabel}>
          {rating} / {maxStars}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  question: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 32,
    color: "#d0d0d0",
  },
  starFilled: {
    color: "#f59e0b",
  },
  starDimmed: {
    opacity: 0.3,
  },
  ratingLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
});

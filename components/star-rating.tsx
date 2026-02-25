import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTamboComponentState } from "@tambo-ai/react";

interface StarRatingProps {
  question: string;
  maxStars?: number;
}

export function StarRating({ question, maxStars = 5 }: StarRatingProps) {
  const [rating, setRating] = useTamboComponentState<number | null>(
    "rating",
    null,
  );

  const hasRating = rating != null;

  function handlePress(star: number) {
    setRating(star);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.starsRow}>
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
          <Pressable
            key={star}
            onPress={() => handlePress(star)}
            style={styles.starButton}
          >
            <Text
              style={[
                styles.star,
                hasRating && star <= rating && styles.starFilled,
                hasRating && star > rating && styles.starDimmed,
              ]}
            >
              ★
            </Text>
          </Pressable>
        ))}
      </View>
      {hasRating && (
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

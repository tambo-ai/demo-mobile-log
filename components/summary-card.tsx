import { View, Text, StyleSheet } from "react-native";

interface SummaryCardProps {
  title: string;
  entries: { label: string; value: string }[];
}

export function SummaryCard({ title, entries }: SummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {entries?.map((entry, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.label}>{entry.label}</Text>
          <Text style={styles.value}>{entry.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    flexShrink: 0,
  },
  value: {
    fontSize: 14,
    color: "#1a1a1a",
    textAlign: "right",
    flexShrink: 1,
  },
});

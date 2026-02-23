import { useEffect } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useTambo } from "@tambo-ai/react";
import { LogEntry } from "../../components/log-entry";
import { InputBar } from "../../components/input-bar";

export default function LogScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages, switchThread, startNewThread } = useTambo();
  const navigation = useNavigation();

  // Start a new thread or switch to an existing one.
  // We listen to the navigation focus event so that navigating to /log/new
  // a second time still triggers startNewThread (the route params don't change).
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (id === "new") {
        startNewThread();
      } else if (id) {
        switchThread(id);
      }
    });
    return unsubscribe;
  }, [id, navigation, switchThread, startNewThread]);

  // Filter out system messages and reverse so newest is first (inverted FlatList)
  const displayMessages = messages
    .filter((m) => m.role !== "system")
    .toReversed();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={displayMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LogEntry message={item} />}
        inverted
        contentContainerStyle={styles.messageList}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 100,
        }}
      />
      <InputBar />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messageList: {
    paddingVertical: 8,
  },
});

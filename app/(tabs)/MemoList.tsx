import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Memo } from "../types/types"; // Memo 타입 정의를 가져옵니다.
import { getMemos } from "../utils/db"; // getMemos 함수를 가져옵니다.

export default function MemoList() {
  const [memos, setMemos] = useState<Memo[]>([]); // 메모 목록을 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  /**
   * DB에서 메모 목록을 불러오는 함수
   */
  const loadMemos = async () => {
    setLoading(true); // 로딩 시작
    try {
      const fetchedMemos = await getMemos();
      setMemos(fetchedMemos); // 불러온 메모를 상태에 저장
    } catch (error) {
      console.error("Failed to load memos:", error);
      // 사용자에게 오류 메시지 표시 가능
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 컴포넌트가 마운트될 때 메모를 불러옵니다.
  useEffect(() => {
    loadMemos();
  }, []);

  /**
   * FlatList의 각 항목을 렌더링하는 함수
   */
  const renderItem = ({ item }: { item: Memo }) => (
    <View style={styles.memoItem}>
      <Text style={styles.title}>{item.title}</Text>
      {/* ISO 날짜 문자열을 읽기 쉬운 형식으로 변환 */}
      <Text style={styles.date}>
        {new Date(item?.date ?? "").toLocaleDateString("ko-KR")}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>메모 불러오는 중...</Text>
      </View>
    );
  }

  if (memos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>저장된 메모가 없습니다.</Text>
        <Text style={styles.emptyText}>새 메모를 작성해 보세요.</Text>
      </View>
    );
  }

  // FlatList는 큰 목록을 효율적으로 렌더링하는 데 사용됩니다.
  return (
    <FlatList
      data={memos}
      renderItem={renderItem}
      keyExtractor={(item) => item?.id?.toString() ?? "0"}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    backgroundColor: "#F0F0F7", // 배경색
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    marginBottom: 5,
  },
  memoItem: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000", // 그림자 효과 (iOS)
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // 그림자 효과 (Android)
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
});

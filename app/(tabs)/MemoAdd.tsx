import { useLocalSearchParams, useRouter } from "expo-router"; // useLocalSearchParams 추가
import { useEffect, useState } from "react"; // useEffect 추가
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// getMemoById, updateMemo 함수를 db.ts에서 가져옵니다.
import { addMemo, getMemoById, updateMemo } from "../utils/db";

export default function MemoAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  // 쿼리 파라미터(id)를 가져옵니다.
  // id가 문자열로 넘어오므로 Number()로 변환합니다.
  const { id: memoIdParam } = useLocalSearchParams();
  const memoId = Number(memoIdParam) ?? 0; // id가 없거나 유효하지 않으면 0으로 처리

  /**
   * 폼 초기 데이터 로딩 (수정 모드일 때)
   */
  useEffect(() => {
    if (memoId) {
      const loadMemo = async () => {
        try {
          const memo = await getMemoById(memoId);
          if (memo) {
            setTitle(memo?.title ?? "");
            setContent(memo?.content ?? "");
          } else {
            // ID가 있는데 메모를 찾을 수 없을 때
            Alert.alert("오류", "해당 메모를 찾을 수 없습니다.");
            router.replace("/MemoList");
          }
        } catch (error: any) {
          console.error("Failed to load memo for editing:", error);
          Alert.alert("오류", "메모를 불러오는 중 문제가 발생했습니다.");
        }
      };
      loadMemo();
    }
  }, [memoId]); // ID가 변경될 때마다 실행

  /**
   * 메모 저장/수정 통합 로직
   */
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("경고", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      if (memoId) {
        // --- 수정 모드 ---
        await updateMemo(memoId, title, content);
        Alert.alert("수정 완료", "메모가 성공적으로 수정되었습니다.");
      } else {
        // --- 작성 모드 ---
        await addMemo(title, content);
        Alert.alert("저장 완료", "새로운 메모가 성공적으로 저장되었습니다.");
      }

      // 저장 또는 수정 후 목록 화면으로 이동
      router.replace("/MemoList");
    } catch (error: any) {
      console.error(`Failed to ${memoId ? "update" : "add"} memo:`, error);
      Alert.alert(
        "오류",
        `${memoId ? "수정" : "저장"} 중 문제가 발생했습니다.`
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>
          {memoId ? "메모 수정" : "새 메모 작성"}
        </Text>

        <Text style={styles.label}>제목:</Text>
        <TextInput
          style={styles.input}
          placeholder="메모의 제목을 입력하세요."
          value={title}
          onChangeText={setTitle}
          numberOfLines={1}
        />

        <Text style={styles.label}>내용:</Text>
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="메모의 내용을 입력하세요."
          value={content}
          onChangeText={setContent}
          multiline={true}
          textAlignVertical="top"
        />

        <View style={styles.buttonContainer}>
          <Button
            title={memoId ? "수정하기" : "저장하기"}
            onPress={handleSave}
            color="#007AFF"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F8F8",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#333",
  },
  // ... (나머지 스타일은 동일)
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FFF",
    fontSize: 16,
  },
  contentInput: {
    height: 150,
  },
  buttonContainer: {
    marginTop: 30,
  },
});

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { addMemo } from "../utils/db"; // db.ts 파일에서 addMemo 함수를 가져옵니다.

export default function MemoAdd() {
  const [title, setTitle] = useState(""); // 제목 입력을 위한 상태
  const [content, setContent] = useState(""); // 내용 입력을 위한 상태
  const router = useRouter();

  /**
   * 메모 저장 로직
   */
  const handleSave = async () => {
    // 제목과 내용 중 하나라도 비어 있으면 저장하지 않습니다.
    if (!title.trim() || !content.trim()) {
      Alert.alert("경고", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const insertedId = await addMemo(title, content);
      console.log("Memo added with ID:", insertedId);

      // 저장 성공 메시지 표시
      Alert.alert("저장 완료", "새로운 메모가 성공적으로 저장되었습니다.");

      // 입력 필드 초기화
      setTitle("");
      setContent("");

      // 실제 앱에서는 여기서 메모 목록 화면으로 이동하거나 목록을 새로고침합니다.
      // (지금은 단순하게 입력 필드만 초기화).
      router.replace("/MemoList");
    } catch (error) {
      console.error("Failed to add memo:", error);
      Alert.alert("오류", "메모 저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>제목:</Text>
      <TextInput
        style={styles.input}
        placeholder="메모의 제목을 입력하세요."
        value={title}
        onChangeText={setTitle}
        // 제목은 한 줄만 입력
        numberOfLines={1}
      />

      <Text style={styles.label}>내용:</Text>
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="메모의 내용을 입력하세요."
        value={content}
        onChangeText={setContent}
        // 내용은 여러 줄 입력 가능하도록 설정
        multiline={true}
        textAlignVertical="top" // 안드로이드에서 텍스트가 상단부터 시작하도록 설정
      />

      <View style={styles.buttonContainer}>
        <Button title="저장하기" onPress={handleSave} color="#007AFF" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // ScrollView의 내용 영역 전체에 padding을 줍니다.
    padding: 20,
    backgroundColor: "#F8F8F8", // 배경색 추가
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FFF", // 입력 필드 배경색
    fontSize: 16,
  },
  contentInput: {
    height: 150, // 내용 입력 필드는 높이를 더 줍니다.
    // iOS의 경우 multiline={true}이면 기본적으로 textAlignVertical이 top으로 설정됩니다.
  },
  buttonContainer: {
    marginTop: 30,
    // 버튼을 감싸는 View에 너비를 지정하여 버튼의 크기를 조절할 수 있습니다.
    // 여기서는 전체 너비를 사용합니다.
  },
});

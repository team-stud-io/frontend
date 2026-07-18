import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'stud.io.aiTutor.activeSessionId';

export const tutorSessionStore = {
  async save(sessionId: number) {
    await AsyncStorage.setItem(STORAGE_KEY, String(sessionId));
  },
  async load() {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    const sessionId = Number(value);
    return Number.isFinite(sessionId) && sessionId > 0 ? sessionId : null;
  },
};

export interface LessonItem {
  char: string;
  pinyin: string;
  text: string;
}

export interface LessonsData {
  [key: number]: LessonItem[];
}

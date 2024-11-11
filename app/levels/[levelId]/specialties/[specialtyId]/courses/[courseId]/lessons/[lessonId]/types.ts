export interface LessonImage {
    id: string;
    url: string;
    key: string;
    filename: string;
    lessonId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ImageUploaderProps {
    lessonId: string;
    levelId: string;
    specialtyId: string;
    courseId: string;
    chapterId: string;
    initialImages: LessonImage[];
  }
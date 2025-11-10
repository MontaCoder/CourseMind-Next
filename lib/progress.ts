/**
 * Progress calculation utilities
 */

interface Topic {
  id: string;
  completed: boolean;
}

interface Chapter {
  id: string;
  topics: Topic[];
}

/**
 * Calculate progress percentage for a single chapter
 */
export function calculateChapterProgress(topics: Topic[]): number {
  if (!topics || topics.length === 0) return 0;

  const completedCount = topics.filter(t => t.completed).length;
  return Math.round((completedCount / topics.length) * 100);
}

/**
 * Calculate overall course progress
 */
export function calculateCourseProgress(chapters: Chapter[]): number {
  if (!chapters || chapters.length === 0) return 0;

  let totalTopics = 0;
  let completedTopics = 0;

  chapters.forEach(chapter => {
    if (chapter.topics) {
      totalTopics += chapter.topics.length;
      completedTopics += chapter.topics.filter(t => t.completed).length;
    }
  });

  return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
}

/**
 * Get progress statistics for a course
 */
export function getCourseStatistics(chapters: Chapter[]) {
  let totalTopics = 0;
  let completedTopics = 0;
  let totalChapters = chapters.length;
  let completedChapters = 0;

  const chapterStats = chapters.map(chapter => {
    const topicCount = chapter.topics?.length || 0;
    const completedCount = chapter.topics?.filter(t => t.completed).length || 0;
    const progress = topicCount > 0 ? Math.round((completedCount / topicCount) * 100) : 0;

    totalTopics += topicCount;
    completedTopics += completedCount;

    if (progress === 100) {
      completedChapters++;
    }

    return {
      chapterId: chapter.id,
      totalTopics: topicCount,
      completedTopics: completedCount,
      progress,
      isCompleted: progress === 100,
    };
  });

  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return {
    overallProgress,
    totalChapters,
    completedChapters,
    totalTopics,
    completedTopics,
    chapterStats,
  };
}

/**
 * Get achievement badges based on progress
 */
export function getAchievementBadges(progress: number, completedTopics: number) {
  const badges = [];

  if (progress >= 25) {
    badges.push({
      id: 'beginner',
      name: 'Getting Started',
      description: 'Completed 25% of the course',
      icon: '🌱',
    });
  }

  if (progress >= 50) {
    badges.push({
      id: 'halfway',
      name: 'Halfway There',
      description: 'Completed 50% of the course',
      icon: '🔥',
    });
  }

  if (progress >= 75) {
    badges.push({
      id: 'almost',
      name: 'Almost Done',
      description: 'Completed 75% of the course',
      icon: '⭐',
    });
  }

  if (progress >= 100) {
    badges.push({
      id: 'graduate',
      name: 'Course Graduate',
      description: 'Completed 100% of the course',
      icon: '🎓',
    });
  }

  if (completedTopics >= 10) {
    badges.push({
      id: 'dedicated',
      name: 'Dedicated Learner',
      description: 'Completed 10 or more topics',
      icon: '📚',
    });
  }

  if (completedTopics >= 25) {
    badges.push({
      id: 'expert',
      name: 'Expert Student',
      description: 'Completed 25 or more topics',
      icon: '🏆',
    });
  }

  return badges;
}

/**
 * Get motivational message based on progress
 */
export function getMotivationalMessage(progress: number): string {
  if (progress === 0) {
    return "Let's start your learning journey!";
  } else if (progress < 25) {
    return "Great start! Keep up the momentum!";
  } else if (progress < 50) {
    return "You're making excellent progress!";
  } else if (progress < 75) {
    return "Halfway there! You're doing amazing!";
  } else if (progress < 100) {
    return "Almost done! Finish strong!";
  } else {
    return "Congratulations! You've completed this course!";
  }
}

import { Course } from '../types/course';

export const sampleCourse: Course = {
  id: '1',
  title: 'Advanced React Development',
  instructor: 'Sarah Johnson',
  description: 'Master advanced React concepts including hooks, context, performance optimization, and testing. Build production-ready applications with modern React patterns.',
  category: 'Web Development',
  level: 'Advanced',
  duration: 9835, // Total duration in seconds
  rating: 4.8,
  studentsEnrolled: 12847,
  certificate: true,
  currentLessonIndex: 0,
  totalProgress: 25,
  lastAccessed: new Date('2024-01-15'),
  lessons: [
    {
      id: '1',
      title: 'Introduction to React Hooks',
      duration: 1245, // 20:45
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      completed: true,
      description: 'Learn the fundamentals of React Hooks and how they revolutionize component state management.',
      resources: [
        {
          id: 'r1',
          title: 'React Hooks Cheat Sheet',
          type: 'pdf',
          url: '#',
          size: '2.3 MB'
        },
        {
          id: 'r2',
          title: 'Official React Hooks Documentation',
          type: 'link',
          url: 'https://reactjs.org/docs/hooks-intro.html'
        }
      ],
      quiz: {
        id: 'q1',
        title: 'React Hooks Basics',
        passingScore: 80,
        completed: true,
        score: 95,
        questions: [
          {
            id: 'q1-1',
            question: 'Which hook is used for managing component state?',
            type: 'multiple-choice',
            options: ['useState', 'useEffect', 'useContext', 'useReducer'],
            correctAnswer: 0,
            explanation: 'useState is the primary hook for managing local component state.'
          }
        ]
      }
    },
    {
      id: '2',
      title: 'useState and useEffect Deep Dive',
      duration: 1680, // 28:00
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      completed: true,
      description: 'Master the most commonly used hooks with practical examples and best practices.',
      resources: [
        {
          id: 'r3',
          title: 'useEffect Examples',
          type: 'code',
          url: '#'
        }
      ]
    },
    {
      id: '3',
      title: 'Custom Hooks and Performance',
      duration: 1950, // 32:30
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      completed: false,
      description: 'Create reusable custom hooks and optimize component performance.',
      resources: [
        {
          id: 'r4',
          title: 'Performance Optimization Guide',
          type: 'document',
          url: '#'
        }
      ],
      quiz: {
        id: 'q3',
        title: 'Custom Hooks Quiz',
        passingScore: 75,
        completed: false,
        questions: [
          {
            id: 'q3-1',
            question: 'Custom hooks must start with "use"',
            type: 'true-false',
            options: ['True', 'False'],
            correctAnswer: 0,
            explanation: 'Custom hooks must follow the naming convention starting with "use".'
          }
        ]
      }
    },
    {
      id: '4',
      title: 'Context API and Global State',
      duration: 2160, // 36:00
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      completed: false,
      description: 'Manage global application state using React Context API effectively.'
    },
    {
      id: '5',
      title: 'Testing React Components',
      duration: 1800, // 30:00
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      completed: false,
      description: 'Learn comprehensive testing strategies for React components using modern tools.'
    }
  ]
};
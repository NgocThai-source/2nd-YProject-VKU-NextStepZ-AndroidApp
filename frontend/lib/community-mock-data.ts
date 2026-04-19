// Mock data for Community Page
// Includes posts, users, topics, companies, mentors, Q&A questions, reviews, etc.

export type UserRole = 'user' | 'employer';
export type PostCategory = 'job-search' | 'experience' | 'discussion' | 'question' | 'offer' | 'opportunity';
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

// User Types
export interface CommunityUser {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  title?: string;
  company?: string;
  followers: number;
  following: number;
  isFollowing?: boolean;
  reputation?: number;
  verified?: boolean;
}

// Post Types
export interface Post {
  id: string;
  author: CommunityUser;
  content: string;
  category: PostCategory;
  topics?: string[];
  images: string[];
  hashtags: string[];
  timestamp: string;
  updatedAt?: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isSavedAsJob?: boolean;
}

// Comment Types
export interface Comment {
  id: string;
  author: CommunityUser;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLiked?: boolean;
  replyList?: Comment[];
}

// Topic Types
export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
  postsCount: number;
  followersCount: number;
  isFollowing?: boolean;
  trendingScore?: number;
}

// Question/QA Types
export interface Question {
  id: string;
  author: CommunityUser;
  title: string;
  content: string;
  tags: string[];
  timestamp: string;
  views: number;
  votes: number;
  answers: number;
  isAnswered: boolean;
  acceptedAnswerId?: string;
  isUpvoted?: boolean;
  comments?: Comment[];
}

export interface Answer {
  id: string;
  question: Question;
  author: CommunityUser;
  content: string;
  timestamp: string;
  votes: number;
  isAccepted: boolean;
  isUpvoted?: boolean;
}

// Company Review Types
export interface CompanyReview {
  id: string;
  company: Company;
  author: CommunityUser;
  rating: number; // 1-5
  title: string;
  content: string;
  ratings: {
    environment: number;
    professionalism: number;
    benefits: number;
    workLifeBalance: number;
    compensation: number;
  };
  timestamp: string;
  helpful: number;
  position?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: CompanySize;
  location: string;
  website?: string;
  averageRating?: number;
  totalReviews?: number;
}

// Leaderboard Types
export interface LeaderboardUser {
  rank: number;
  user: CommunityUser;
  score: number;
  posts: number;
  likes: number;
  followers: number;
  streak: number; // days
}

// Mock Users
export const mockUsers: CommunityUser[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    role: 'user',
    title: 'Frontend Developer',
    company: 'Tech Company Vietnam',
    followers: 324,
    following: 128,
    isFollowing: false,
    reputation: 245,
    verified: true,
  },
  {
    id: '2',
    name: 'Trần Thị B',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    role: 'employer',
    title: 'HR Manager',
    company: 'Google Vietnam',
    followers: 892,
    following: 340,
    isFollowing: false,
    verified: true,
  },
  {
    id: '3',
    name: 'Phạm Minh C',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Garrick',
    role: 'user',
    title: 'Senior Software Engineer',
    company: 'Microsoft',
    followers: 1240,
    following: 95,
    isFollowing: false,
    reputation: 892,
    verified: true,
  },
  {
    id: '4',
    name: 'Lý Quốc D',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    role: 'user',
    title: 'Product Manager',
    company: 'Meta',
    followers: 567,
    following: 234,
    isFollowing: false,
    reputation: 456,
    verified: true,
  },
  {
    id: '5',
    name: 'Hoàng Anh E',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
    role: 'user',
    title: 'UI/UX Designer',
    company: 'Freelance',
    followers: 234,
    following: 189,
    isFollowing: false,
    reputation: 123,
  },
  {
    id: '6',
    name: 'Đỗ Hải F',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harper',
    role: 'user',
    title: 'Backend Developer',
    company: 'Startup XYZ',
    followers: 456,
    following: 267,
    isFollowing: false,
    reputation: 334,
    verified: true,
  },
  {
    id: '7',
    name: 'Vũ Hương G',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Avery',
    role: 'user',
    title: 'Full Stack Developer',
    company: 'Apple',
    followers: 789,
    following: 145,
    isFollowing: false,
    reputation: 678,
    verified: true,
  },
  {
    id: '8',
    name: 'Bùi Long H',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dylan',
    role: 'user',
    title: 'DevOps Engineer',
    company: 'Amazon',
    followers: 678,
    following: 234,
    isFollowing: false,
    reputation: 567,
    verified: true,
  },
  {
    id: '9',
    name: 'Ngô Yến I',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley',
    role: 'employer',
    title: 'Hiring Manager',
    company: 'LinkedIn Vietnam',
    followers: 523,
    following: 312,
    isFollowing: false,
    reputation: 412,
    verified: true,
  },
  {
    id: '10',
    name: 'Cao Minh J',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
    role: 'user',
    title: 'Data Scientist',
    company: 'TechLab Vietnam',
    followers: 345,
    following: 198,
    isFollowing: false,
    reputation: 287,
  },
  {
    id: '11',
    name: 'Ngô Thái K',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    role: 'user',
    title: 'Machine Learning Engineer',
    company: 'TensorFlow Vietnam',
    followers: 567,
    following: 234,
    isFollowing: false,
    reputation: 445,
    verified: true,
  },
  {
    id: '12',
    name: 'Lưu Việt L',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    role: 'user',
    title: 'Mobile Developer',
    company: 'Rocket App',
    followers: 234,
    following: 167,
    isFollowing: false,
    reputation: 198,
  },
  {
    id: '13',
    name: 'Trương Gia M',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
    role: 'user',
    title: 'Cloud Architect',
    company: 'AWS Vietnam',
    followers: 678,
    following: 289,
    isFollowing: false,
    reputation: 523,
    verified: true,
  },
  {
    id: '14',
    name: 'Phan Huy N',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn',
    role: 'employer',
    title: 'HR Director',
    company: 'Talentify Vietnam',
    followers: 456,
    following: 178,
    isFollowing: false,
    reputation: 334,
    verified: true,
  },
  {
    id: '15',
    name: 'Đinh Quốc O',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=River',
    role: 'user',
    title: 'DevOps Specialist',
    company: 'CloudTech',
    followers: 345,
    following: 212,
    isFollowing: false,
    reputation: 276,
  },
  {
    id: '16',
    name: 'Võ Như P',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Skylar',
    role: 'user',
    title: 'Security Engineer',
    company: 'CyberSafe Vietnam',
    followers: 523,
    following: 145,
    isFollowing: false,
    reputation: 412,
    verified: true,
  },
  {
    id: '17',
    name: 'Tạ Văn Q',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sydney',
    role: 'user',
    title: 'QA Engineer',
    company: 'TestHub',
    followers: 234,
    following: 189,
    isFollowing: false,
    reputation: 167,
  },
  {
    id: '18',
    name: 'Hoàng Minh R',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tatum',
    role: 'user',
    title: 'Product Designer',
    company: 'DesignCo Vietnam',
    followers: 612,
    following: 267,
    isFollowing: false,
    reputation: 478,
    verified: true,
  },
  {
    id: '19',
    name: 'Lê Hoàng S',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vale',
    role: 'user',
    title: 'Blockchain Developer',
    company: 'Web3 Vietnam',
    followers: 389,
    following: 234,
    isFollowing: false,
    reputation: 289,
  },
  {
    id: '20',
    name: 'Thái Ngọc T',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wren',
    role: 'user',
    title: 'AI Research Lead',
    company: 'AI Vietnam Labs',
    followers: 734,
    following: 123,
    isFollowing: false,
    reputation: 589,
    verified: true,
  },
  {
    id: '21',
    name: 'Nguyễn Anh U',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Xander',
    role: 'user',
    title: 'Game Developer',
    company: 'GameStudio Vietnam',
    followers: 267,
    following: 178,
    isFollowing: false,
    reputation: 189,
  },
  {
    id: '22',
    name: 'Trần Phương V',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yara',
    role: 'user',
    title: 'Tech Entrepreneur',
    company: 'StartupX Vietnam',
    followers: 845,
    following: 289,
    isFollowing: false,
    reputation: 667,
    verified: true,
  },
  {
    id: '23',
    name: 'Huỳnh Khánh W',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zion',
    role: 'user',
    title: 'CMS Developer',
    company: 'ContentHub',
    followers: 312,
    following: 201,
    isFollowing: false,
    reputation: 234,
  },
  {
    id: '24',
    name: 'Bế Tùng X',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ace',
    role: 'user',
    title: 'API Architect',
    company: 'API Gateway Vietnam',
    followers: 589,
    following: 156,
    isFollowing: false,
    reputation: 467,
    verified: true,
  },
  {
    id: '25',
    name: 'Đặng Hải Y',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Blake',
    role: 'user',
    title: 'Database Engineer',
    company: 'DataFlow',
    followers: 278,
    following: 189,
    isFollowing: false,
    reputation: 212,
  },
  {
    id: '26',
    name: 'Lâm Gia Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chandler',
    role: 'user',
    title: 'System Architect',
    company: 'SysDesign Vietnam',
    followers: 723,
    following: 267,
    isFollowing: false,
    reputation: 578,
    verified: true,
  },
  {
    id: '27',
    name: 'Quách Văn AA',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dakota',
    role: 'user',
    title: 'Performance Specialist',
    company: 'PerfOpt',
    followers: 289,
    following: 167,
    isFollowing: false,
    reputation: 201,
  },
  {
    id: '28',
    name: 'Phạm Long BB',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emery',
    role: 'user',
    title: 'Testing Framework Lead',
    company: 'TestCore Vietnam',
    followers: 534,
    following: 198,
    isFollowing: false,
    reputation: 401,
    verified: true,
  },
  {
    id: '29',
    name: 'Vũ Minh CC',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fox',
    role: 'user',
    title: 'Analytics Developer',
    company: 'DataInsight',
    followers: 345,
    following: 212,
    isFollowing: false,
    reputation: 267,
  },
  {
    id: '30',
    name: 'Tạ Anh DD',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raven',
    role: 'user',
    title: 'Frontend Developer',
    company: 'Pixel Studio',
    followers: 456,
    following: 234,
    isFollowing: false,
    reputation: 356,
    verified: true,
  },
];

// Helper function to generate timestamps for mock posts
const now = new Date();
const getTimestamp = (hoursAgo: number): string => {
  const date = new Date(now);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUsers[0],
    content: `Vừa hoàn thành dự án React + TypeScript đầu tiên! Mất 2 tuần để build một dashboard quản lý công việc với authentication, real-time updates, và deployment lên Vercel. 

Learnings:
- Custom hooks cực kỳ powerful
- TypeScript giúp catch bugs sớm
- Performance optimization quan trọng

Ai đó có experience tương tự? Mình muốn feedback!`,
    category: 'experience',
    topics: ['1'],
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    ],
    hashtags: ['#React', '#TypeScript', '#WebDevelopment', '#Learning'],
    timestamp: getTimestamp(2),
    likes: 145,
    comments: 23,
    shares: 12,
    saves: 34,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    author: mockUsers[1],
    content: `🎯 Hiring: Senior Frontend Developer - Remote (Full-time)
Salary: $80K - $120K/year
Location: Remote (Worldwide)

Requirements:
- 5+ years experience
- React, TypeScript, Node.js
- Experience with system design
- Team player

Interested? Apply via our careers page or DM me!`,
    category: 'job-search',
    topics: ['1'],
    images: [],
    hashtags: ['#Hiring', '#FrontendDeveloper', '#Remote', '#FulTime'],
    timestamp: getTimestamp(4),
    likes: 287,
    comments: 45,
    shares: 67,
    saves: 123,
    isLiked: false,
    isSaved: false,
    isSavedAsJob: false,
  },
  {
    id: '3',
    author: mockUsers[2],
    content: `Sharing: "Clean Code in TypeScript" - bài viết hay về best practices

Đã học được rất nhiều từ cộng đồng NextStepZ. Hôm nay muốn chia sẻ kinh nghiệm 10 năm làm software engineer:

1. Code clarity > cleverness
2. Test-driven development saves time
3. Code review là form của mentorship tốt nhất
4. Không ngại refactor khi cần

Các bạn có điều gì muốn add không?`,
    category: 'discussion',
    topics: ['1'],
    images: [],
    hashtags: ['#CodeQuality', '#BestPractices', '#Mentoring', '#SoftwareEngineering'],
    timestamp: getTimestamp(6),
    likes: 562,
    comments: 89,
    shares: 145,
    saves: 234,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '4',
    author: mockUsers[4],
    content: `UI Design for Real-time Collaboration - Case Study

Just finished designing a real-time collaboration tool UI inspired by Figma & Notion. Key design decisions:

✨ Features:
- Real-time cursor tracking
- Live comments with @ mentions
- Infinite canvas with zoom
- Dark/Light mode support

Tools: Figma, Prototyping with Framer

Would love feedback from designers and developers!`,
    category: 'experience',
    topics: ['2'],
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    ],
    hashtags: ['#UIDesign', '#UX', '#Figma', '#Design'],
    timestamp: getTimestamp(24),
    likes: 423,
    comments: 67,
    shares: 89,
    saves: 156,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '5',
    author: mockUsers[3],
    content: `Reflection: Jumping from Academia to Tech Industry

After 4 years in university, I finally made the jump to Meta as a PM. Here's what helped:

📚 Academic side:
- Problem solving mindset
- Research skills
- Communication practice

🏢 Industry side:
- Internships matter
- Side projects showcase skills
- Networking is key

The gap between theory and practice is real, but bridge-able. Keep learning!`,
    category: 'discussion',
    topics: ['3'],
    images: [],
    hashtags: ['#CareerPath', '#ProductManagement', '#Learning', '#Internship'],
    timestamp: getTimestamp(24),
    likes: 634,
    comments: 112,
    shares: 178,
    saves: 289,
    isLiked: false,
    isSaved: false,
  },
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: '1',
    author: mockUsers[1],
    content: 'Wow, really impressive work! The dashboard looks clean and well-designed. How long did it take you to implement the real-time updates?',
    timestamp: getTimestamp(1),
    likes: 12,
    replies: 2,
    isLiked: false,
    replyList: [
      {
        id: '1-1',
        author: mockUsers[0],
        content: 'Thanks so much! It took about 5 days for the real-time part. I used WebSocket with Socket.io which was smoother than expected.',
        timestamp: getTimestamp(0.5),
        likes: 4,
        replies: 1,
        isLiked: false,
        replyList: [
          {
            id: '1-1-1',
            author: mockUsers[1],
            content: 'Socket.io is great! Have you considered optimizing the event emissions to reduce bandwidth usage?',
            timestamp: getTimestamp(0.25),
            likes: 2,
            replies: 0,
            isLiked: false,
          },
        ],
      },
      {
        id: '1-2',
        author: mockUsers[2],
        content: 'Great choice with Socket.io! Make sure to implement proper error handling and reconnection logic for production.',
        timestamp: getTimestamp(0.8),
        likes: 5,
        replies: 0,
        isLiked: false,
      },
    ],
  },
  {
    id: '2',
    author: mockUsers[3],
    content: 'Great learning journey! I had similar experience with TypeScript. One tip: try using Zod for better type safety with runtime validation.',
    timestamp: getTimestamp(2),
    likes: 8,
    replies: 1,
    isLiked: false,
    replyList: [
      {
        id: '2-1',
        author: mockUsers[0],
        content: 'Thanks for the Zod recommendation! I\'ll definitely check it out for my next project.',
        timestamp: getTimestamp(1.5),
        likes: 3,
        replies: 0,
        isLiked: false,
      },
    ],
  },
  {
    id: '3',
    author: mockUsers[2],
    content: 'Nice! Custom hooks are indeed powerful. Have you tried using React Query or SWR for data fetching? It makes state management much easier.',
    timestamp: getTimestamp(3),
    likes: 15,
    replies: 2,
    isLiked: false,
    replyList: [
      {
        id: '3-1',
        author: mockUsers[0],
        content: 'I haven\'t tried React Query yet but SWR is amazing! The caching mechanism is very intuitive.',
        timestamp: getTimestamp(2.5),
        likes: 6,
        replies: 1,
        isLiked: false,
        replyList: [
          {
            id: '3-1-1',
            author: mockUsers[2],
            content: 'React Query is even better with more advanced features. Definitely worth exploring!',
            timestamp: getTimestamp(2.2),
            likes: 3,
            replies: 0,
            isLiked: false,
          },
        ],
      },
      {
        id: '3-2',
        author: mockUsers[4],
        content: 'Both are great options! I prefer React Query for complex scenarios.',
        timestamp: getTimestamp(2.8),
        likes: 4,
        replies: 0,
        isLiked: false,
      },
    ],
  },
  {
    id: '4',
    author: mockUsers[4],
    content: 'This is awesome! Can you share the GitHub repo? I\'m learning React too and would love to see the code structure.',
    timestamp: getTimestamp(4),
    likes: 6,
    replies: 0,
    isLiked: false,
    replyList: [],
  },
  {
    id: '5',
    author: mockUsers[0],
    content: 'Just pushed the repo to GitHub! Check out the branch for deployment configurations too.',
    timestamp: getTimestamp(5),
    likes: 4,
    replies: 0,
    isLiked: false,
    replyList: [],
  },
  {
    id: '6',
    author: mockUsers[2],
    content: 'Performance optimization is key. Have you done any profiling with React DevTools? I\'d recommend checking for unnecessary re-renders.',
    timestamp: getTimestamp(6),
    likes: 10,
    replies: 2,
    isLiked: false,
    replyList: [
      {
        id: '6-1',
        author: mockUsers[0],
        content: 'Yes! React DevTools Profiler helped me identify 3 major re-render issues. Great suggestion!',
        timestamp: getTimestamp(5.5),
        likes: 5,
        replies: 0,
        isLiked: false,
      },
      {
        id: '6-2',
        author: mockUsers[1],
        content: 'Also consider using useMemo and useCallback strategically for optimization.',
        timestamp: getTimestamp(5.8),
        likes: 4,
        replies: 0,
        isLiked: false,
      },
    ],
  },
];

// Mock Topics
export const mockTopics: Topic[] = [
  {
    id: '1',
    name: 'Lập Trình',
    icon: '💻',
    description: 'Trao đổi về lập trình, thuật toán, code best practices',
    postsCount: 2341,
    followersCount: 5234,
    isFollowing: false,
    trendingScore: 98,
  },
  {
    id: '2',
    name: 'Thiết Kế',
    icon: '🎨',
    description: 'UI/UX Design, Graphic Design, Design Thinking',
    postsCount: 1245,
    followersCount: 3456,
    isFollowing: true,
    trendingScore: 87,
  },
  {
    id: '3',
    name: 'Kinh Doanh',
    icon: '💼',
    description: 'Startup, Business Model, Entrepreneurship',
    postsCount: 934,
    followersCount: 2134,
    isFollowing: false,
    trendingScore: 76,
  },
  {
    id: '4',
    name: 'Marketing',
    icon: '📢',
    description: 'Digital Marketing, Growth Hacking, Brand Building',
    postsCount: 845,
    followersCount: 1987,
    isFollowing: false,
    trendingScore: 65,
  },
  {
    id: '5',
    name: 'Công Nghệ Mới',
    icon: '🚀',
    description: 'AI/ML, Blockchain, Web3, Emerging Tech',
    postsCount: 1876,
    followersCount: 4123,
    isFollowing: false,
    trendingScore: 94,
  },
  {
    id: '6',
    name: 'Tìm Việc',
    icon: '💼',
    description: 'Job Posting, Interview Tips, Career Advice',
    postsCount: 3456,
    followersCount: 7234,
    isFollowing: true,
    trendingScore: 100,
  },
];

// Mock Questions
export const mockQuestions: Question[] = [
  {
    id: '1',
    author: mockUsers[0],
    title: 'How to optimize React re-renders in large lists?',
    content: `I have a list of 10,000 items that re-render every time I update a single item. Performance is very slow. 

I've already tried:
- React.memo
- useMemo for list item components
- Virtualizing with react-window

Still slow. Any other techniques?`,
    tags: ['React', 'Performance', 'JavaScript'],
    timestamp: '3 giờ trước',
    views: 234,
    votes: 12,
    answers: 5,
    isAnswered: true,
    acceptedAnswerId: 'ans-1',
    isUpvoted: false,
    comments: mockComments.slice(0, 3),
  },
  {
    id: '2',
    author: mockUsers[4],
    title: 'Best practices for organizing Tailwind CSS classes?',
    content: `As my project grows, Tailwind classes are getting harder to manage. 
    
Should I create utility classes? Use CSS modules? Component libraries?
    
What's your approach?`,
    tags: ['CSS', 'Tailwind', 'BestPractices'],
    timestamp: '8 giờ trước',
    views: 456,
    votes: 34,
    answers: 12,
    isAnswered: true,
    isUpvoted: false,
  },
];

// Mock Answers
export const mockAnswers: Answer[] = [
  {
    id: 'ans-1',
    question: mockQuestions[0],
    author: mockUsers[2],
    content: `Use React.memo + useMemo is good, but you should also consider:

1. **State structure**: Keep only necessary state in the list. Move others to context.
2. **Windowing**: react-window or react-virtualized is essential for 10K+ items
3. **Key prop**: Make sure your key is stable (use ID, not index)
4. **Server-side pagination**: Load items in batches instead of all at once

Here's a pattern that works:
\`\`\`tsx
const ListItem = React.memo(({ item, onSelect }) => (
  <div onClick={() => onSelect(item.id)}>{item.name}</div>
))

const VirtualList = ({ items }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={50}
  >
    {({ index, style }) => (
      <ListItem
        style={style}
        item={items[index]}
        onSelect={handleSelect}
      />
    )}
  </FixedSizeList>
)
\`\`\`

This pattern reduces renders significantly.`,
    timestamp: '2 giờ trước',
    votes: 89,
    isAccepted: true,
    isUpvoted: false,
  },
];

// Mock Companies
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Google Vietnam',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=GV',
    industry: 'Technology',
    size: 'enterprise',
    location: 'Hanoi, Vietnam',
    website: 'google.com',
    averageRating: 4.7,
    totalReviews: 234,
  },
  {
    id: '2',
    name: 'Microsoft Vietnam',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=MS',
    industry: 'Technology',
    size: 'enterprise',
    location: 'Hanoi, Vietnam',
    website: 'microsoft.com',
    averageRating: 4.5,
    totalReviews: 189,
  },
  {
    id: '3',
    name: 'Tech Startup ABC',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TA',
    industry: 'SaaS',
    size: 'startup',
    location: 'Saigon, Vietnam',
    averageRating: 4.3,
    totalReviews: 45,
  },
];

// Mock Company Reviews
export const mockCompanyReviews: CompanyReview[] = [
  {
    id: '1',
    company: mockCompanies[0],
    author: mockUsers[3],
    rating: 5,
    title: 'Great company, excellent benefits',
    content: `Google Vietnam is a fantastic place to work. Great colleagues, amazing office environment, and strong engineering culture. The work-life balance is reasonable, and there's great opportunity for growth.`,
    ratings: {
      environment: 5,
      professionalism: 5,
      benefits: 5,
      workLifeBalance: 4,
      compensation: 5,
    },
    timestamp: '2 tuần trước',
    helpful: 156,
    position: 'Software Engineer',
  },
  {
    id: '2',
    company: mockCompanies[1],
    author: mockUsers[4],
    rating: 4,
    title: 'Good company with growth opportunities',
    content: `Working at Microsoft was a great learning experience. Good technical challenges and supportive team. Salary is competitive. Only downside is sometimes the bureaucracy can slow things down.`,
    ratings: {
      environment: 4,
      professionalism: 5,
      benefits: 4,
      workLifeBalance: 3,
      compensation: 4,
    },
    timestamp: '3 tuần trước',
    helpful: 98,
    position: 'Product Manager',
  },
];

// Mock Leaderboard
export const mockLeaderboard: LeaderboardUser[] = [
  {
    rank: 1,
    user: mockUsers[2],
    score: 8945,
    posts: 234,
    likes: 5678,
    followers: 1240,
    streak: 45,
  },
  {
    rank: 2,
    user: mockUsers[3],
    score: 7234,
    posts: 156,
    likes: 4123,
    followers: 567,
    streak: 32,
  },
  {
    rank: 3,
    user: mockUsers[0],
    score: 5621,
    posts: 89,
    likes: 3456,
    followers: 324,
    streak: 28,
  },
  {
    rank: 4,
    user: mockUsers[4],
    score: 4589,
    posts: 67,
    likes: 2789,
    followers: 234,
    streak: 21,
  },
  {
    rank: 5,
    user: mockUsers[1],
    score: 3456,
    posts: 45,
    likes: 1234,
    followers: 892,
    streak: 14,
  },
  {
    rank: 6,
    user: mockUsers[5],
    score: 3234,
    posts: 78,
    likes: 2145,
    followers: 456,
    streak: 18,
  },
  {
    rank: 7,
    user: mockUsers[6],
    score: 2876,
    posts: 92,
    likes: 1987,
    followers: 789,
    streak: 25,
  },
  {
    rank: 8,
    user: mockUsers[7],
    score: 2543,
    posts: 64,
    likes: 1654,
    followers: 678,
    streak: 16,
  },
  {
    rank: 9,
    user: mockUsers[8],
    score: 2187,
    posts: 51,
    likes: 1423,
    followers: 523,
    streak: 12,
  },
  {
    rank: 10,
    user: mockUsers[9],
    score: 1954,
    posts: 43,
    likes: 987,
    followers: 345,
    streak: 8,
  },
  {
    rank: 11,
    user: mockUsers[10],
    score: 1876,
    posts: 48,
    likes: 1245,
    followers: 567,
    streak: 15,
  },
  {
    rank: 12,
    user: mockUsers[11],
    score: 1754,
    posts: 52,
    likes: 1156,
    followers: 234,
    streak: 11,
  },
  {
    rank: 13,
    user: mockUsers[12],
    score: 1623,
    posts: 39,
    likes: 954,
    followers: 312,
    streak: 9,
  },
  {
    rank: 14,
    user: mockUsers[13],
    score: 1512,
    posts: 45,
    likes: 876,
    followers: 456,
    streak: 13,
  },
  {
    rank: 15,
    user: mockUsers[14],
    score: 1389,
    posts: 36,
    likes: 745,
    followers: 289,
    streak: 7,
  },
  {
    rank: 16,
    user: mockUsers[15],
    score: 1267,
    posts: 41,
    likes: 654,
    followers: 378,
    streak: 10,
  },
  {
    rank: 17,
    user: mockUsers[16],
    score: 1156,
    posts: 33,
    likes: 567,
    followers: 234,
    streak: 6,
  },
  {
    rank: 18,
    user: mockUsers[17],
    score: 1034,
    posts: 38,
    likes: 489,
    followers: 323,
    streak: 8,
  },
  {
    rank: 19,
    user: mockUsers[18],
    score: 912,
    posts: 29,
    likes: 412,
    followers: 267,
    streak: 5,
  },
  {
    rank: 20,
    user: mockUsers[19],
    score: 876,
    posts: 34,
    likes: 378,
    followers: 456,
    streak: 9,
  },
  {
    rank: 21,
    user: mockUsers[20],
    score: 823,
    posts: 26,
    likes: 334,
    followers: 189,
    streak: 4,
  },
  {
    rank: 22,
    user: mockUsers[21],
    score: 756,
    posts: 31,
    likes: 289,
    followers: 378,
    streak: 7,
  },
  {
    rank: 23,
    user: mockUsers[22],
    score: 698,
    posts: 23,
    likes: 245,
    followers: 156,
    streak: 3,
  },
  {
    rank: 24,
    user: mockUsers[23],
    score: 634,
    posts: 28,
    likes: 201,
    followers: 312,
    streak: 6,
  },
  {
    rank: 25,
    user: mockUsers[24],
    score: 567,
    posts: 19,
    likes: 167,
    followers: 123,
    streak: 2,
  },
  {
    rank: 26,
    user: mockUsers[25],
    score: 512,
    posts: 24,
    likes: 134,
    followers: 267,
    streak: 5,
  },
  {
    rank: 27,
    user: mockUsers[26],
    score: 456,
    posts: 15,
    likes: 98,
    followers: 89,
    streak: 1,
  },
  {
    rank: 28,
    user: mockUsers[27],
    score: 401,
    posts: 20,
    likes: 76,
    followers: 156,
    streak: 4,
  },
  {
    rank: 29,
    user: mockUsers[28],
    score: 345,
    posts: 12,
    likes: 54,
    followers: 67,
    streak: 1,
  },
  {
    rank: 30,
    user: mockUsers[29],
    score: 312,
    posts: 18,
    likes: 89,
    followers: 145,
    streak: 3,
  },
];

// Trending Hashtags
export const mockTrendingHashtags = [
  { tag: '#React', posts: 1234, trend: 'up' as const },
  { tag: '#TypeScript', posts: 987, trend: 'up' as const },
  { tag: '#WebDevelopment', posts: 765, trend: 'stable' as const },
  { tag: '#NextJS', posts: 654, trend: 'up' as const },
  { tag: '#TailwindCSS', posts: 543, trend: 'up' as const },
  { tag: '#CareerAdvice', posts: 432, trend: 'stable' as const },
  { tag: '#Startup', posts: 321, trend: 'down' as const },
  { tag: '#AI', posts: 876, trend: 'up' as const },
];

// Notifications Mock
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'reply';
  actor: CommunityUser;
  target: Post | Comment;
  content: string;
  timestamp: string;
  read: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    actor: mockUsers[1],
    target: mockPosts[0],
    content: 'liked your post about React',
    timestamp: '5 phút trước',
    read: false,
  },
  {
    id: '2',
    type: 'comment',
    actor: mockUsers[2],
    target: mockPosts[2],
    content: 'commented on your post',
    timestamp: '15 phút trước',
    read: false,
  },
  {
    id: '3',
    type: 'follow',
    actor: mockUsers[3],
    target: mockPosts[0],
    content: 'started following you',
    timestamp: '1 giờ trước',
    read: true,
  },
];

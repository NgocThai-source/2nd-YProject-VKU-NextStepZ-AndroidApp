/**
 * Adapter để transform dữ liệu từ Community & Companies
 * thành RecommendedPost & RecommendedJob cho trang Recommendations
 */

import { Post, mockPosts } from './community-mock-data';
import { Company, mockCompanies } from './companies-mock-data';
import { RecommendedPost, RecommendedJob } from './recommendations-mock-data';

/**
 * Transform Community Posts thành RecommendedPosts
 * Dùng post.likes & post.comments để tính relevanceScore
 */
export function transformPostsToRecommendations(
  posts: Post[],
  userSkills: string[] = []
): RecommendedPost[] {
  return posts
    .filter((post) => post.category !== 'offer') // Exclude offers
    .slice(0, 10) // Limit to 10
    .map((post) => {
      // Calculate relevance score based on engagement & skill match
      const engagementScore = Math.min(100, (post.likes + post.comments * 2) / 5);
      const skillMatchScore = post.topics?.some((topic) =>
        userSkills.some((skill) => topic.toLowerCase().includes(skill.toLowerCase()))
      )
        ? 20
        : 0;
      const relevanceScore = Math.round((engagementScore + skillMatchScore) * 0.9);

      // Generate match reasons
      const matchReasons: string[] = [];
      if (skillMatchScore > 0) {
        matchReasons.push('Liên quan đến kỹ năng của bạn');
      }
      if (post.likes > 100) {
        matchReasons.push('Bài viết phổ biến trong cộng đồng');
      }
      if (post.comments > 30) {
        matchReasons.push('Thảo luận sôi nổi, giá trị cao');
      }
      if (matchReasons.length === 0) {
        matchReasons.push('Chủ đề thú vị dựa trên hồ sơ của bạn');
      }

      const categoryMap: Record<string, RecommendedPost['category']> = {
        'experience': 'experience',
        'discussion': 'discussion',
        'question': 'question',
        'opportunity': 'opportunity',
        'job-search': 'job-search',
      };

      return {
        id: post.id,
        title: post.content.substring(0, 80),
        author: {
          id: post.author.id,
          name: post.author.name,
          avatar: post.author.avatar,
          verified: post.author.verified,
          title: post.author.title,
        },
        content: post.content,
        category: categoryMap[post.category] || 'discussion',
        skills: post.topics || [],
        topic: post.topics?.[0] || 'General',
        likes: post.likes,
        comments: post.comments,
        relevanceScore,
        description: post.content.substring(0, 150),
        postedAt: post.timestamp,
        isSaved: post.isSaved,
        matchReasons,
      };
    });
}

/**
 * Transform Companies thành RecommendedJobs
 * Tạo job listings từ companies & open positions
 */
export function transformCompaniesToRecommendations(
  companies: Company[],
  userSkills: string[] = []
): RecommendedJob[] {
  const recommendations: RecommendedJob[] = [];
  const skills = Array.isArray(userSkills) ? userSkills : [];

  // Transform mỗi company thành 1-2 job recommendations
  companies.forEach((company) => {
    // Create 1-2 job recommendations per company
    const jobCount = company.openPositions > 0 ? Math.min(2, company.openPositions) : 1;

    for (let i = 0; i < jobCount; i++) {
      // Generate job title based on company industry
      const jobTitles: Record<string, string[]> = {
        Technology: ['Senior Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'DevOps Engineer'],
        'Software Development': ['Software Engineer', 'QA Engineer', 'UI/UX Designer', 'Tech Lead'],
        Finance: ['Business Analyst', 'Financial Analyst', 'Risk Manager', 'Data Scientist'],
        Healthcare: ['Healthcare IT', 'Medical Assistant', 'Clinical Analyst', 'Compliance Officer'],
      };

      const industryKey = company.industry[0] || 'Technology';
      const titles = jobTitles[industryKey] || ['Senior Developer', 'Engineer', 'Specialist'];
      const title = titles[i % titles.length];

      // Calculate match score based on skills
      const salaryScore = company.salaryRange[1] > 20 ? 20 : 10; // Using millions as unit
      const companyRatingScore = company.rating * 12;
      
      // Check if company jobCategories match with userSkills
      let skillMatchScore = 15;
      if (company.jobCategories?.length && skills.length > 0) {
        const hasMatch = company.jobCategories.some((cat) => {
          if (!cat || typeof cat !== 'string') return false;
          return skills.some((skill) => {
            if (!skill || typeof skill !== 'string') return false;
            return cat.toLowerCase().includes(skill.toLowerCase());
          });
        });
        if (hasMatch) {
          skillMatchScore = 30;
        }
      }
      
      const matchScore = Math.min(100, Math.round(companyRatingScore + salaryScore + skillMatchScore));

      // Generate match reasons
      const matchReasons: string[] = [];
      if (company.rating > 4.5) {
        matchReasons.push('Công ty có rating cao');
      }
      if (skillMatchScore >= 30) {
        matchReasons.push('Công ty thuê các vị trí liên quan đến kỹ năng của bạn');
      }
      if (company.culture === 'innovative') {
        matchReasons.push('Công ty nổi tiếng về culture & innovation');
      }
      if (matchReasons.length === 0) {
        matchReasons.push('Cơ hội phù hợp với hồ sơ của bạn');
      }

      const salary = company.salaryRange || [10, 20];

      recommendations.push({
        id: `${company.id}-job-${i}`,
        title,
        company: company.name,
        companyLogo: company.logo,
        location: company.location,
        salary: [salary[0] * 1000000, salary[1] * 1000000], // Convert millions to actual salary
        skills: company.jobCategories?.slice(0, 4) || ['JavaScript', 'React', 'Node.js', 'AWS'],
        level: i === 0 ? 'mid' : 'junior',
        matchScore,
        description: company.aboutCompany?.substring(0, 120) || company.description,
        type: 'full-time',
        postedAt: '1 tuần trước',
        applicants: Math.floor(Math.random() * 100) + 10,
        isSaved: false,
        matchReasons,
      });
    }
  });

  // Return all recommendations (không slice để hiển thị tất cả)
  return recommendations;
}

/**
 * Get all recommended posts from community
 */
export function getRecommendedPosts(userSkills?: string[]): RecommendedPost[] {
  return transformPostsToRecommendations(mockPosts, userSkills);
}

/**
 * Get all recommended jobs from companies
 * Returns ONLY IT/Technology companies as job recommendations
 */
export function getRecommendedJobs(userSkills?: string[]): RecommendedJob[] {
  // Filter ONLY strict IT/Technology companies
  const techCompanies = mockCompanies.filter((company) => {
    // STRICT: Only accept if businessType is 'technology'
    // OR industry contains ONLY software/cloud/IT keywords (not marketing, design, etc.)
    const isStrictlyTech = company.businessType === 'technology';
    
    // For secondary check, only accept software development or cloud computing
    const isValidIndustry = company.industry?.some((ind) => {
      const lowerInd = ind.toLowerCase().trim();
      return lowerInd === 'software development' || 
             lowerInd === 'cloud computing' ||
             lowerInd === 'technology' && company.businessType === 'technology';
    }) || false;
    
    // Return TRUE only if strictly tech business type AND has valid IT industry
    return isStrictlyTech && isValidIndustry;
  });
  
  console.log('All companies:', mockCompanies.length);
  console.log('IT companies filtered:', techCompanies.length);
  console.log('IT companies:', techCompanies.map(c => ({ id: c.id, name: c.name, businessType: c.businessType, industry: c.industry })));
  
  // Convert IT companies directly to RecommendedJob format
  const recommendations: RecommendedJob[] = techCompanies.map((company) => {
    const matchReasons: string[] = [];
    if (company.rating > 4.5) {
      matchReasons.push('Công ty có rating cao');
    }
    if (company.openPositions > 0) {
      matchReasons.push(`Đang tuyển ${company.openPositions} vị trí`);
    }
    if (company.culture === 'innovative') {
      matchReasons.push('Công ty nổi tiếng về culture & innovation');
    }
    if (matchReasons.length === 0) {
      matchReasons.push('Công ty IT phù hợp với hồ sơ của bạn');
    }

    return {
      id: company.id,
      title: company.name,
      company: company.name,
      companyLogo: company.logo,
      location: company.location,
      salary: [company.salaryRange[0] * 1000000, company.salaryRange[1] * 1000000],
      skills: company.jobCategories?.slice(0, 4) || [],
      level: company.size === 'large' ? 'senior' : company.size === 'medium' ? 'mid' : 'junior',
      matchScore: Math.round(company.rating * 18 + 10),
      description: company.aboutCompany || company.description,
      type: 'full-time',
      postedAt: '1 tuần trước',
      applicants: (parseInt(company.id) * 7 + 15) % 100,
      isSaved: false,
      matchReasons,
    };
  });
  
  console.log('Recommended IT companies/jobs:', recommendations.length);
  
  return recommendations;
}

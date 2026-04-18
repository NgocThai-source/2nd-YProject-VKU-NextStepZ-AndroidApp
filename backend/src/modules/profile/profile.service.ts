/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateProfileDto,
  UpdateProfileDto,
  UpdateUserInfoDto,
  UpdatePersonalInfoDto,
  UpdateProfessionalProfileDto,
} from './dto';
import * as fs from 'fs';
import * as path from 'path';

// Helper function to format birthDate to YYYY-MM-DD
const formatBirthDate = (birthDate: Date | null | undefined): string | null => {
  if (!birthDate) return null;
  try {
    const date = new Date(birthDate);
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
};

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) { }

  // Create profile for new user
  async createProfile(userId: string, createProfileDto?: CreateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create profile with data from registration or defaults
    const profile = await this.prisma.profile.create({
      data: {
        userId,
        firstName: (createProfileDto?.firstName || user.firstName) as
          | string
          | null,
        lastName: (createProfileDto?.lastName || user.lastName) as
          | string
          | null,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        birthDate: (createProfileDto?.birthDate || user.birthDate) as
          | Date
          | null,
        province: (createProfileDto?.province || user.province) as
          | string
          | null,
        school: (createProfileDto?.school || user.school) as string | null,
        major: (createProfileDto?.major || user.major) as string | null,
        bio: createProfileDto?.bio || '',
      },
      include: {
        publicProfile: true,
      },
    });

    // Create empty career profile only for students (role 'user')
    if (user.role === 'user') {
      await this.prisma.careerProfile.create({
        data: {
          profileId: profile.id,
          objective: '',
        },
      });
    }

    return profile;
  }

  // Get user's own profile
  async getProfile(userId: string) {
    // Get full profile with all fields
    const fullProfile = await this.prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        birthDate: true,
        city: true,
        district: true,
        province: true,
        school: true,
        major: true,
        title: true,
        objective: true,
        socialLinks: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!fullProfile) {
      throw new NotFoundException('Profile not found');
    }

    // Get profile with relations for response
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
          },
        },
        publicProfile: true,
        careerProfile: {
          include: {
            experiences: {
              orderBy: {
                startDate: 'desc',
              },
            },
            education: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            skills: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Format social links from JSON to array
    const socialLinks = this.formatSocialLinks(fullProfile.socialLinks);

    return {
      ...profile,
      socialLinks,
      birthDate: formatBirthDate(profile.birthDate),
    };
  }

  // Get profile by ID (for public profile)
  async getProfileById(profileId: string) {
    // Get full profile data first (without relations) to access socialLinks
    const fullProfileData = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        birthDate: true,
        city: true,
        district: true,
        province: true,
        school: true,
        major: true,
        title: true,
        objective: true,
        socialLinks: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!fullProfileData) {
      throw new NotFoundException('Profile not found');
    }

    // Get profile with relations
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
        careerProfile: {
          include: {
            experiences: {
              orderBy: {
                startDate: 'desc',
              },
            },
            education: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            skills: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Format social links for response
    const socialLinks = this.formatSocialLinks(fullProfileData.socialLinks);

    return {
      ...profile,
      socialLinks,
      birthDate: formatBirthDate(profile.birthDate),
    };
  }

  // Update profile (full update)
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    // Get full profile data first (without relations) to access socialLinks
    const fullProfile = await this.prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        birthDate: true,
        city: true,
        district: true,
        province: true,
        school: true,
        major: true,
        title: true,
        objective: true,
        socialLinks: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!fullProfile) {
      throw new NotFoundException('Profile not found');
    }

    // Handle social links conversion - keep as array format to preserve all fields
    let socialLinksData: any = fullProfile.socialLinks;
    if (updateProfileDto.socialLinks) {
      if (Array.isArray(updateProfileDto.socialLinks)) {
        // Store as array to preserve id, platform, and url
        socialLinksData = updateProfileDto.socialLinks.map((link, idx) => ({
          id: link.id || `${Date.now()}-${idx}`,
          platform: link.platform || link.id,
          url: link.url,
        }));
      } else {
        socialLinksData = updateProfileDto.socialLinks;
      }
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        firstName: (updateProfileDto.firstName || fullProfile.firstName) as
          | string
          | null,
        lastName: (updateProfileDto.lastName || fullProfile.lastName) as
          | string
          | null,
        avatar: (updateProfileDto.avatar || fullProfile.avatar) as string | null,
        bio: updateProfileDto.bio || fullProfile.bio,
        phone: (updateProfileDto.phone || fullProfile.phone) as string | null,
        birthDate: (updateProfileDto.birthDate || fullProfile.birthDate) as
          | Date
          | null,
        province: (updateProfileDto.province || fullProfile.province) as
          | string
          | null,
        school: (updateProfileDto.school || fullProfile.school) as string | null,
        major: (updateProfileDto.major || fullProfile.major) as string | null,
        title: (updateProfileDto.title || fullProfile.title) as string | null,
        objective: updateProfileDto.objective || fullProfile.objective,
        socialLinks: socialLinksData || (null as any),
        city: (updateProfileDto.city || fullProfile.city) as string | null,
        district: (updateProfileDto.district || fullProfile.district) as
          | string
          | null,
      },
      include: {
        publicProfile: true,
        careerProfile: {
          include: {
            experiences: {
              orderBy: {
                startDate: 'desc',
              },
            },
            education: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            skills: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    // Convert social links to array format for response
    const socialLinks = this.formatSocialLinks(fullProfile.socialLinks);

    return {
      ...updatedProfile,
      socialLinks,
      birthDate: formatBirthDate(updatedProfile.birthDate),
    };
  }

  // ===== NEW METHODS =====

  // Update user info (avatar, name, email, bio)
  async updateUserInfo(userId: string, updateUserInfoDto: UpdateUserInfoDto) {
    // Get full profile data first (without relations) to access socialLinks
    const fullProfile = await this.prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        birthDate: true,
        city: true,
        district: true,
        province: true,
        school: true,
        major: true,
        title: true,
        objective: true,
        socialLinks: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!fullProfile) {
      throw new NotFoundException('Profile not found');
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        firstName: updateUserInfoDto.firstName || fullProfile.firstName,
        lastName: updateUserInfoDto.lastName || fullProfile.lastName,
        avatar: updateUserInfoDto.avatar || fullProfile.avatar,
        bio: updateUserInfoDto.bio || fullProfile.bio,
        email: updateUserInfoDto.email || fullProfile.email,
      },
      include: {
        publicProfile: true,
        careerProfile: {
          include: {
            experiences: {
              orderBy: {
                startDate: 'desc',
              },
            },
            education: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            skills: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    // Also update User model for consistency
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateUserInfoDto.firstName || undefined,
        lastName: updateUserInfoDto.lastName || undefined,
        avatar: updateUserInfoDto.avatar || undefined,
        bio: updateUserInfoDto.bio || undefined,
      },
    });

    // Format social links for response
    const socialLinks = this.formatSocialLinks(fullProfile.socialLinks);

    return {
      ...updatedProfile,
      socialLinks,
      birthDate: formatBirthDate(updatedProfile.birthDate),
    };
  }

  // Upload avatar file
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Get full profile data first (without relations) to access socialLinks
    const fullProfile = await this.prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        birthDate: true,
        city: true,
        district: true,
        province: true,
        school: true,
        major: true,
        title: true,
        objective: true,
        socialLinks: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!fullProfile) {
      throw new NotFoundException('Profile not found');
    }

    // Save file to disk (or cloud storage)
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate a safe filename (remove special characters)
    const ext = path.extname(file.originalname).toLowerCase();
    const safeFileName = `${userId}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, safeFileName);

    // Get the server base URL from environment or default
    const serverBaseUrl = process.env.SERVER_BASE_URL || 'http://localhost:3001';
    const fileUrl = `${serverBaseUrl}/uploads/avatars/${safeFileName}`;

    fs.writeFileSync(filePath, file.buffer);

    // Update profile with avatar URL
    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        avatar: fileUrl,
      },
      include: {
        publicProfile: true,
        careerProfile: {
          include: {
            experiences: {
              orderBy: {
                startDate: 'desc',
              },
            },
            education: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            skills: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    // Also update User model
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatar: fileUrl,
      },
    });

    // Format social links for response
    const socialLinks = this.formatSocialLinks(fullProfile.socialLinks);

    return {
      ...updatedProfile,
      socialLinks,
      birthDate: formatBirthDate(updatedProfile.birthDate),
    };
  }

  // Update personal info (phone, birth date, city, district, social links)
  async updatePersonalInfo(
    userId: string,
    updatePersonalInfoDto: UpdatePersonalInfoDto,
  ) {
    // Get full profile data first (without relations) to access current data
    const fullProfile = await this.prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        birthDate: true,
        city: true,
        district: true,
        province: true,
        school: true,
        major: true,
        title: true,
        objective: true,
        socialLinks: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!fullProfile) {
      throw new NotFoundException('Profile not found');
    }

    // Process social links - keep as array format to preserve id, platform, and url
    let socialLinksData: any = fullProfile.socialLinks;
    if (updatePersonalInfoDto.socialLinks) {
      if (Array.isArray(updatePersonalInfoDto.socialLinks)) {
        // Store as array to preserve all fields (id, platform, url)
        socialLinksData = updatePersonalInfoDto.socialLinks.map((link, idx) => ({
          id: link.id || `${Date.now()}-${idx}`,
          platform: link.platform,
          url: link.url,
        }));
      } else {
        socialLinksData = updatePersonalInfoDto.socialLinks;
      }
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        firstName: updatePersonalInfoDto.firstName || fullProfile.firstName,
        lastName: updatePersonalInfoDto.lastName || fullProfile.lastName,
        phone: updatePersonalInfoDto.phone || fullProfile.phone,
        birthDate: updatePersonalInfoDto.birthDate
          ? new Date(updatePersonalInfoDto.birthDate)
          : fullProfile.birthDate,
        city: updatePersonalInfoDto.city || fullProfile.city,
        district: updatePersonalInfoDto.district || fullProfile.district,
        socialLinks: socialLinksData || (null as any),
      },
      include: {
        publicProfile: true,
        careerProfile: {
          include: {
            experiences: {
              orderBy: {
                startDate: 'desc',
              },
            },
            education: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            skills: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    // Also update User model
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updatePersonalInfoDto.firstName || undefined,
        lastName: updatePersonalInfoDto.lastName || undefined,
        phone: updatePersonalInfoDto.phone || undefined,
        birthDate: updatePersonalInfoDto.birthDate
          ? new Date(updatePersonalInfoDto.birthDate)
          : undefined,
      },
    });

    // Format social links for response
    const socialLinks = this.formatSocialLinks(socialLinksData);

    return {
      ...updatedProfile,
      socialLinks,
      birthDate: formatBirthDate(updatedProfile.birthDate),
    };
  }

  // Update professional profile (objective, experiences, skills, education)
  async updateProfessionalProfile(
    userId: string,
    updateProfessionalProfileDto: UpdateProfessionalProfileDto,
  ) {
    // Get full profile data first (without relations) to access socialLinks
    const fullProfileData = await this.prisma.profile.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        birthDate: true,
        city: true,
        district: true,
        province: true,
        school: true,
        major: true,
        title: true,
        objective: true,
        socialLinks: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!fullProfileData) {
      throw new NotFoundException('Profile not found');
    }

    // Get profile with career profile relation for processing
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        careerProfile: {
          include: {
            experiences: true,
            skills: true,
            education: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    let careerProfile = profile.careerProfile;

    // Get user role to check if they can have career profile
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create career profile if it doesn't exist (only for students with role 'user')
    if (!careerProfile) {
      if (user.role === 'user') {
        careerProfile = await this.prisma.careerProfile.create({
          data: {
            profileId: fullProfileData.id,
            objective: updateProfessionalProfileDto.objective || '',
          },
          include: {
            experiences: true,
            skills: true,
            education: true,
          },
        });
      } else {
        throw new BadRequestException('Only students can have career profile');
      }
    } else {
      // Update objective if provided
      if (updateProfessionalProfileDto.objective) {
        careerProfile = await this.prisma.careerProfile.update({
          where: { id: careerProfile.id },
          data: {
            objective: updateProfessionalProfileDto.objective,
          },
          include: {
            experiences: true,
            skills: true,
            education: true,
          },
        });
      }
    }

    // Update experiences
    if (updateProfessionalProfileDto.experiences) {
      // Delete old experiences
      await this.prisma.experience.deleteMany({
        where: { careerProfileId: careerProfile.id },
      });

      // Create new experiences
      const experiences = await Promise.all(
        updateProfessionalProfileDto.experiences.map((exp) =>
          this.prisma.experience.create({
            data: {
              careerProfileId: careerProfile.id,
              position: exp.position,
              company: exp.company,
              startDate: exp.startDate,
              endDate: exp.endDate || null,
              isCurrent: exp.isCurrent || false,
              description: exp.description || null,
            },
          }),
        ),
      );
      careerProfile.experiences = experiences;
    }

    // Update skills
    if (updateProfessionalProfileDto.skills) {
      // Delete old skills
      await this.prisma.skill.deleteMany({
        where: { careerProfileId: careerProfile.id },
      });

      // Create new skills
      const skills = await Promise.all(
        updateProfessionalProfileDto.skills.map((skill) =>
          this.prisma.skill.create({
            data: {
              careerProfileId: careerProfile.id,
              name: skill.name,
              level: skill.level || 'intermediate',
            },
          }),
        ),
      );
      careerProfile.skills = skills;
    }

    // Update education
    if (updateProfessionalProfileDto.education) {
      // Delete old education
      await this.prisma.education.deleteMany({
        where: { careerProfileId: careerProfile.id },
      });

      // Create new education
      const education = await Promise.all(
        updateProfessionalProfileDto.education.map((edu) =>
          this.prisma.education.create({
            data: {
              careerProfileId: careerProfile.id,
              school: edu.school,
              degree: edu.degree || null,
              field: edu.field || null,
              graduationYear: edu.graduationYear || null,
            },
          }),
        ),
      );
      careerProfile.education = education;
    }

    // Update profile objective
    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        objective: updateProfessionalProfileDto.objective || fullProfileData.objective,
      },
      include: {
        publicProfile: true,
        careerProfile: {
          include: {
            experiences: {
              orderBy: {
                startDate: 'desc',
              },
            },
            skills: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            education: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });

    // Format social links for response
    const socialLinks = this.formatSocialLinks(fullProfileData.socialLinks);

    return {
      ...updatedProfile,
      socialLinks,
      birthDate: formatBirthDate(updatedProfile.birthDate),
    };
  }

  // Create or get public profile
  async getOrCreatePublicProfile(userId: string) {
    let publicProfile = await this.prisma.publicProfile.findUnique({
      where: { userId },
      include: {
        profile: true,
      },
    });

    if (!publicProfile) {
      const profile = await this.prisma.profile.findUnique({
        where: { userId },
      });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      publicProfile = await this.prisma.publicProfile.create({
        data: {
          userId,
          profileId: profile.id,
          isActive: true,
        },
        include: {
          profile: true,
        },
      });
    }

    return publicProfile;
  }

  // Get public profile by share token
  // skipView: if true, don't increment view count (used for polling/real-time updates)
  // viewerId: if provided, check if this is the profile owner viewing their own profile
  async getPublicProfileByToken(shareToken: string, skipView: boolean = false, viewerId?: string) {
    const publicProfile = await this.prisma.publicProfile.findUnique({
      where: { shareToken },
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                role: true,
                isVerified: true,
                isBanned: true,
              },
            },
            employerProfile: {
              include: {
                jobPostings: true,
              },
            },
            careerProfile: {
              include: {
                experiences: {
                  orderBy: {
                    startDate: 'desc',
                  },
                },
                education: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                },
                skills: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!publicProfile) {
      throw new NotFoundException('Public profile not found');
    }

    if (!publicProfile.isActive) {
      throw new BadRequestException('This public profile is no longer active');
    }

    // Check if user is banned
    if (publicProfile.profile.user.isBanned) {
      throw new BadRequestException('Tài khoản này đã bị khóa');
    }

    // Get user posts separately
    const userPosts = await this.prisma.post.findMany({
      where: { userId: publicProfile.profile.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        comments: true,
        likes: true,
      },
    });

    // Check if viewer is the profile owner
    const isOwnerViewing = viewerId && viewerId === publicProfile.profile.userId;

    // Only increment view count on initial page load, not during polling and not for owner
    let currentViewCount = publicProfile.viewCount;
    if (!skipView && !isOwnerViewing) {
      const updatedProfile = await this.prisma.publicProfile.update({
        where: { id: publicProfile.id },
        data: {
          viewCount: publicProfile.viewCount + 1,
        },
      });
      currentViewCount = updatedProfile.viewCount;
    }

    // Format posts to match frontend interface
    const formattedPosts = userPosts.map((post) => ({
      id: post.id,
      title: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
      excerpt: post.content.substring(0, 150),
      category: 'Bài viết',
      postDate: new Date(post.createdAt).toLocaleDateString('vi-VN'),
      engagement: {
        likes: post.likes.length,
        comments: post.comments.length,
        shares: 0,
      },
    }));

    // Get follower count for this user
    const followerCount = await this.prisma.follow.count({
      where: {
        followingId: publicProfile.profile.userId,
      },
    });

    return {
      ...publicProfile,
      viewCount: currentViewCount, // Use the accurate view count
      followerCount, // Add follower count
      profile: {
        ...publicProfile.profile,
        userPosts: formattedPosts,
      },
    };
  }

  // Toggle public profile visibility
  async togglePublicProfile(userId: string, isActive: boolean) {
    let publicProfile = await this.prisma.publicProfile.findUnique({
      where: { userId },
    });

    if (!publicProfile) {
      publicProfile = await this.getOrCreatePublicProfile(userId);
    }

    const updated = await this.prisma.publicProfile.update({
      where: { userId },
      data: { isActive },
      include: {
        profile: true,
      },
    });

    return updated;
  }

  // Helper function to format social links from JSON to array
  private formatSocialLinks(socialLinksData: any): any[] {
    if (!socialLinksData) return [];

    // If already an array, return it
    if (Array.isArray(socialLinksData)) {
      return socialLinksData;
    }

    // If it's an object (key-value pairs), convert to array
    if (typeof socialLinksData === 'object') {
      return Object.entries(socialLinksData).map(([platform, url], idx) => ({
        id: `${idx}`,
        platform,
        url: url as string,
      }));
    }

    return [];
  }

  // Get public profile by user ID
  async getPublicProfileByUserId(userId: string) {
    const publicProfile = await this.prisma.publicProfile.findUnique({
      where: { userId },
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                role: true,
                isVerified: true,
              },
            },
            employerProfile: {
              include: {
                jobPostings: true,
              },
            },
            careerProfile: {
              include: {
                experiences: {
                  orderBy: {
                    startDate: 'desc',
                  },
                },
                education: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                },
                skills: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!publicProfile) {
      throw new NotFoundException('Public profile not found');
    }

    if (!publicProfile.isActive) {
      throw new BadRequestException('This public profile is no longer active');
    }

    // Get user posts separately
    const userPosts = await this.prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        comments: true,
        likes: true,
      },
    });

    // Increment view count
    await this.prisma.publicProfile.update({
      where: { id: publicProfile.id },
      data: {
        viewCount: publicProfile.viewCount + 1,
      },
    });

    // Format posts to match frontend interface
    const formattedPosts = userPosts.map((post) => ({
      id: post.id,
      title: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
      excerpt: post.content.substring(0, 150),
      category: 'Bài viết',
      postDate: new Date(post.createdAt).toLocaleDateString('vi-VN'),
      engagement: {
        likes: post.likes.length,
        comments: post.comments.length,
        shares: 0,
      },
    }));

    return {
      ...publicProfile,
      profile: {
        ...publicProfile.profile,
        userPosts: formattedPosts,
      },
    };
  }
}

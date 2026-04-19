import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import {
  LoginDto,
  RegisterDto,
  LoginResponseDto,
  RegisterResponseDto,
} from './dto';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    // Check if user exists by email or phone
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { phone: registerDto.phone },
          { username: registerDto.username || registerDto.email.split('@')[0] },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Email, số điện thoại hoặc username đã được đăng ký',
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Generate username if not provided
    const username =
      registerDto.username ||
      `${(registerDto.firstName || '').toLowerCase()}${(
        registerDto.lastName || ''
      ).toLowerCase()}${Date.now()}`.replace(/\s+/g, '');

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username,
        phone: registerDto.phone,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: registerDto.role,
        birthDate: registerDto.birthDate
          ? new Date(registerDto.birthDate)
          : null,
        province: registerDto.province,
        school: registerDto.school,
        major: registerDto.major,
        companyName: registerDto.companyName,
        website: registerDto.website,
        address: registerDto.address,
        taxId: registerDto.taxId,
      },
    });

    // Create profile for the user
    let profile;
    try {
      profile = await this.prisma.profile.create({
        data: {
          userId: user.id,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          email: registerDto.email,
          phone: registerDto.phone,
          birthDate: registerDto.birthDate
            ? new Date(registerDto.birthDate)
            : null,
          province: registerDto.province,
          school: registerDto.school,
          major: registerDto.major,
        },
      });

      // Create CareerProfile for user role (students)
      if (registerDto.role === 'user' && profile) {
        const careerProfile = await this.prisma.careerProfile.create({
          data: {
            profileId: profile.id,
          },
        });

        // Create initial Education record if school/major is provided
        // Mapping: University (auth) → School, Major (auth) → Field
        if (registerDto.school || registerDto.major) {
          await this.prisma.education.create({
            data: {
              careerProfileId: careerProfile.id,
              school: registerDto.school || '',
              field: registerDto.major || null,
              degree: null, // Left blank as per requirement
              graduationYear: null, // Left blank as per requirement
            },
          });
        }
      }

      // Create EmployerProfile for employer role
      if (registerDto.role === 'employer' && profile) {
        await this.prisma.employerProfile.create({
          data: {
            profileId: profile.id,
            website: registerDto.website || null,
            address: registerDto.address || null,
          },
        });
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
      // Continue anyway - profile creation failure shouldn't block registration
    }

    // Create public profile for the user (for sharing)
    try {
      if (profile) {
        await this.prisma.publicProfile.create({
          data: {
            userId: user.id,
            profileId: profile.id,
            isActive: true,
          },
        });
      }
    } catch (error) {
      console.error('Failed to create public profile:', error);
      // Continue anyway - public profile creation failure shouldn't block registration
    }

    // Generate JWT token
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      { expiresIn: '7d' },
    );

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate ? user.birthDate.toISOString().split('T')[0] : null,
      role: user.role,
      accessToken,
      message: 'Đăng ký thành công',
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // Find user by email or phone
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: loginDto.emailOrPhone },
          { phone: loginDto.emailOrPhone },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Email/Số điện thoại hoặc mật khẩu không chính xác',
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Email/Số điện thoại hoặc mật khẩu không chính xác',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa');
    }

    // Generate JWT token
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      { expiresIn: '7d' },
    );

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      avatar: user.avatar || undefined,
      role: (user.role as 'user' | 'employer') || 'user',
      accessToken,
      birthDate: user.birthDate ? user.birthDate.toISOString().split('T')[0] : null,
      province: user.province || undefined,
      school: user.school || undefined,
      major: user.major || undefined,
      companyName: user.companyName || undefined,
      website: user.website || undefined,
      address: user.address || undefined,
      taxId: user.taxId || undefined,
      isVerified: user.isVerified,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      avatar: user.avatar || undefined,
      role: (user.role as 'user' | 'employer') || 'user',
      birthDate: user.birthDate ? user.birthDate.toISOString().split('T')[0] : null,
      province: user.province || undefined,
      school: user.school || undefined,
      major: user.major || undefined,
      companyName: user.companyName || undefined,
      website: user.website || undefined,
      address: user.address || undefined,
      taxId: user.taxId || undefined,
      isVerified: user.isVerified,
      isBanned: user.isBanned,
      bannedReason: user.bannedReason || undefined,
    };
  }

  // Forgot Password - Generate and send OTP
  async sendForgotPasswordOtp(
    emailOrPhone: string,
  ): Promise<{ message: string; success: boolean; email?: string }> {
    // Trim and validate input
    const input = emailOrPhone.trim();
    if (!input) {
      throw new BadRequestException('Vui lòng nhập email hoặc số điện thoại');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: input }, { phone: input }],
      },
    });

    if (!user) {
      // Return error message when user doesn't exist
      return {
        message: 'Email hoặc số điện thoại không tồn tại trong hệ thống',
        success: false,
      };
    }

    // ✅ ANTI-SPAM: Check per-email cooldown (1 minute)
    const cooldownMinutes = 1;
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const lastOtpSentAt = user.lastOtpSentAt;

    console.log(
      `[OTP-RATE-LIMIT] Email: ${user.email}, lastOtpSentAt: ${lastOtpSentAt?.toISOString() || 'null'}`,
    );

    if (lastOtpSentAt) {
      const timeSinceLastOtp = Date.now() - new Date(lastOtpSentAt).getTime();
      console.log(
        `[OTP-RATE-LIMIT] Time since last OTP: ${(timeSinceLastOtp / 1000).toFixed(1)}s, Cooldown: ${cooldownMinutes}m`,
      );

      if (timeSinceLastOtp < cooldownMs) {
        const secondsRemaining = Math.ceil(
          (cooldownMs - timeSinceLastOtp) / 1000,
        );
        const minutesRemaining = Math.ceil(secondsRemaining / 60);
        console.warn(
          `[OTP-RATE-LIMIT-BLOCKED] ${user.email} - Cooldown active. Wait ${minutesRemaining}m (${secondsRemaining}s)`,
        );
        throw new BadRequestException(
          `Vui lòng đợi ${minutesRemaining} phút trước khi yêu cầu mã OTP mới. (${secondsRemaining} giây)`,
        );
      }
    }

    console.log(
      `[OTP-RATE-LIMIT] ${user.email} - Cooldown check passed, sending OTP`,
    );

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP and track the request time
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiry,
        otpAttempts: 0,
        lastOtpSentAt: new Date(), // Record when OTP was sent for rate limiting
      },
    });

    // Send OTP via email (always send email, even if user input is phone number)
    try {
      await this.emailService.sendOtpEmail(
        user.email,
        otp,
        user.firstName || 'Người dùng',
      );
    } catch (error) {
      console.error('Lỗi gửi email:', error);
      throw new BadRequestException('Không thể gửi OTP. Vui lòng thử lại.');
    }

    return {
      message: 'Mã OTP đã được gửi về email của bạn',
      success: true,
      email: user.email, // Return email to frontend for display
    };
  }

  // Verify OTP
  async verifyForgotPasswordOtp(
    emailOrPhone: string,
    otp: string,
  ): Promise<{ resetToken: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    });

    if (!user) {
      throw new BadRequestException('Email/số điện thoại không hợp lệ');
    }

    // Check if OTP exists and not expired
    if (!user.otp || !user.otpExpiry) {
      throw new BadRequestException('OTP chưa được gửi hoặc đã hết hạn');
    }

    if (new Date() > user.otpExpiry) {
      throw new BadRequestException('OTP đã hết hạn');
    }

    if (user.otpAttempts >= 3) {
      throw new BadRequestException(
        'Quá nhiều lần nhập sai. Vui lòng yêu cầu OTP mới',
      );
    }

    if (user.otp !== otp) {
      // Increment attempts
      await this.prisma.user.update({
        where: { id: user.id },
        data: { otpAttempts: user.otpAttempts + 1 },
      });
      throw new BadRequestException('OTP không chính xác');
    }

    // Clear OTP after verification
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpiry: null,
        otpAttempts: 0,
      },
    });

    // Generate reset token (short-lived JWT)
    const resetToken = this.jwtService.sign(
      {
        sub: user.id,
        type: 'password-reset',
      },
      { expiresIn: '30m' },
    );

    return { resetToken };
  }

  // Reset Password
  async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      // Verify reset token
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decoded: any = this.jwtService.verify(resetToken);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (decoded.type !== 'password-reset') {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const userId: string = decoded.sub;

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { message: 'Mật khẩu đã được đặt lại thành công' };
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  // ========== CHANGE PASSWORD VIA OTP (For logged-in users from Settings) ==========

  // Send OTP to logged-in user's email for password change
  async sendChangePasswordOtp(
    userId: string,
  ): Promise<{ message: string; success: boolean; email?: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // Check per-email cooldown (1 minute)
    const cooldownMinutes = 1;
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const lastOtpSentAt = user.lastOtpSentAt;

    if (lastOtpSentAt) {
      const timeSinceLastOtp = Date.now() - new Date(lastOtpSentAt).getTime();
      if (timeSinceLastOtp < cooldownMs) {
        const secondsRemaining = Math.ceil(
          (cooldownMs - timeSinceLastOtp) / 1000,
        );
        throw new BadRequestException(
          `Vui lòng đợi ${secondsRemaining} giây trước khi yêu cầu mã OTP mới`,
        );
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiry,
        otpAttempts: 0,
        lastOtpSentAt: new Date(),
      },
    });

    // Send OTP via email
    try {
      await this.emailService.sendChangePasswordOtpEmail(
        user.email,
        otp,
        user.firstName || 'Người dùng',
      );
    } catch (error) {
      console.error('Lỗi gửi email:', error);
      throw new BadRequestException('Không thể gửi OTP. Vui lòng thử lại.');
    }

    // Mask email for display (e.g., t***@example.com)
    const emailParts = user.email.split('@');
    const maskedEmail =
      emailParts[0].charAt(0) +
      '***@' +
      emailParts[1];

    return {
      message: 'Mã OTP đã được gửi về email của bạn',
      success: true,
      email: maskedEmail,
    };
  }

  // Verify OTP for password change
  async verifyChangePasswordOtp(
    userId: string,
    otp: string,
  ): Promise<{ resetToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // Check if OTP exists and not expired
    if (!user.otp || !user.otpExpiry) {
      throw new BadRequestException('OTP chưa được gửi hoặc đã hết hạn');
    }

    if (new Date() > user.otpExpiry) {
      throw new BadRequestException('OTP đã hết hạn');
    }

    if (user.otpAttempts >= 3) {
      throw new BadRequestException(
        'Quá nhiều lần nhập sai. Vui lòng yêu cầu OTP mới',
      );
    }

    if (user.otp !== otp) {
      // Increment attempts
      await this.prisma.user.update({
        where: { id: user.id },
        data: { otpAttempts: user.otpAttempts + 1 },
      });
      throw new BadRequestException('OTP không chính xác');
    }

    // Clear OTP after verification
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpiry: null,
        otpAttempts: 0,
      },
    });

    // Generate reset token (short-lived JWT)
    const resetToken = this.jwtService.sign(
      {
        sub: user.id,
        type: 'password-reset',
      },
      { expiresIn: '30m' },
    );

    return { resetToken };
  }

  // Change password after OTP verification
  async changePassword(
    userId: string,
    resetToken: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      // Verify reset token
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decoded: any = this.jwtService.verify(resetToken);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (decoded.type !== 'password-reset') {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const tokenUserId: string = decoded.sub;

      // Ensure the token belongs to the requesting user
      if (tokenUserId !== userId) {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { message: 'Mật khẩu đã được thay đổi thành công' };
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}


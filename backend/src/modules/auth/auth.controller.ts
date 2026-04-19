import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, LoginResponseDto, RegisterResponseDto, SendOtpDto, VerifyOtpDto, ResetPasswordDto, ChangePasswordVerifyOtpDto, ChangePasswordDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.userId);
  }

  @Post('forgot-password/send-otp')
  @HttpCode(HttpStatus.OK)
  async sendForgotPasswordOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendForgotPasswordOtp(sendOtpDto.emailOrPhone);
  }

  @Post('forgot-password/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyForgotPasswordOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyForgotPasswordOtp(verifyOtpDto.emailOrPhone, verifyOtpDto.otp);
  }

  @Post('forgot-password/reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new Error('Mật khẩu không khớp');
    }
    return this.authService.resetPassword(resetPasswordDto.resetToken, resetPasswordDto.newPassword);
  }

  // ========== CHANGE PASSWORD VIA OTP (For logged-in users from Settings) ==========

  @Post('change-password/send-otp')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async sendChangePasswordOtp(@CurrentUser() user: any) {
    return this.authService.sendChangePasswordOtp(user.userId);
  }

  @Post('change-password/verify-otp')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async verifyChangePasswordOtp(
    @CurrentUser() user: any,
    @Body() verifyOtpDto: ChangePasswordVerifyOtpDto,
  ) {
    return this.authService.verifyChangePasswordOtp(user.userId, verifyOtpDto.otp);
  }

  @Post('change-password/reset')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new Error('Mật khẩu không khớp');
    }
    return this.authService.changePassword(
      user.userId,
      changePasswordDto.resetToken,
      changePasswordDto.newPassword,
    );
  }
}


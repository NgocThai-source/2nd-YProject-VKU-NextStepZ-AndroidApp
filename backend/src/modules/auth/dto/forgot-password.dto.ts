import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty({ message: 'Email hoặc số điện thoại là bắt buộc' })
  @IsString()
  emailOrPhone: string;
}

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'Email hoặc số điện thoại là bắt buộc' })
  @IsString()
  emailOrPhone: string;

  @IsNotEmpty({ message: 'OTP là bắt buộc' })
  @IsString()
  otp: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Reset token là bắt buộc' })
  @IsString()
  resetToken: string;

  @IsNotEmpty({ message: 'Mật khẩu mới là bắt buộc' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  newPassword: string;

  @IsNotEmpty({ message: 'Xác nhận mật khẩu là bắt buộc' })
  @IsString()
  confirmPassword: string;
}

// DTOs for Change Password (logged-in users via Settings page)
export class ChangePasswordVerifyOtpDto {
  @IsNotEmpty({ message: 'OTP là bắt buộc' })
  @IsString()
  otp: string;
}

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Reset token là bắt buộc' })
  @IsString()
  resetToken: string;

  @IsNotEmpty({ message: 'Mật khẩu mới là bắt buộc' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  newPassword: string;

  @IsNotEmpty({ message: 'Xác nhận mật khẩu là bắt buộc' })
  @IsString()
  confirmPassword: string;
}


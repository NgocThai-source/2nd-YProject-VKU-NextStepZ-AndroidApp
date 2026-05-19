package com.example.nextstepz.auth.data.model

data class RegisterRequest (
    val fullName: String,
    val email: String,
    val password: String,
)
data class LoginRequest (
    val email: String,
    val password: String,
)
data class ForgotPasswordRequest (
    val email: String,
)
data class VerifyOtpRequest (
    val email: String,
    val otp: String,
)
data class ResetPasswordRequest (
    val email: String,
    val newPassword: String,
)

data class CompleteProfileRequest(
    val role: String,

    // Common fields
    val contact_phone: String,
    val contact_email: String,

    // Student fields
    val dob: String? = null,
    val province_code: Int? = null,
    val university_id: Int? = null,
    val major: String? = null,
    val graduation_year: Int? = null,
    val gpa: Double? = null,
    val bio: String = "",
    val cv_url: String? = null,
    val contact_full_name: String? = null,

    // Employer fields
    val company_name: String? = null,
    val tax_code: String? = null,
    val company_address: String? = null,
    val employer_name: String? = null,
    val industry: String? = null
)
data class UpdateEmailRequest(
    val userId: String,
    val newEmail: String,
)

data class UpdatePasswordRequest(
    val userId: String,
    val currentPassword: String,
    val newPassword: String,
)

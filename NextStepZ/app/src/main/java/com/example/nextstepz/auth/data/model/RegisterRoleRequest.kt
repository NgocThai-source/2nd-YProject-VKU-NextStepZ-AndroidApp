package com.example.nextstepz.auth.data.model

data class RegisterRoleRequest(
    val userId: String,
    val role: String,
)

data class StudentRegistrationRequest(
    val userId: String,
    val fullName: String,
    val dateOfBirth: String,
    val phone: String,
    val email: String,
    val province: String,
    val university: String,
    val major: String,
    val graduationYear: Int,
    val gpa: Double,
)

data class EmployerRegistrationRequest(
    val userId: String,
    val companyName: String,
    val companyAddress: String,
    val recruiterName: String,
    val phone: String,
    val email: String,
    val taxCode: String,
    val field: String,
)

data class ApiResponse(
    override val success: Boolean,
    override val message: String,
) : BaseResponse

data class UpdateEmailRequest(
    val userId: String,
    val newEmail: String,
)

data class UpdatePasswordRequest(
    val userId: String,
    val currentPassword: String,
    val newPassword: String,
)

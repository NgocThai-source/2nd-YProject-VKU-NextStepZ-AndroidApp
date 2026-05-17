package com.example.nextstepz.auth.data.model

data class UserData(
    val userId: String,
    val name: String,
    val email: String,
    val phone: String? = null,
    val role: String? = null,
    val avatar: String? = null,
    val university: String? = null,
    val major: String? = null,
    val graduationYear: Int? = null,
    val gpa: Double? = null,
    val companyName: String? = null,
    val taxCode: String? = null,
    val field: String? = null,
    val isVerified: Boolean = false
)

enum class UserRole(val value: String, val displayName: String) {
    GUEST("guest", "Khách vãng lai"),
    STUDENT("student", "Sinh viên"),
    EMPLOYER("employer", "Nhà tuyển dụng");

    companion object {
        fun fromValue(value: String?): UserRole {
            return entries.find { it.value == value } ?: GUEST
        }
    }
}

package com.example.nextstepz.auth.data.model

interface BaseResponse {
    val success: Boolean
    val message: String
}

data class SimpleResponse(
    override val success: Boolean,
    override val message: String
) : BaseResponse

data class RegisterResponse(
    override val success: Boolean,
    override val message: String,
    val userData: UserData?
) : BaseResponse

data class LoginResponse(
    override val success: Boolean,
    override val message: String,
    val token: String? = null,
    val userId: String? = null,
    val userData: UserData? = null
) : BaseResponse

data class ForgotPasswordResponse(
    override val success: Boolean,
    override val message: String,
) : BaseResponse

data class ProvinceItem(
    val code: Int,
    val name: String
)
data class ProvinceListResponse(
    override val success: Boolean,
    override val message: String,
    val data: List<ProvinceItem>
) : BaseResponse

data class UniversityItem(
    val id: Int,
    val name: String,
    val short_name: String?
)

data class UniversityListResponse(
    override val success: Boolean,
    override val message: String,
    val data: List<UniversityItem>
) : BaseResponse
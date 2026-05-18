package com.example.nextstepz.auth.data.remote

import com.example.nextstepz.auth.data.model.BaseResponse
import com.example.nextstepz.auth.data.model.CompleteProfileRequest
import com.example.nextstepz.auth.data.model.ForgotPasswordRequest
import com.example.nextstepz.auth.data.model.ForgotPasswordResponse
import com.example.nextstepz.auth.data.model.LoginRequest
import com.example.nextstepz.auth.data.model.LoginResponse
import com.example.nextstepz.auth.data.model.ProvinceListResponse
import com.example.nextstepz.auth.data.model.RegisterRequest
import com.example.nextstepz.auth.data.model.RegisterResponse
import com.example.nextstepz.auth.data.model.ResetPasswordRequest
import com.example.nextstepz.auth.data.model.SimpleResponse
import com.example.nextstepz.auth.data.model.UniversityListResponse
import com.example.nextstepz.auth.data.model.UpdateEmailRequest
import com.example.nextstepz.auth.data.model.UpdatePasswordRequest
import com.example.nextstepz.auth.data.model.VerifyOtpRequest
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface AuthApi {
    @POST("api/auth/register")
    suspend fun register(@Body registerRequest: RegisterRequest): RegisterResponse
    @POST("api/auth/login")
    suspend fun login(@Body loginRequest: LoginRequest): LoginResponse

    @POST("api/forgot-password")
    suspend fun forgotPassword(@Body forgotPasswordRequest: ForgotPasswordRequest): ForgotPasswordResponse

    @POST("api/verify-otp")
    suspend fun verifyOtp(@Body verifyOtpRequest: VerifyOtpRequest): ForgotPasswordResponse
    @POST("api/reset-password")
    suspend fun ResetPassword(@Body resetPasswordRequest: ResetPasswordRequest): ForgotPasswordResponse

    @GET("api/provinces")
    suspend fun getProvinces(): ProvinceListResponse
    @GET("api/universities/province/{provinceCode}")
    suspend fun getUniversitiesByProvince(@Path("provinceCode") provinceCode: Int): UniversityListResponse

    @POST("api/profile/{profileId}")
    suspend fun completeProfile(@Path("profileId") profileId: String, @Body request: CompleteProfileRequest): SimpleResponse

    @PUT("api/users/update-email")
    suspend fun updateEmail(@Body request: UpdateEmailRequest): SimpleResponse

    @PUT("api/users/update-password")
    suspend fun updatePassword(@Body request: UpdatePasswordRequest): SimpleResponse

    @POST("api/auth/logout")
    suspend fun logout(@Body userId: String): SimpleResponse
}

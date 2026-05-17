package com.example.nextstepz.auth.data.remote

import com.example.nextstepz.auth.data.model.ApiResponse
import com.example.nextstepz.auth.data.model.EmployerRegistrationRequest
import com.example.nextstepz.auth.data.model.ForgotPasswordRequest
import com.example.nextstepz.auth.data.model.ForgotPasswordResponse
import com.example.nextstepz.auth.data.model.LoginRequest
import com.example.nextstepz.auth.data.model.LoginResponse
import com.example.nextstepz.auth.data.model.RegisterRequest
import com.example.nextstepz.auth.data.model.RegisterResponse
import com.example.nextstepz.auth.data.model.ResetPasswordRequest
import com.example.nextstepz.auth.data.model.StudentRegistrationRequest
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

    @GET("api/users/{userId}")
    suspend fun getUserProfile(@Path("userId") userId: String): ApiResponse

    @POST("api/auth/register-student")
    suspend fun registerStudent(@Body request: StudentRegistrationRequest): ApiResponse

    @POST("api/auth/register-employer")
    suspend fun registerEmployer(@Body request: EmployerRegistrationRequest): ApiResponse

    @PUT("api/users/update-email")
    suspend fun updateEmail(@Body request: UpdateEmailRequest): ApiResponse

    @PUT("api/users/update-password")
    suspend fun updatePassword(@Body request: UpdatePasswordRequest): ApiResponse

    @POST("api/auth/logout")
    suspend fun logout(@Body userId: String): ApiResponse
}

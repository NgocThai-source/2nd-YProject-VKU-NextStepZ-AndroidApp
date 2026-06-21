package com.example.nextstepz.auth.data.repository

import android.content.Context
import com.example.nextstepz.auth.data.model.ForgotPasswordRequest
import com.example.nextstepz.auth.data.model.ForgotPasswordResponse
import com.example.nextstepz.auth.data.model.LoginRequest
import com.example.nextstepz.auth.data.model.LoginResponse
import com.example.nextstepz.auth.data.model.RegisterRequest
import com.example.nextstepz.auth.data.model.RegisterResponse
import com.example.nextstepz.auth.data.model.ResetPasswordRequest
import com.example.nextstepz.auth.data.model.VerifyOtpRequest
import com.example.nextstepz.auth.data.remote.RetrofitClientAuth
import org.json.JSONObject
import retrofit2.HttpException


class AuthRepository(private  val context: Context) {
    suspend fun register(request: RegisterRequest): RegisterResponse {
        return RetrofitClientAuth.getAuthApiInterface(context).register(request)
    }
    suspend fun login(request: LoginRequest): LoginResponse {
        return try {
            // Gọi API lên máy chủ
            val response = RetrofitClientAuth.getAuthApiInterface(context).login(request)

            // Nếu code chạy đến đây tức là Backend trả về 200 OK (Thành công)
            if (response.success && !response.token.isNullOrEmpty()) {
                val sharedPreferences = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
                sharedPreferences.edit().putString("ACCESS_TOKEN", response.token).apply()
                sharedPreferences.edit().putString("USER_ID", response.userData?.userId).apply()
            }

            // Trả kết quả về cho ViewModel
            response

        } catch (e: Exception) {
            e.printStackTrace()
            if (e is HttpException) {
                val errorBody = e.response()?.errorBody()?.string()

                // Bóc tách JSON để lấy chữ "ACCOUNT_REJECTED: ..."
                val errorMessage = try {
                    val jsonObject = JSONObject(errorBody ?: "")
                    val rawMessage = jsonObject.getString("message")

                    // Dọn dẹp câu chữ cho user dễ đọc (Xóa cái mã thừa đi)
                    rawMessage.replace("ACCOUNT_REJECTED: ", "")
                } catch (parseException: Exception) {
                    "Đăng nhập thất bại. Vui lòng thử lại."
                }

                // Tự tạo và trả về một LoginResponse thất bại để executeAuthAction bắt được
                LoginResponse(
                    success = false,
                    message = errorMessage,
                    token = null,
                    userData = null
                )
            }
            // NẾU RỚT MẠNG HOẶC SERVER ĐÓNG CỬA
            else {
                LoginResponse(
                    success = false,
                    message = "Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.",
                    token = null,
                    userData = null
                )
            }
        }
    }
    suspend fun forgotPassword(request: ForgotPasswordRequest): ForgotPasswordResponse {
        return RetrofitClientAuth.getAuthApiInterface(context).forgotPassword(request)
    }

    suspend fun verifyOtp(request: VerifyOtpRequest): ForgotPasswordResponse {
        return RetrofitClientAuth.getAuthApiInterface(context).verifyOtp(request)
    }

    suspend fun resetPassword(request: ResetPasswordRequest): ForgotPasswordResponse {
        return RetrofitClientAuth.getAuthApiInterface(context).ResetPassword(request)
    }
}
package com.example.nextstepz.ui.screens.auth

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.auth.data.model.LoginRequest
import com.example.nextstepz.auth.data.model.RegisterRequest
import com.example.nextstepz.auth.data.remote.RetrofitClient
import com.example.nextstepz.auth.data.repository.AuthRepository
import kotlinx.coroutines.launch
import org.json.JSONObject
import retrofit2.HttpException

class AuthViewModel: ViewModel() {
    private val authRepository = AuthRepository()
    var authState by mutableStateOf<AuthState>(AuthState.Idle)
    private set

    fun register(request: RegisterRequest) {
        viewModelScope.launch {
            authState = AuthState.Loading
            try {
                // Gửi dữ liệu lên Server
                val response = authRepository.register(request)

                // Nếu Server trả về 200 OK
                if (response.success) {
                    authState = AuthState.Success(response.message)

                } else {
                    authState = AuthState.Error(response.message)

                }

            } catch (e: HttpException) {
                // 🚨 BƯỚC QUAN TRỌNG: BẮT LỖI 400 TỪ NODE.JS Ở ĐÂY
                val errorBodyString = e.response()?.errorBody()?.string()

                val messageFromServer = try {
                    // Bóc tách JSON Node.js gửi về để lấy chữ "message"
                    val jsonObject = JSONObject(errorBodyString ?: "")
                    jsonObject.getString("message")
                } catch (jsonException: Exception) {
                    "Lỗi định dạng dữ liệu từ Server"
                }

                // Gán đúng câu chửi của Node.js lên màn hình
                authState = AuthState.Error(messageFromServer)

            } catch (e: Exception) {
                // Lỗi đứt cáp, mất mạng wifi...
                authState = AuthState.Error("Đã xảy ra lỗi kết nối: ${e.message}")

            }
        }
    }

    fun login(request: LoginRequest) {
        viewModelScope.launch {
            authState = AuthState.Loading
            try {
                // Gửi dữ liệu lên Server
                val response = authRepository.login(request)

                // Nếu Server trả về 200 OK
                if (response.success) {
                    authState = AuthState.Success(response.message)

                } else {
                    authState = AuthState.Error(response.message)

                }

            } catch (e: HttpException) {
                // 🚨 BƯỚC QUAN TRỌNG: BẮT LỖI 400 TỪ NODE.JS Ở ĐÂY
                val errorBodyString = e.response()?.errorBody()?.string()

                val messageFromServer = try {
                    // Bóc tách JSON Node.js gửi về để lấy chữ "message"
                    val jsonObject = JSONObject(errorBodyString ?: "")
                    jsonObject.getString("message")
                } catch (jsonException: Exception) {
                    "Lỗi định dạng dữ liệu từ Server"
                }

                // Gán đúng câu chửi của Node.js lên màn hình
                authState = AuthState.Error(messageFromServer)

            } catch (e: Exception) {
                // Lỗi đứt cáp, mất mạng wifi...
                authState = AuthState.Error("Đã xảy ra lỗi kết nối: ${e.message}")

            }
        }
    }

    fun resetState() {
    authState = AuthState.Idle
    }
}
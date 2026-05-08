import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nextstepz.auth.data.model.BaseResponse
import com.example.nextstepz.auth.data.model.ForgotPasswordRequest
import com.example.nextstepz.auth.data.model.LoginRequest
import com.example.nextstepz.auth.data.model.RegisterRequest
import com.example.nextstepz.auth.data.model.ResetPasswordRequest
import com.example.nextstepz.auth.data.model.VerifyOtpRequest
import com.example.nextstepz.auth.data.repository.AuthRepository
import com.example.nextstepz.ui.screens.auth.AuthState
import kotlinx.coroutines.launch
import org.json.JSONObject
import retrofit2.HttpException

class AuthViewModel : ViewModel() {
    private val authRepository = AuthRepository()
    var authState by mutableStateOf<AuthState>(AuthState.Idle)
        private set

    // SỬ DỤNG GENERICS: <T : BaseResponse>
    private fun <T : BaseResponse> executeAuthAction(apiCall: suspend () -> T) {
        viewModelScope.launch {
            authState = AuthState.Loading
            try {
                // Gọi API
                val response = apiCall()

                // Trực tiếp gọi thuộc tính, KHÔNG dùng Reflection
                if (response.success) {
                    authState = AuthState.Success(response.message)
                } else {
                    authState = AuthState.Error(response.message)
                }

            } catch (e: HttpException) {
                // Xử lý lỗi từ Node.js (Vẫn giữ nguyên, chạy rất tốt)
                val errorBodyString = e.response()?.errorBody()?.string()
                val messageFromServer = try {
                    JSONObject(errorBodyString ?: "").getString("message")
                } catch (jsonException: Exception) {
                    "Lỗi định dạng dữ liệu từ Server"
                }
                authState = AuthState.Error(messageFromServer)

            } catch (e: Exception) {
                authState = AuthState.Error("Đã xảy ra lỗi kết nối: ${e.message}")
            }
        }
    }

    // Các hàm gọi API của bạn sẽ ngắn gọn và sạch sẽ như thế này:
    fun register(request: RegisterRequest) = executeAuthAction { authRepository.register(request) }

    fun login(request: LoginRequest) = executeAuthAction { authRepository.login(request) }

    fun forgotPassword(request: ForgotPasswordRequest) = executeAuthAction { authRepository.forgotPassword(request) }

    fun verifyOtp(request: VerifyOtpRequest) = executeAuthAction { authRepository.verifyOtp(request) }

    fun resetPassword(request: ResetPasswordRequest) = executeAuthAction { authRepository.resetPassword(request) }

    fun resetState() {
        authState = AuthState.Idle
    }
}
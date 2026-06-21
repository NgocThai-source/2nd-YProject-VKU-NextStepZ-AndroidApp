import android.content.Context
import android.content.Intent
import com.example.nextstepz.MainActivity
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(private val context: Context) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val sharedPref = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
        val token = sharedPref.getString("ACCESS_TOKEN", null)
        val request = chain.request()
        val requestBuilder = request.newBuilder()

        if (!token.isNullOrEmpty()) {
            requestBuilder.addHeader("Authorization", "Bearer $token")
        }

        val response = chain.proceed(requestBuilder.build())

        // Lấy đường dẫn của API đang gọi để kiểm tra
        val urlPath = request.url.encodedPath
        val isAuthRoute = urlPath.contains("login") || urlPath.contains("register")

        var shouldLogout = false
        var logoutMessage = ""

        // NẾU PHÁT HIỆN LỖI 401 (HẾT HẠN TOKEN)
        if (response.code == 401 && !isAuthRoute) {
            shouldLogout = true
            logoutMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
        }
        // NẾU PHÁT HIỆN LỖI 403 (KHÓA TÀI KHOẢN TỪ ADMIN)
        else if (response.code == 403 && !isAuthRoute) {
            // DÙNG peekBody ĐỂ ĐỌC DATA MÀ KHÔNG LÀM MẤT DỮ LIỆU GỐC
            val responseBodyString = response.peekBody(Long.MAX_VALUE).string()

            if (responseBodyString.contains("ACCOUNT_LOCKED")) {
                shouldLogout = true
                logoutMessage = "Tài khoản của bạn đã bị vô hiệu hóa."
            }
        }

        // THỰC THI ĐĂNG XUẤT NẾU DÍNH 1 TRONG 2 LỖI TRÊN
        if (shouldLogout) {
            // Xóa toàn bộ dữ liệu trong SharedPreferences (Token, ID, Role...)
            sharedPref.edit().clear().apply()

            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                // Truyền thêm câu thông báo lỗi để hiển thị lên màn hình Login
                putExtra("LOGOUT_MESSAGE", logoutMessage)
            }
            context.startActivity(intent)
        }

        return response
    }
}
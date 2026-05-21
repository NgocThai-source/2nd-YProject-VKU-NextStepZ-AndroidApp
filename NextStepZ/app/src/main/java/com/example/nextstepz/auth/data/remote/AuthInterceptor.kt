import android.content.Context
import okhttp3.Interceptor
import okhttp3.Response
import android.content.Intent
import com.example.nextstepz.MainActivity

class AuthInterceptor(private val context: Context) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val sharedPref = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
        val token = sharedPref.getString("ACCESS_TOKEN", null)

        val requestBuilder = chain.request().newBuilder()
        if (!token.isNullOrEmpty()) {
            requestBuilder.addHeader("Authorization", "Bearer $token")
        }

        // Thực thi request
        val response = chain.proceed(requestBuilder.build())

        // NẾU PHÁT HIỆN LỖI 401 (HẾT HẠN TOKEN) TỪ NODE.JS
        if (response.code == 401) {
            // 1. Xóa token cũ đi
            sharedPref.edit().remove("ACCESS_TOKEN").apply()

            // 2. Bắn user về màn hình Login (Dùng Intent với cờ xóa BackStack)
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            context.startActivity(intent)
        }

        return response
    }
}
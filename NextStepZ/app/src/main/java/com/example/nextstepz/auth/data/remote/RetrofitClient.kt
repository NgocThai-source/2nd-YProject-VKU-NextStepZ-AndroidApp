package com.example.nextstepz.auth.data.remote

import AuthInterceptor
import android.content.Context
import com.example.nextstepz.auth.data.remote.AuthApi
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    private const val BASE_URL = "http://10.0.2.2:5000/"

    // Biến lưu trữ Singleton để không phải tạo lại nhiều lần
    @Volatile
    private var instance: AuthApi? = null

    // Đổi thành hàm nhận Context
    fun getApiInterface(context: Context): AuthApi {
        return instance ?: synchronized(this) {

            val loggingInterceptor = HttpLoggingInterceptor().apply {
                // LEVEL.BODY sẽ in ra TẤT CẢ mọi thứ: Headers (chứa Token) và Body (chứa data)
                level = HttpLoggingInterceptor.Level.BODY
            }
            // 1. Khởi tạo OkHttpClient và nhét AuthInterceptor vào
            // Lưu ý: Dùng context.applicationContext để tránh rò rỉ bộ nhớ (Memory Leak)
            val okHttpClient = OkHttpClient.Builder()
                .addInterceptor(AuthInterceptor(context.applicationContext))
                .addInterceptor(loggingInterceptor)
                .build()

            // 2. Khởi tạo Retrofit và gắn cái OkHttpClient vừa tạo ở trên vào
            val retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(okHttpClient) // <--- Bước quan trọng nhất là đây!
                .addConverterFactory(GsonConverterFactory.create())
                .build()

            // 3. Tạo ApiInterface và gán vào biến instance
            retrofit.create(AuthApi::class.java).also { instance = it }
        }
    }
}
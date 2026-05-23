package com.example.nextstepz.chat.data.remote

import AuthInterceptor
import android.content.Context
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClientChat {
    private const val BASE_URL = "http://10.0.2.2:5000/"
    @Volatile
    private var instanceChatApi: ChatApi? = null
    fun getChatApiInterface(context: Context): ChatApi {
        return instanceChatApi ?: synchronized(this) {

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
            retrofit.create(ChatApi::class.java).also { instanceChatApi = it }
        }
    }
}
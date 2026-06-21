package com.example.nextstepz.posthistory.data.remote

import com.example.nextstepz.notifications.data.remote.NotificationSupabaseConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

/** Retrofit client for the Post History feature (reuses the Supabase config). */
object PostHistoryClient {

    val api: PostHistoryApi by lazy {
        val authInterceptor = okhttp3.Interceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("apikey", NotificationSupabaseConfig.API_KEY)
                .addHeader("Authorization", "Bearer ${NotificationSupabaseConfig.API_KEY}")
                .addHeader("Accept", "application/json")
                .build()
            chain.proceed(request)
        }

        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BASIC
        }

        val client = OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(logging)
            .build()

        Retrofit.Builder()
            .baseUrl(NotificationSupabaseConfig.BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(PostHistoryApi::class.java)
    }
}

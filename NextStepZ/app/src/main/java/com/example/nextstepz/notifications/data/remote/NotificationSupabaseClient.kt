package com.example.nextstepz.notifications.data.remote

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

/**
 * Retrofit client pointed at the Supabase PostgREST endpoint, dedicated to the
 * Notifications feature. Every request carries the Supabase apikey + bearer.
 */
object NotificationSupabaseClient {

    val api: NotificationApi by lazy {
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
            .create(NotificationApi::class.java)
    }
}

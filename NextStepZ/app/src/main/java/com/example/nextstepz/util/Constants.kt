package com.example.nextstepz.util

// Constants - Hang so dung chung trong ung dung
object Constants {

    // Base URL backend API (NestJS)
    // Tren Android Emulator, 10.0.2.2 tro ve localhost cua may host
    const val BASE_URL = "http://10.0.2.2:3001/api/"

    // DataStore preferences name
    const val DATASTORE_NAME = "nextstepz_prefs"

    // Token keys
    const val KEY_ACCESS_TOKEN = "access_token"
    const val KEY_USER_ID = "user_id"
    const val KEY_USER_ROLE = "user_role"
}

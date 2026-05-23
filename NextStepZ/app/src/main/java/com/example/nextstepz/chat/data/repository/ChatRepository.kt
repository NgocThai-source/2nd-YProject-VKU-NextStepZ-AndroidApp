package com.example.nextstepz.chat.data.repository

import android.content.Context
import com.example.nextstepz.chat.data.model.CreateConversationRequest
import com.example.nextstepz.chat.data.model.CreateConversationResponse
import com.example.nextstepz.chat.data.model.MessageResponse
import com.example.nextstepz.chat.data.model.MyConversationResponse
import com.example.nextstepz.chat.data.remote.RetrofitClientChat

class ChatRepository(private val context: Context) {

    // 1. LẤY DANH SÁCH CUỘC TRÒ CHUYỆN
    suspend fun getConversations(): Result<MyConversationResponse> {
        return try {
            // Chờ Retrofit lấy data về
            val response = RetrofitClientChat.getChatApiInterface(context).getConversations()
            // Thành công thì bọc vào Result.success
            Result.success(response)
        } catch (e: Exception) {
            // Lỗi mạng, sập server... thì bọc vào Result.failure
            Result.failure(e)
        }
    }

    // 2. LẤY LỊCH SỬ TIN NHẮN
    suspend fun getMessages(conversationId: String, page: Int = 1, limit: Int = 50): Result<MessageResponse> {
        return try {
            val response = RetrofitClientChat.getChatApiInterface(context).getMessages(conversationId, page, limit)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // 3. TẠO HOẶC LẤY PHÒNG CHAT
    suspend fun createOrGetConversation(partnerProfileId: String): Result<CreateConversationResponse> {
        return try {
            // Tự động đóng gói chuỗi String thành Request Object ở ngay tầng Repo
            val request = CreateConversationRequest(partnerProfileId)
            val response = RetrofitClientChat.getChatApiInterface(context).createOrGetConversation(request)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
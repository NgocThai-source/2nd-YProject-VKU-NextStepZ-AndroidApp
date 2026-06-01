package com.example.nextstepz.chat.data.model

import com.google.gson.annotations.SerializedName

data class CreateConversationRequest(
    @SerializedName("partnerProfileId") val partnerProfileId: String
)
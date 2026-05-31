package com.example.nextstepz.feeds.data.model

data class CreatePostRequest(
    val content: String,
    val type: String,
    val skillTags: List<String> = emptyList()
)

data class CreateCommentRequest(
    val content: String
)

data class ReportRequest(
    val reason: String,
    val customText: String = ""
)

data class UserReportRequest(
    val reason: String,
    val customText: String = ""
)
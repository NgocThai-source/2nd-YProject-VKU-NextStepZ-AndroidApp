package com.example.nextstepz.data.repository

import com.example.nextstepz.data.model.NotificationCategory
import com.example.nextstepz.data.model.NotificationIconType
import com.example.nextstepz.data.model.NotificationItem
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class NotificationRepository {

    private val _notifications = MutableStateFlow(getMockNotifications())
    val notifications: StateFlow<List<NotificationItem>> = _notifications.asStateFlow()

    fun getMockNotifications(): List<NotificationItem> = listOf(
        // === Bài viết ===
        NotificationItem(
            id = 1,
            category = NotificationCategory.POST,
            iconType = NotificationIconType.SUCCESS,
            title = "Đăng bài thành công",
            message = "Bài viết \"Kỹ năng phỏng vấn xin việc hiệu quả\" đã được đăng thành công.",
            timestamp = "5 phút trước",
            isRead = false
        ),
        NotificationItem(
            id = 2,
            category = NotificationCategory.POST,
            iconType = NotificationIconType.WARNING,
            title = "Bài viết đã bị xóa",
            message = "Bài viết \"Cách viết CV gây ấn tượng\" của bạn đã bị xóa vì vi phạm nội dung không phù hợp.",
            timestamp = "30 phút trước",
            isRead = false
        ),
        NotificationItem(
            id = 3,
            category = NotificationCategory.POST,
            iconType = NotificationIconType.COMMENT,
            title = "Bình luận mới",
            message = "Người dùng \"Nguyễn Minh\" đã bình luận bài viết \"5 sai lầm khi tìm việc\" của bạn.",
            timestamp = "1 giờ trước",
            isRead = false
        ),
        NotificationItem(
            id = 4,
            category = NotificationCategory.POST,
            iconType = NotificationIconType.HEART,
            title = "Thích bài viết",
            message = "Người dùng \"Trần Thị Lan\" đã thích bài viết \"Kinh nghiệm thực tập lần đầu\" của bạn.",
            timestamp = "2 giờ trước",
            isRead = true
        ),
        NotificationItem(
            id = 5,
            category = NotificationCategory.POST,
            iconType = NotificationIconType.COMMENT,
            title = "Bình luận mới",
            message = "Người dùng \"Lê Hoàng\" đã bình luận bài viết \"Cách viết CV gây ấn tượng\" của bạn.",
            timestamp = "3 giờ trước",
            isRead = true
        ),

        // === Tài khoản ===
        NotificationItem(
            id = 6,
            category = NotificationCategory.ACCOUNT,
            iconType = NotificationIconType.APPROVED,
            title = "Yêu cầu nhà tuyển dụng được duyệt",
            message = "Yêu cầu trở thành nhà tuyển dụng của bạn đã được duyệt. Bây giờ bạn có thể đăng tin tuyển dụng và quản lý hồ sơ ứng viên trên hệ thống (Mục tài khoản).",
            timestamp = "1 ngày trước",
            isRead = false
        ),
        NotificationItem(
            id = 7,
            category = NotificationCategory.ACCOUNT,
            iconType = NotificationIconType.APPROVED,
            title = "Yêu cầu sinh viên được duyệt",
            message = "Yêu cầu trở thành sinh viên của bạn đã được duyệt. Bây giờ bạn có thể ứng tuyển và quản lý hồ sơ CV trên hệ thống (Mục tài khoản).",
            timestamp = "1 ngày trước",
            isRead = true
        ),
        NotificationItem(
            id = 8,
            category = NotificationCategory.ACCOUNT,
            iconType = NotificationIconType.LOCK,
            title = "Tài khoản bị khóa",
            message = "Tài khoản của bạn đã bị khóa vì lý do vi phạm điều khoản sử dụng. Vui lòng liên hệ hỗ trợ.",
            timestamp = "2 ngày trước",
            isRead = true
        ),
        NotificationItem(
            id = 9,
            category = NotificationCategory.ACCOUNT,
            iconType = NotificationIconType.UNLOCK,
            title = "Tài khoản đã được mở khóa",
            message = "Tài khoản của bạn đã được mở khóa. Bạn có thể đăng nhập và sử dụng bình thường.",
            timestamp = "1 tuần trước",
            isRead = true
        ),

        // === Việc làm ===
        NotificationItem(
            id = 10,
            category = NotificationCategory.JOB,
            iconType = NotificationIconType.WARNING,
            title = "Bài tuyển dụng đã bị xóa",
            message = "Bài tuyển dụng \"Lập trình viên Android\" của bạn đã bị xóa vì vi phạm nội dung spam.",
            timestamp = "2 ngày trước",
            isRead = false
        ),
        NotificationItem(
            id = 11,
            category = NotificationCategory.JOB,
            iconType = NotificationIconType.JOB,
            title = "Đơn ứng tuyển mới",
            message = "Bài tuyển dụng \"Thực tập sinh Backend\" vừa có sinh viên gửi đơn ứng tuyển \"Phạm Văn Đức\". Vui lòng kiểm tra quản lý hồ sơ ứng tuyển.",
            timestamp = "1 ngày trước",
            isRead = false
        ),
        NotificationItem(
            id = 12,
            category = NotificationCategory.JOB,
            iconType = NotificationIconType.SUCCESS,
            title = "Ứng tuyển thành công",
            message = "Bạn đã ứng tuyển thành công vào vị trí \"Nhân viên kinh doanh\" tại Công ty ABC.",
            timestamp = "3 ngày trước",
            isRead = true
        ),
        NotificationItem(
            id = 13,
            category = NotificationCategory.JOB,
            iconType = NotificationIconType.APPROVED,
            title = "Đơn ứng tuyển được chấp nhận",
            message = "Hồ sơ ứng tuyển của bạn cho vị trí \"Thực tập sinh Frontend\" đã được chấp nhận. Vui lòng kiểm tra tin nhắn.",
            timestamp = "4 ngày trước",
            isRead = true
        ),
        NotificationItem(
            id = 14,
            category = NotificationCategory.JOB,
            iconType = NotificationIconType.REJECTED,
            title = "Đơn ứng tuyển bị từ chối",
            message = "Hồ sơ ứng tuyển của bạn cho vị trí \"Lập trình viên Java\" đã bị từ chối. Vui lòng kiểm tra tin nhắn.",
            timestamp = "5 ngày trước",
            isRead = true
        )
    )

    fun markAsRead(id: Int) {
        _notifications.value = _notifications.value.map { item ->
            if (item.id == id) item.copy(isRead = true) else item
        }
    }

    fun markAllAsRead() {
        _notifications.value = _notifications.value.map { item ->
            item.copy(isRead = true)
        }
    }

    fun getUnreadCount(): Int = _notifications.value.count { !it.isRead }
}

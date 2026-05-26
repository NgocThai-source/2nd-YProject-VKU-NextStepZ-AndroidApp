package com.example.nextstepz.feeds.applications.data.repository

import com.example.nextstepz.feeds.applications.data.model.Application
import com.example.nextstepz.feeds.applications.data.model.ApplicationStatus
import kotlinx.coroutines.delay

class ApplicationRepository {

    private val mockApplications = getMockApplications().toMutableList()

    suspend fun getApplications(): Result<List<Application>> {
        delay(500)
        return Result.success(mockApplications.toList())
    }

    suspend fun getApplicationById(id: String): Result<Application?> {
        delay(300)
        return Result.success(mockApplications.find { it.id == id })
    }

    suspend fun updateApplicationStatus(appId: String, newStatus: ApplicationStatus): Result<Application> {
        delay(400)
        val index = mockApplications.indexOfFirst { it.id == appId }
        if (index == -1) return Result.failure(Exception("Không tìm thấy đơn ứng tuyển"))

        val updated = mockApplications[index].copy(status = newStatus)
        mockApplications[index] = updated
        return Result.success(updated)
    }

    suspend fun updateApplicationNotes(appId: String, notes: String): Result<Application> {
        delay(300)
        val index = mockApplications.indexOfFirst { it.id == appId }
        if (index == -1) return Result.failure(Exception("Không tìm thấy đơn ứng tuyển"))

        val updated = mockApplications[index].copy(notes = notes)
        mockApplications[index] = updated
        return Result.success(updated)
    }

    suspend fun deleteApplication(appId: String): Result<Unit> {
        delay(400)
        val removed = mockApplications.removeAll { it.id == appId }
        return if (removed) Result.success(Unit) else Result.failure(Exception("Không tìm thấy đơn ứng tuyển"))
    }

    private fun getMockApplications(): List<Application> = listOf(
        Application(
            id = "app_1",
            studentName = "Nguyễn Văn Minh",
            studentEmail = "minhnv.dev@gmail.com",
            studentPhone = "0901 234 567",
            cvUrl = "https://example.com/cv/minhnv.pdf",
            jobId = "job_2",
            jobTitle = "Flutter Developer",
            companyName = "NextStepZ Team",
            appliedAt = "2026-05-26",
            status = ApplicationStatus.Pending,
            coverLetter = "Em rất quan tâm đến vị trí Flutter Developer tại NextStepZ. Với kinh nghiệm 1 năm phát triển ứng dụng di động, em tự tin có thể đóng góp tích cực vào đội ngũ.",
            notes = "",
            resumeFileName = "CV_NguyenVanMinh_Flutter.pdf",
            appliedVia = "Ứng tuyển trực tuyến"
        ),
        Application(
            id = "app_2",
            studentName = "Trần Thị Lan",
            studentEmail = "lantt.analysis@gmail.com",
            studentPhone = "0902 345 678",
            cvUrl = "https://example.com/cv/lantt.pdf",
            jobId = "job_6",
            jobTitle = "Data Analyst",
            companyName = "FPT Software",
            appliedAt = "2026-05-25",
            status = ApplicationStatus.Pending,
            coverLetter = "Tốt nghiệp ngành Thống kê tại ĐH Đà Nẵng, em có kinh nghiệm sử dụng Python, SQL và Power BI. Em mong muốn được phát triển sự nghiệp tại FPT Software.",
            notes = "CV rõ ràng, có portfolio Power BI",
            resumeFileName = "CV_TranThiLan_DataAnalyst.pdf",
            appliedVia = "Ứng tuyển trực tuyến"
        ),
        Application(
            id = "app_3",
            studentName = "Lê Hoàng Nam",
            studentEmail = "namlhn.dev@gmail.com",
            studentPhone = "0903 456 789",
            cvUrl = "https://example.com/cv/namlhn.pdf",
            jobId = "job_1",
            jobTitle = "Fresher Java Developer",
            companyName = "FPT Software",
            appliedAt = "2026-05-24",
            status = ApplicationStatus.Interview,
            coverLetter = "Sinh viên năm 4 ngành CNTT, ĐH VKU. Em đã hoàn thành nhiều dự án cá nhân với Java và Spring Boot. Rất mong được học hỏi từ đội ngũ FPT.",
            notes = "Đã mời phỏng vấn, vui lòng kiểm tra tin nhắn.",
            resumeFileName = "CV_LeHoangNam_JavaDev.pdf",
            appliedVia = "Ứng tuyển trực tuyến"
        ),
        Application(
            id = "app_4",
            studentName = "Phạm Thu Hà",
            studentEmail = "hapt.uxui@gmail.com",
            studentPhone = "0904 567 890",
            cvUrl = "https://example.com/cv/hapt.pdf",
            jobId = "job_5",
            jobTitle = "UX/UI Designer",
            companyName = "Rikkei Foods",
            appliedAt = "2026-05-23",
            status = ApplicationStatus.Pending,
            coverLetter = "Designer với 1.5 năm kinh nghiệm, chuyên về mobile app design. Portfolio có hơn 15 dự án với Figma. Đặc biệt yêu thích food-tech và consumer apps.",
            notes = "",
            resumeFileName = "CV_PhamThuHa_UXUI.pdf",
            appliedVia = "Ứng tuyển trực tuyến"
        ),
        Application(
            id = "app_5",
            studentName = "Võ Đức Anh",
            studentEmail = "anhvd.qa@gmail.com",
            studentPhone = "0905 678 901",
            cvUrl = "https://example.com/cv/anhvd.pdf",
            jobId = "job_11",
            jobTitle = "Manual QA Engineer",
            companyName = "NashTech Vietnam",
            appliedAt = "2026-05-22",
            status = ApplicationStatus.Rejected,
            coverLetter = "Sinh viên năm cuối ngành CNTT, có kiến thức cơ bản về testing. Đã thực tập 3 tháng tại công ty outsource.",
            notes = "Kỹ năng tiếng Nhật còn yếu, cần bổ sung thêm. Sẽ liên hệ lại sau 6 tháng.",
            resumeFileName = "CV_VoDucAnh_QA.pdf",
            appliedVia = "Ứng tuyển trực tuyến"
        ),
        Application(
            id = "app_6",
            studentName = "Hoàng Minh Tuấn",
            studentEmail = "tuanhm.dev@gmail.com",
            studentPhone = "0906 789 012",
            cvUrl = "https://example.com/cv/tuanhm.pdf",
            jobId = "job_12",
            jobTitle = "DevOps Engineer",
            companyName = "GCP Vietnam",
            appliedAt = "2026-05-21",
            status = ApplicationStatus.Interview,
            coverLetter = "DevOps với 2 năm kinh nghiệm, chứng chỉ GCP Associate. Thành thạo Docker, Kubernetes, Terraform và CI/CD pipelines.",
            notes = "Đã xếp lịch phỏng vấn tuần sau.",
            resumeFileName = "CV_HoangMinhTuan_DevOps.pdf",
            appliedVia = "Ứng tuyển trực tuyến"
        ),
        Application(
            id = "app_7",
            studentName = "Ngô Thị Mai",
            studentEmail = "maint.kt@gmail.com",
            studentPhone = "0907 890 123",
            cvUrl = "https://example.com/cv/maint.pdf",
            jobId = "job_10",
            jobTitle = "Project Manager",
            companyName = "Samsung SDS Vietnam",
            appliedAt = "2026-05-20",
            status = ApplicationStatus.Pending,
            coverLetter = "Cử nhân Quản trị Kinh doanh, ĐH Kinh tế. Có chứng chỉ Scrum Master. 2 năm kinh nghiệm quản lý dự án IT cho khách hàng Nhật Bản.",
            notes = "",
            resumeFileName = "CV_NgoThiMai_PM.pdf",
            appliedVia = "Ứng tuyển trực tuyến"
        ),
        Application(
            id = "app_8",
            studentName = "Đặng Quang Khải",
            studentEmail = "khaidq.unity@gmail.com",
            studentPhone = "0908 901 234",
            cvUrl = "https://example.com/cv/khaidq.pdf",
            jobId = "job_3",
            jobTitle = "Game Developer (Unity)",
            companyName = "VNG Corporation",
            appliedAt = "2026-05-19",
            status = ApplicationStatus.Pending,
            coverLetter = "Game developer với 1 năm kinh nghiệm Unity, đã publish 3 game trên Google Play. Thành thạo C#, UGUI và physics engine.",
            notes = "",
            resumeFileName = "CV_DangQuangKhai_Unity.pdf",
            appliedVia = "Ứng tuyển trực tuyến"
        )
    )
}

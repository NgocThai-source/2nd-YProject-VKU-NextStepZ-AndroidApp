package com.example.nextstepz.ui.screens.account

import androidx.lifecycle.ViewModel
import com.example.nextstepz.feeds.data.model.Comment
import com.example.nextstepz.feeds.data.model.Post
import com.example.nextstepz.feeds.data.model.PostType
import com.example.nextstepz.feeds.data.model.UserRole
import com.example.nextstepz.feeds.jobs.data.model.ExperienceLevel
import com.example.nextstepz.feeds.jobs.data.model.Job
import com.example.nextstepz.feeds.jobs.data.model.JobType
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class FavoritesViewModel : ViewModel() {

    private val _uiState = MutableStateFlow<FavoritesUiState>(FavoritesUiState.Loading)
    val uiState: StateFlow<FavoritesUiState> = _uiState.asStateFlow()

    private val _isRefreshing = MutableStateFlow(false)
    val isRefreshing: StateFlow<Boolean> = _isRefreshing.asStateFlow()

    private val _selectedTab = MutableStateFlow(FavoriteTab.FEEDS)
    val selectedTab: StateFlow<FavoriteTab> = _selectedTab.asStateFlow()

    private val _feedBookmarks = MutableStateFlow(createMockFeedBookmarks())
    private val _jobBookmarks = MutableStateFlow(createMockJobBookmarks())

    init {
        loadData()
    }

    fun loadData() {
        _uiState.value = FavoritesUiState.Loading
        _uiState.value = FavoritesUiState.Success(
            feedBookmarks = _feedBookmarks.value,
            jobBookmarks = _jobBookmarks.value
        )
    }

    fun refresh() {
        _isRefreshing.value = true
        loadData()
        _isRefreshing.value = false
    }

    fun selectTab(tab: FavoriteTab) {
        _selectedTab.value = tab
    }

    fun removeFeedBookmark(postId: String) {
        _feedBookmarks.value = _feedBookmarks.value.filter { it.id != postId }
        updateSuccessState()
    }

    fun removeJobBookmark(jobId: String) {
        _jobBookmarks.value = _jobBookmarks.value.filter { it.id != jobId }
        updateSuccessState()
    }

    private fun updateSuccessState() {
        val current = _uiState.value
        if (current is FavoritesUiState.Success) {
            _uiState.value = current.copy(
                feedBookmarks = _feedBookmarks.value,
                jobBookmarks = _jobBookmarks.value
            )
        }
    }

    private fun createMockFeedBookmarks(): List<Post> = listOf(
        Post(
            id = "fb_post_1",
            authorId = "user_001",
            authorName = "Nguyễn Minh Tuấn",
            authorAvatar = null,
            authorRole = "Senior Developer",
            type = PostType.Article,
            content = "5 Kỹ năng quan trọng mà mọi lập trình viên cần có trong năm 2026. Đầu tiên là khả năng làm việc với AI và các công cụ hỗ trợ. Thứ hai là kỹ năng giao tiếp để trình bày ý tưởng với đồng nghiệp và khách hàng.",
            images = emptyList(),
            skillTags = listOf("KỹNăng", "LậpTrình", "AI"),
            likeCount = 342,
            commentCount = 28,
            isLiked = false,
            isBookmarked = true,
            createdAt = "2026-05-27T10:30:00Z"
        ),
        Post(
            id = "fb_post_2",
            authorId = "user_002",
            authorName = "Trần Thu Hà",
            authorAvatar = null,
            authorRole = "HR Manager",
            type = PostType.Tips,
            content = "Mẹo viết CV ấn tượng: 1. Tiêu đề rõ ràng, gây ấn tượng trong 5 giây đầu. 2. Liệt kê thành tích cụ thể bằng số liệu thay vì mô tả chung chung. 3. Tùy chỉnh CV theo từng vị trí ứng tuyển.",
            images = emptyList(),
            skillTags = listOf("CV", "TuyểnDụng", "Mẹo"),
            likeCount = 891,
            commentCount = 56,
            isLiked = true,
            isBookmarked = true,
            createdAt = "2026-05-26T14:15:00Z"
        ),
        Post(
            id = "fb_post_3",
            authorId = "user_003",
            authorName = "Lê Hoàng Nam",
            authorAvatar = null,
            authorRole = "Tech Lead",
            type = PostType.Job,
            content = "Công ty FPT Software đang tuyển dụng vị trí Backend Developer với mức lương hấp dẫn. Yêu cầu: 2+ năm kinh nghiệm, thành thạo Java/Spring Boot, Node.js hoặc Python. Quyền lợi: BHXH, BHYT, teambuilding hàng quý.",
            images = emptyList(),
            skillTags = listOf("FPT", "Backend", "TuyểnDụng"),
            likeCount = 156,
            commentCount = 12,
            isLiked = false,
            isBookmarked = true,
            createdAt = "2026-05-25T09:00:00Z"
        ),
        Post(
            id = "fb_post_4",
            authorId = "user_004",
            authorName = "Phạm Đức Anh",
            authorAvatar = null,
            authorRole = "Student",
            type = PostType.Story,
            content = "Hành trình 6 tháng tìm việc của một sinh viên mới ra trường. Từ việc nộp 50 CV không có phản hồi, đến khi nhận được 3 offer cùng lúc. Điều quan trọng nhất tôi học được là đừng bao giờ từ bỏ và luôn sẵn sàng học hỏi.",
            images = emptyList(),
            skillTags = listOf("KinhNghiệm", "SinhViên", "TìmViệc"),
            likeCount = 1203,
            commentCount = 89,
            isLiked = true,
            isBookmarked = true,
            createdAt = "2026-05-24T18:45:00Z"
        ),
        Post(
            id = "fb_post_5",
            authorId = "user_005",
            authorName = "Vũ Thị Mai Lan",
            authorAvatar = null,
            authorRole = "Marketing Specialist",
            type = PostType.Article,
            content = "Xu hướng Marketing năm 2026: AI-driven content, short-form video, và personalized customer experience. Những brands nào không thích nghi với xu hướng này sẽ nhanh chóng bị bỏ lại phía sau trong cuộc đua giành khách hàng.",
            images = emptyList(),
            skillTags = listOf("Marketing", "AI", "XuHướng"),
            likeCount = 567,
            commentCount = 34,
            isLiked = false,
            isBookmarked = true,
            createdAt = "2026-05-23T11:20:00Z"
        ),
        Post(
            id = "fb_post_6",
            authorId = "user_006",
            authorName = "Đặng Quang Huy",
            authorAvatar = null,
            authorRole = "Product Designer",
            type = PostType.Tips,
            content = "Hướng dẫn sử dụng Figma hiệu quả cho người mới bắt đầu. Tìm hiểu về Auto Layout, Components, Variants và Interactive Components để tăng tốc độ thiết kế của bạn lên gấp 3 lần.",
            images = emptyList(),
            skillTags = listOf("Figma", "Design", "UI/UX"),
            likeCount = 445,
            commentCount = 21,
            isLiked = false,
            isBookmarked = true,
            createdAt = "2026-05-22T08:00:00Z"
        )
    )

    private fun createMockJobBookmarks(): List<Job> = listOf(
        Job(
            id = "fb_job_1",
            title = "Senior Backend Developer",
            companyName = "FPT Software",
            companyLogo = null,
            companyAddress = "Tòa nhà FPT, Cầu Giấy, Hà Nội",
            location = "Hà Nội",
            salaryMin = 25,
            salaryMax = 40,
            salaryUnit = "triệu/tháng",
            jobType = JobType.FullTime,
            experienceLevel = ExperienceLevel.Senior,
            description = "Phát triển và bảo trì các hệ thống backend cho các dự án offshore của khách hàng Nhật Bản và Châu Âu.",
            requirements = listOf("3+ năm kinh nghiệm", "Thành thạo Java/Spring Boot", "Có kinh nghiệm với database", "Tiếng Anh giao tiếp"),
            benefits = listOf("Lương tháng 13", "Du lịch hàng năm", "Training chứng chỉ", "Flexible working"),
            skills = listOf("Java", "Spring Boot", "PostgreSQL", "Docker", "AWS"),
            deadline = "2026-06-30T00:00:00Z",
            postedAt = "2026-05-27T00:00:00Z",
            viewCount = 1245,
            applicationCount = 87,
            isSaved = true,
            isFeatured = true,
            employerId = "emp_001",
            employerName = "Nguyễn Văn An"
        ),
        Job(
            id = "fb_job_2",
            title = "UI/UX Designer",
            companyName = "Viettel Solutions",
            companyLogo = null,
            companyAddress = "Viettel Complex, Đống Đa, Hà Nội",
            location = "Hà Nội",
            salaryMin = 18,
            salaryMax = 30,
            salaryUnit = "triệu/tháng",
            jobType = JobType.FullTime,
            experienceLevel = ExperienceLevel.Junior,
            description = "Thiết kế giao diện và trải nghiệm người dùng cho các sản phẩm số của Viettel.",
            requirements = listOf("1+ năm kinh nghiệm", "Thành thạo Figma, Sketch", "Portfolio ấn tượng", "Hiểu biết về UX research"),
            benefits = listOf("Môi trường năng động", "Đào tạo chuyên sâu", "Phụ cấp ăn trưa", "Teambuilding"),
            skills = listOf("Figma", "Adobe XD", "Prototyping", "Design System"),
            deadline = "2026-06-25T00:00:00Z",
            postedAt = "2026-05-26T00:00:00Z",
            viewCount = 892,
            applicationCount = 54,
            isSaved = true,
            isFeatured = false,
            employerId = "emp_002",
            employerName = "Trần Văn Bình"
        ),
        Job(
            id = "fb_job_3",
            title = "Frontend React Developer",
            companyName = "VNPAY",
            companyLogo = null,
            companyAddress = "Tầng 22, Tòa nhà Lotte Center, Ba Đình, Hà Nội",
            location = "Hà Nội",
            salaryMin = 20,
            salaryMax = 35,
            salaryUnit = "triệu/tháng",
            jobType = JobType.FullTime,
            experienceLevel = ExperienceLevel.Middle,
            description = "Phát triển giao diện web cho hệ thống thanh toán trực tuyến của VNPAY.",
            requirements = listOf("2+ năm kinh nghiệm React", "TypeScript", "Redux/Zustand", "REST API"),
            benefits = listOf("Lương cạnh tranh", "Bảo hiểm cao cấp", "Công việc ổn định", "Cơ hội thăng tiến"),
            skills = listOf("React", "TypeScript", "Redux", "CSS/SASS"),
            deadline = "2026-07-15T00:00:00Z",
            postedAt = "2026-05-25T00:00:00Z",
            viewCount = 1534,
            applicationCount = 112,
            isSaved = true,
            isFeatured = true,
            employerId = "emp_003",
            employerName = "Lê Thị Lan"
        ),
        Job(
            id = "fb_job_4",
            title = "Marketing Intern",
            companyName = "Shopee Vietnam",
            companyLogo = null,
            companyAddress = "Secreet, Quận 1, TP.HCM",
            location = "TP.HCM",
            salaryMin = 5,
            salaryMax = 7,
            salaryUnit = "triệu/tháng",
            jobType = JobType.Internship,
            experienceLevel = ExperienceLevel.Fresher,
            description = "Hỗ trợ team marketing trong các chiến dịch quảng cáo và truyền thông thương hiệu Shopee.",
            requirements = listOf("Sinh viên năm 3-4 hoặc mới tốt nghiệp", "Đam mê Marketing", "Sáng tạo, pro-active", "Biết sử dụng các công cụ thiết kế cơ bản"),
            benefits = listOf("Thực tập có lương", "Chứng chỉ hoàn thành", "Cơ hội trở thành nhân viên chính thức", "Đào tạo từ chuyên gia"),
            skills = listOf("Marketing", "Communication", "Social Media", "Canva"),
            deadline = "2026-06-20T00:00:00Z",
            postedAt = "2026-05-24T00:00:00Z",
            viewCount = 678,
            applicationCount = 145,
            isSaved = true,
            isFeatured = false,
            employerId = "emp_004",
            employerName = "Phạm Minh Đức"
        ),
        Job(
            id = "fb_job_5",
            title = "Data Analyst",
            companyName = "VNG Corporation",
            companyLogo = null,
            companyAddress = "Tòa nhà VNG, Quận 7, TP.HCM",
            location = "TP.HCM",
            salaryMin = 22,
            salaryMax = 35,
            salaryUnit = "triệu/tháng",
            jobType = JobType.FullTime,
            experienceLevel = ExperienceLevel.Junior,
            description = "Phân tích dữ liệu người dùng và hoạt động kinh doanh, hỗ trợ ra quyết định chiến lược cho các sản phẩm game của VNG.",
            requirements = listOf("1+ năm kinh nghiệm", "SQL, Python", "Tableau/Power BI", "Tư duy phân tích tốt"),
            benefits = listOf("Lương tháng 14", "Đa dạng phúc lợi", "Môi trường quốc tế", "Gaming zone"),
            skills = listOf("SQL", "Python", "Tableau", "Excel", "Data Visualization"),
            deadline = "2026-07-01T00:00:00Z",
            postedAt = "2026-05-23T00:00:00Z",
            viewCount = 967,
            applicationCount = 78,
            isSaved = true,
            isFeatured = false,
            employerId = "emp_005",
            employerName = "Hoàng Thị Ngọc"
        ),
        Job(
            id = "fb_job_6",
            title = "DevOps Engineer",
            companyName = "Tiki",
            companyLogo = null,
            companyAddress = "Tầng 6, Tòa nhà Dreames, Quận 1, TP.HCM",
            location = "TP.HCM",
            salaryMin = 28,
            salaryMax = 45,
            salaryUnit = "triệu/tháng",
            jobType = JobType.FullTime,
            experienceLevel = ExperienceLevel.Senior,
            description = "Xây dựng và duy trì hệ thống CI/CD, quản lý infrastructure và đảm bảo uptime cho các dịch vụ của Tiki.",
            requirements = listOf("3+ năm kinh nghiệm DevOps", "Kubernetes, Docker", "AWS/GCP", "Terraform, Ansible"),
            benefits = listOf("Lương top thị trường", "Stock options", "Work from home", "Tech talks hàng tuần"),
            skills = listOf("Kubernetes", "Docker", "AWS", "Terraform", "Jenkins"),
            deadline = "2026-07-10T00:00:00Z",
            postedAt = "2026-05-22T00:00:00Z",
            viewCount = 1832,
            applicationCount = 63,
            isSaved = true,
            isFeatured = true,
            employerId = "emp_006",
            employerName = "Ngô Đình Khoa"
        )
    )
}

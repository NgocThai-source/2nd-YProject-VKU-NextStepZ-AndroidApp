package com.example.nextstepz.feeds.jobs.data.repository

import com.example.nextstepz.feeds.jobs.data.model.ExperienceLevel
import com.example.nextstepz.feeds.jobs.data.model.Job
import com.example.nextstepz.feeds.jobs.data.model.JobCategory
import com.example.nextstepz.feeds.jobs.data.model.JobFilterParams
import com.example.nextstepz.feeds.jobs.data.model.JobSortBy
import com.example.nextstepz.feeds.jobs.data.model.JobType
import kotlinx.coroutines.delay

class JobRepository {

    private val mockJobs = getMockJobs().toMutableList()
    private var nextJobId = 13L

    suspend fun getJobs(params: JobFilterParams): Result<List<Job>> {
        delay(600)

        var filtered = mockJobs.toList()

        if (params.keyword.isNotBlank()) {
            val keyword = params.keyword.lowercase()
            filtered = filtered.filter {
                it.title.lowercase().contains(keyword) ||
                        it.companyName.lowercase().contains(keyword) ||
                        it.location.lowercase().contains(keyword) ||
                        it.skills.any { s -> s.lowercase().contains(keyword) }
            }
        }

        if (params.category != JobCategory.All) {
            filtered = filtered.filter { job ->
                when (params.category) {
                    JobCategory.IT -> job.skills.any {
                        s -> listOf("java", "flutter", "kotlin", "android", "python", "nodejs", "react", "devops", "cloud", "qa", "game", "unity", "data").any { s.contains(it) }
                    }
                    JobCategory.Finance -> job.companyIndustry == "Tài chính"
                    JobCategory.Marketing -> job.companyIndustry == "Marketing"
                    JobCategory.Design -> job.skills.any { s -> listOf("ui", "ux", "figma", "design").any { s.lowercase().contains(it) } }
                    else -> true
                }
            }
        }

        if (params.location != null) {
            filtered = filtered.filter { it.location.contains(params.location!!, ignoreCase = true) }
        }

        if (params.jobType != null) {
            filtered = filtered.filter { it.jobType == params.jobType }
        }

        if (params.experienceLevel != null) {
            filtered = filtered.filter { it.experienceLevel == params.experienceLevel }
        }

        if (params.salaryMin != null) {
            filtered = filtered.filter { it.salaryMax != null && it.salaryMax >= params.salaryMin!! }
        }

        if (params.salaryMax != null) {
            filtered = filtered.filter { it.salaryMin != null && it.salaryMin <= params.salaryMax!! }
        }

        filtered = when (params.sortBy) {
            JobSortBy.Newest -> filtered.sortedByDescending { it.postedAt }
            JobSortBy.SalaryHigh -> filtered.sortedByDescending { it.salaryMax ?: 0 }
            JobSortBy.SalaryLow -> filtered.sortedBy { it.salaryMin ?: Int.MAX_VALUE }
            JobSortBy.Deadline -> filtered.sortedBy { it.deadline }
        }

        return Result.success(filtered)
    }

    suspend fun getFeaturedJobs(): Result<List<Job>> {
        delay(400)
        return Result.success(mockJobs.filter { it.isFeatured })
    }

    suspend fun getSavedJobs(): Result<List<Job>> {
        delay(300)
        return Result.success(mockJobs.filter { it.isSaved })
    }

    suspend fun getJobById(id: String): Result<Job?> {
        delay(300)
        return Result.success(mockJobs.find { it.id == id })
    }

    suspend fun toggleSaveJob(jobId: String): Result<Job> {
        delay(200)
        val index = mockJobs.indexOfFirst { it.id == jobId }
        if (index == -1) return Result.failure(Exception("Không tìm thấy việc làm"))

        val job = mockJobs[index]
        val updatedJob = job.copy(isSaved = !job.isSaved)
        mockJobs[index] = updatedJob
        return Result.success(updatedJob)
    }

    suspend fun applyJob(jobId: String): Result<String> {
        delay(800)
        return Result.success("Ứng tuyển thành công!")
    }

    suspend fun reportJob(jobId: String, reason: String): Result<String> {
        delay(500)
        return Result.success("Cảm ơn bạn! Chúng tôi đã tiếp nhận báo cáo và sẽ xem xét trong thời gian sớm nhất.")
    }

    private fun getMockJobs(): List<Job> = listOf(
        Job(
            id = "job_1",
            title = "Fresher Java Developer",
            companyName = "FPT Software",
            companyAddress = "FPT Complex, Đường Nam Kỳ Khởi Nghĩa, Đà Nẵng",
            location = "Đà Nẵng",
            salaryMin = 8,
            salaryMax = 12,
            salaryUnit = "triệu/tháng",
            jobType = JobType.FullTime,
            experienceLevel = ExperienceLevel.Fresher,
            description = "FPT Software đang tìm kiếm Fresher Java Developer tham gia phát triển các dự án phần mềm cho khách hàng quốc tế. Bạn sẽ làm việc trong môi trường chuyên nghiệp với đội ngũ giàu kinh nghiệm, được đào tạo và phát triển kỹ năng chuyên môn.",
            requirements = listOf(
                "Tốt nghiệp CNTT, Khoa học Máy tính hoặc liên quan",
                "Nắm vững Java Core, OOP, Design Patterns",
                "Hiểu biết về Spring Boot, Hibernate là điểm cộng",
                "Sử dụng được Git, MySQL/PostgreSQL",
                "Giao tiếp tiếng Anh cơ bản",
                "Tư duy logic tốt, ham học hỏi"
            ),
            benefits = listOf(
                "Lương cạnh tranh, review 2 lần/năm",
                "Bảo hiểm cao cấp (BVCA) cho bản thân",
                "14 ngày phép năm, ngày WFH linh hoạt",
                "Đào tạo chuyên môn, chứng chỉ quốc tế",
                "Môi trường làm việc hiện đại, năng động",
                "Cơ hội onsite tại Nhật Bản, Hàn Quốc"
            ),
            skills = listOf("Java", "Spring Boot", "MySQL", "Git", "Agile"),
            deadline = "2026-06-15",
            postedAt = "2026-05-20",
            viewCount = 1247,
            applicationCount = 89,
            isSaved = false,
            isFeatured = false,
            employerId = "emp_fpt",
            employerName = "Phòng Nhân sự FPT",
            employerEmail = "tuyendung@fpt.com.vn",
            employerPhone = "0236 123 4567",
            companySize = "10,000+ nhân viên",
            companyIndustry = "Công nghệ",            companyWebsite = "https://fpt.com.vn"
        ),
        Job(
            id = "job_2",
            title = "Flutter Developer",
            companyName = "NextStepZ Team",
            companyAddress = "Remote / VKU, Đà Nẵng",
            location = "Remote",
            salaryMin = 15,
            salaryMax = 25,
            salaryUnit = "triệu/tháng",
            jobType = JobType.Remote,
            experienceLevel = ExperienceLevel.Junior,
            description = "Tham gia phát triển ứng dụng di động NextStepZ - nền tảng hỗ trợ sinh viên Việt Nam định hướng nghề nghiệp. Công việc remote, linh hoạt về thời gian, phù hợp sinh viên hoặc người đi làm part-time.",
            requirements = listOf(
                "Có kinh nghiệm với Flutter/Dart từ 6 tháng",
                "Sử dụng được Android Studio, Xcode simulator",
                "Hiểu về REST API, JSON parsing",
                "Sử dụng được Firebase (Auth, Firestore) là điểm cộng",
                "Có portfolio hoặc app đã publish là điểm cộng",
                "Chủ động trong công việc, giao tiếp tốt"
            ),
            benefits = listOf(
                "Lương competitive theo năng lực",
                "Làm việc 100% remote, không giới hạn địa điểm",
                "Lịch làm việc cực kỳ linh hoạt",
                "Mentoring trực tiếp từ senior developer",
                "Tham gia dự án có impact thực sự",
                "Cơ hội trở thành core team member"
            ),
            skills = listOf("Flutter", "Dart", "Android", "iOS", "Firebase", "REST API"),
            deadline = "2026-06-20",
            postedAt = "2026-05-18",
            viewCount = 2156,
            applicationCount = 142,
            isSaved = true,
            isFeatured = true,
            employerId = "emp_nsz",
            employerName = "NextStepZ Team",
            employerEmail = "contact@nextstepz.vn",
            employerPhone = "0338 445 343",
            companySize = "5-10 người",
            companyIndustry = "Công nghệ",            companyWebsite = "https://nextstepz.vn"
        ),
        Job(
            id = "job_3",
            title = "Game Developer (Unity)",
            companyName = "VNG Corporation",
            companyAddress = "Tòa nhà VNG, Quận 9, TP. Hồ Chí Minh",
            location = "TP. Hồ Chí Minh",
            salaryMin = 20,
            salaryMax = 35,
            salaryUnit = "triệu/tháng",
            jobType = JobType.FullTime,
            experienceLevel = ExperienceLevel.Junior,
            description = "VNG Corporation - công ty game lớn nhất Việt Nam - đang tuyển Game Developer sử dụng Unity để phát triển các tựa game mobile và PC. Tham gia vào các dự án game nổi tiếng của VNG.",
            requirements = listOf(
                "Tốt nghiệp CNTT, Game Development hoặc liên quan",
                "Có kinh nghiệm Unity từ 1 năm (demo/project cá nhân được)",
                "Thành thạo C#, Unity Engine, UGUI/IMGUI",
                "Hiểu về physics, animation, particle system",
                "Biết shader programming, performance optimization là điểm cộng",
                "Đam mê game, chơi game nhiều thể loại"
            ),
            benefits = listOf(
                "Lương top thị trường game Việt Nam",
                "Thưởng dự án, thưởng Tết hậu hĩnh",
                "Bảo hiểm sức khỏe cao cấp",
                "Môi trường game chuyên nghiệp",
                "Tham gia các dự án game lớn, nổi tiếng",
                "Café, snack free tại văn phòng"
            ),
            skills = listOf("Unity", "C#", "Game Design", "Mobile Game", "PC Game"),
            deadline = "2026-06-30",
            postedAt = "2026-05-15",
            viewCount = 3421,
            applicationCount = 203,
            isSaved = false,
            isFeatured = true,
            employerId = "emp_vng",
            employerName = "HR Department VNG",
            employerEmail = "careers@vng.com.vn",
            employerPhone = "028 9999 9999",
            companySize = "5,000+ nhân viên",
            companyIndustry = "Game",            companyWebsite = "https://vng.com.vn"
        ),
        Job(
            id = "job_4",
            title = "Cloud Engineer Intern",
            companyName = "Viettel Solutions",
            companyAddress = "Tòa nhà Viettel, Quận Cầu Giấy, Hà Nội",
            location = "Hà Nội",
            salaryMin = 10,
            salaryMax = 15,
            salaryUnit = "triệu/tháng",
            jobType = JobType.Internship,
            experienceLevel = ExperienceLevel.Fresher,
            description = "Viettel Solutions mở cơ hội thực tập Cloud Engineer cho sinh viên năm cuối hoặc mới tốt nghiệp. Tham gia các dự án hạ tầng cloud cho doanh nghiệp lớn, được đào tạo AWS/GCP/Azure.",
            requirements = listOf(
                "Sinh viên năm 4 hoặc mới tốt nghiệp ngành CNTT/Mạng",
                "Có kiến thức cơ bản về Linux, Networking",
                "Hiểu biết về cloud computing (AWS/GCP/Azure) là điểm cộng",
                "Chủ động học hỏi, không ngại hỏi",
                "Sẵn sàng làm full-time trong thời gian thực tập",
                "Có chứng chỉ cloud là điểm cộng lớn"
            ),
            benefits = listOf(
                "Công việc ổn định sau thực tập",
                "Thực tập full-time với lương competitive",
                "Được đào tạo chứng chỉ cloud (AWS/GCP)",
                "Tham gia các dự án cloud scale lớn",
                "Mentor hướng dẫn tận tâm",
                "Cơ hội trở thành nhân viên chính thức Viettel"
            ),
            skills = listOf("AWS", "GCP", "Azure", "Linux", "Docker", "Kubernetes"),
            deadline = "2026-06-10",
            postedAt = "2026-05-22",
            viewCount = 876,
            applicationCount = 67,
            isSaved = false,
            isFeatured = false,
            employerId = "emp_viettel",
            employerName = "Viettel Solutions HR",
            employerEmail = "tuyendung@viettel.com.vn",
            employerPhone = "024 1234 5678",
            companySize = "1,000+ nhân viên",
            companyIndustry = "Viễn thông",            companyWebsite = "https://viettelsolutions.vn"
        ),
        Job(
            id = "job_5",
            title = "UX/UI Designer",
            companyName = "Rikkei Foods",
            companyAddress = "Tầng 15, Tòa nhà Bitexco, Quận 1, TP. HCM",
            location = "Remote",
            salaryMin = 12,
            salaryMax = 18,
            salaryUnit = "triệu/tháng",
            jobType = JobType.Remote,
            experienceLevel = ExperienceLevel.Junior,
            description = "Rikkei Foods - công ty food-tech đang phát triển nhanh - tìm kiếm UX/UI Designer để thiết kế trải nghiệm người dùng cho ứng dụng di động và web platform. Bạn sẽ làm việc chặt chẽ với đội ngũ product và dev.",
            requirements = listOf(
                "Portfolio thể hiện kỹ năng UX/UI (bắt buộc)",
                "Thành thạo Figma, Adobe XD hoặc Sketch",
                "Hiểu về UX research, user testing",
                "Biết sử dụng design system, component library",
                "Có kinh nghiệm design app mobile là điểm cộng",
                "Giao tiếp tốt, có thể trình bày design decision"
            ),
            benefits = listOf(
                "Lương cạnh tranh, review 2 lần/năm",
                "Làm việc remote hoặc tại văn phòng TP.HCM",
                "Tham gia sản phẩm có hàng triệu người dùng",
                "Đội ngũ design chuyên nghiệp",
                "Công cụ design cao cấp (Figma Organization)",
                "Khóa học/workshop design miễn phí"
            ),
            skills = listOf("Figma", "UI Design", "UX Research", "Prototyping", "Design System"),
            deadline = "2026-06-25",
            postedAt = "2026-05-19",
            viewCount = 1567,
            applicationCount = 94,
            isSaved = false,
            isFeatured = false,
            employerId = "emp_rikkei",
            employerName = "Rikkei Foods Design Team",
            employerEmail = "design@rikkeifoods.vn",
            employerPhone = "028 8888 8888",
            companySize = "200-500 nhân viên",
            companyIndustry = "Food-Tech",            companyWebsite = "https://rikkeifoods.vn"
        ),
        Job(
            id = "job_6",
            title = "Data Analyst",
            companyName = "FPT Software",
            companyAddress = "FPT Complex, Đường Nam Kỳ Khởi Nghĩa, Đà Nẵng",
            location = "Đà Nẵng",
            salaryMin = 10,
            salaryMax = 15,
            salaryUnit = "triệu/tháng",
            jobType = JobType.FullTime,
            experienceLevel = ExperienceLevel.Junior,
            description = "FPT Software tuyển Data Analyst để phân tích dữ liệu, xây dựng báo cáo và dashboard cho các dự án outsourcing cho khách hàng quốc tế. Cơ hội làm việc với các công nghệ phân tích hiện đại.",
            requirements = listOf(
                "Tốt nghiệp Toán, Thống kê, CNTT hoặc liên quan",
                "Thành thạo SQL, Python (pandas, numpy)",
                "Sử dụng được BI tool (Power BI, Tableau, Looker)",
                "Hiểu về data modeling, ETL là điểm cộng",
                "Tiếng Anh giao tiếp tốt",
                "Kỹ năng trình bày dữ liệu, visualization tốt"
            ),
            benefits = listOf(
                "Lương cạnh tranh, thưởng dự án",
                "Đào tạo chứng chỉ data (AWS Data, Google Data)",
                "Làm việc với dữ liệu scale lớn",
                "Cơ hội chuyển sang Data Engineer/Scientist",
                "Bảo hiểm cao cấp, WFH linh hoạt",
                "Onsite tại các nước phát triển"
            ),
            skills = listOf("SQL", "Python", "Power BI", "Excel", "Data Visualization", "ETL"),
            deadline = "2026-07-01",
            postedAt = "2026-05-21",
            viewCount = 1089,
            applicationCount = 78,
            isSaved = true,
            isFeatured = false,
            employerId = "emp_fpt",
            employerName = "FPT Data Team",
            employerEmail = "data.hiring@fpt.com.vn",
            employerPhone = "0236 123 4567",
            companySize = "10,000+ nhân viên",
            companyIndustry = "Công nghệ",            companyWebsite = "https://fpt.com.vn"
        ),
        Job(
            id = "job_7",
            title = "Marketing Intern",
            companyName = "Unilever Vietnam",
            companyAddress = "Tòa nhà Unilever, Quận 7, TP. Hồ Chí Minh",
            location = "TP. Hồ Chí Minh",
            salaryMin = 5,
            salaryMax = 8,
            salaryUnit = "triệu/tháng",
            jobType = JobType.Internship,
            experienceLevel = ExperienceLevel.Fresher,
            description = "Unilever Vietnam - tập đoàn FMCG hàng đầu - mời gọi sinh viên thực tập tại phòng Marketing. Tham gia các chiến dịch marketing cho thương hiệu nổi tiếng như OMO, Vim, Sunsilk.",
            requirements = listOf(
                "Sinh viên năm 3-4 các ngành Marketing, Kinh tế, Truyền thông",
                "Sáng tạo, có eye for detail",
                "Sử dụng được Google Workspace, Canva",
                "Biết về social media marketing là điểm cộng",
                "Chủ động, pro-active trong công việc",
                "Có thể làm full-time (hoặc 4 ngày/tuần)"
            ),
            benefits = listOf(
                "Thương hiệu Unilever danh tiếng quốc tế",
                "Môi trường làm việc chuyên nghiệp top đầu",
                "Được đào tạo marketing thực chiến",
                "Networking với các brand manager",
                "Letter of recommendation sau kỳ thực tập",
                "Cơ hội full-time sau thực tập"
            ),
            skills = listOf("Marketing", "Social Media", "Content Writing", "Canva", "Google Analytics"),
            deadline = "2026-06-08",
            postedAt = "2026-05-23",
            viewCount = 654,
            applicationCount = 112,
            isSaved = false,
            isFeatured = false,
            employerId = "emp_unilever",
            employerName = "Unilever Vietnam HR",
            employerEmail = "careers.vn@unilever.com",
            employerPhone = "028 3775 0000",
            companySize = "1,000+ nhân viên",
            companyIndustry = "FMCG",            companyWebsite = "https://unilever.com.vn"
        ),
        Job(
            id = "job_8",
            title = "Senior Backend NodeJS Developer",
            companyName = "Grab Vietnam",
            companyAddress = "Remote / Tòa nhà Empire Tower, Quận 1, TP. HCM",
            location = "Remote",
            salaryMin = 40,
            salaryMax = 60,
            salaryUnit = "triệu/tháng",
            jobType = JobType.Remote,
            experienceLevel = ExperienceLevel.Senior,
            description = "Grab Vietnam đang tìm kiếm Senior Backend Developer (NodeJS) để phát triển các microservice cho nền tảng Grab, phục vụ hàng triệu người dùng Đông Nam Á. Tech stack hiện đại, quy mô lớn.",
            requirements = listOf(
                "Tối thiểu 4 năm kinh nghiệm NodeJS",
                "Thành thạo TypeScript, Express/Fastify, NestJS",
                "Kinh nghiệm với PostgreSQL, Redis, Kafka/RabbitMQ",
                "Hiểu về microservices, API design, system design",
                "Có kinh nghiệm scaling, performance optimization",
                "Tiếng Anh tốt (đọc/tài liệu/tuyến trình)"
            ),
            benefits = listOf(
                "Lương top tier thị trường tech Việt Nam",
                "Cổ phiếu Grab (RSU)",
                "Bảo hiểm sức khỏe cao cấp (bao gồm gia đình)",
                "Work from anywhere, 20+ ngày WFH/năm",
                "Tech conference, training budget",
                "Tech stipend (MacBook, monitor, chair)"
            ),
            skills = listOf("NodeJS", "TypeScript", "PostgreSQL", "Redis", "Microservices", "Docker", "Kubernetes"),
            deadline = "2026-07-15",
            postedAt = "2026-05-10",
            viewCount = 4532,
            applicationCount = 45,
            isSaved = false,
            isFeatured = true,
            employerId = "emp_grab",
            employerName = "Grab Tech Vietnam",
            employerEmail = "engineering.vn@grab.com",
            employerPhone = "028 7108 8888",
            companySize = "1,000+ nhân viên",
            companyIndustry = "Super App",            companyWebsite = "https://grab.com/vn"
        ),
        Job(
            id = "job_9",
            title = "Part-time Python Tutor",
            companyName = "Trung tâm Tin học VKU",
            companyAddress = "Trường ĐH CNTT & TT Việt - Hàn, VKU, Đà Nẵng",
            location = "Đà Nẵng",
            salaryMin = 100,
            salaryMax = 150,
            salaryUnit = "ngàn/giờ",
            jobType = JobType.PartTime,
            experienceLevel = ExperienceLevel.Junior,
            description = "Trung tâm Tin học ĐH VKU cần gia sư dạy Python cho sinh viên năm nhất. Công việc part-time 2-4 buổi/tuần, phù hợp sinh viên năm 2-3 muốn tăng thu nhập và củng cố kiến thức.",
            requirements = listOf(
                "Sinh viên năm 2-4 ngành CNTT hoặc liên quan",
                "Thành thạo Python (đã học hoặc tự học)",
                "Có khả năng giảng dạy, giải thích rõ ràng",
                "Kiên nhẫn, thân thiện với sinh viên mới",
                "Sắp xếp được thời gian buổi tối hoặc cuối tuần",
                "Ưu tiên có kinh nghiệm tutoring/gia sư"
            ),
            benefits = listOf(
                "Thu nhập part-time hấp dẫn (3-6 triệu/tháng)",
                "Lịch dạy linh hoạt theo thời gian rảnh",
                "Củng cố kiến thức Python cho bản thân",
                "Môi trường làm việc gần trường, thuận tiện",
                "Hỗ trợ tài liệu giảng dạy",
                "Cơ hội trở thành giảng viên part-time"
            ),
            skills = listOf("Python", "Teaching", "Communication", "Basic Algorithm"),
            deadline = "2026-06-05",
            postedAt = "2026-05-24",
            viewCount = 423,
            applicationCount = 31,
            isSaved = false,
            isFeatured = false,
            employerId = "emp_vku",
            employerName = "Trung tâm Tin học VKU",
            employerEmail = "tinhoc.vku@vku.udn.vn",
            employerPhone = "0236 9999 123",
            companySize = "20-50 nhân viên",
            companyIndustry = "Giáo dục",            companyWebsite = "https://vku.udn.vn"
        ),
        Job(
            id = "job_10",
            title = "Project Manager",
            companyName = "Samsung SDS Vietnam",
            companyAddress = "Tòa nhà Lotte Center, Quận Ba Đình, Hà Nội",
            location = "Hà Nội",
            salaryMin = 35,
            salaryMax = 50,
            salaryUnit = "triệu/tháng",
            jobType = JobType.FullTime,
            experienceLevel = ExperienceLevel.Manager,
            description = "Samsung SDS Vietnam tuyển Project Manager quản lý các dự án IT cho khách hàng doanh nghiệp. Tham gia từ giai đoạn planning đến delivery, làm việc với đội ngũ quốc tế.",
            requirements = listOf(
                "Tối thiểu 3 năm kinh nghiệm quản lý dự án IT",
                "Chứng chỉ PMP, Prince2, Scrum Master là điểm cộng",
                "Kinh nghiệm với project management tools (Jira, Confluence)",
                "Tiếng Anh giao tiếp tốt (Korean là điểm cộng)",
                "Kỹ năng leadership, stakeholder management",
                "Hiểu biết về Agile/Scrum methodology"
            ),
            benefits = listOf(
                "Lương cạnh tranh tier 1",
                "Thưởng performance, thưởng Tết",
                "Bảo hiểm cao cấp cao cấp",
                "Công việc ổn định, doanh nghiệp Hàn Quốc lớn",
                "Onsite tại Hàn Quốc (Samsung HQ)",
                "Đào tạo chứng chỉ PMP miễn phí"
            ),
            skills = listOf("Project Management", "Agile", "Scrum", "Jira", "Leadership", "Stakeholder Management"),
            deadline = "2026-06-28",
            postedAt = "2026-05-16",
            viewCount = 2890,
            applicationCount = 56,
            isSaved = false,
            isFeatured = false,
            employerId = "emp_samsung",
            employerName = "Samsung SDS HR",
            employerEmail = "careers.vn@samsungsds.com",
            employerPhone = "024 3266 8888",
            companySize = "500+ nhân viên",
            companyIndustry = "IT Services",            companyWebsite = "https://samsungsds.com/vn"
        ),
        Job(
            id = "job_11",
            title = "Manual QA Engineer",
            companyName = "NashTech Vietnam",
            companyAddress = "Tầng 10, Tòa nhà A2, Đường Nam Kỳ Khởi Nghĩa, Đà Nẵng",
            location = "Đà Nẵng",
            salaryMin = 10,
            salaryMax = 16,
            salaryUnit = "triệu/tháng",
            jobType = JobType.FullTime,
            experienceLevel = ExperienceLevel.Junior,
            description = "NashTech - công ty outsourcing hàng đầu Đà Nẵng - tuyển Manual QA Engineer tham gia kiểm thử phần mềm cho các dự án khách hàng Nhật Bản. Môi trường chuyên nghiệp, cơ hội học tiếng Nhật.",
            requirements = listOf(
                "Tốt nghiệp CNTT, QA hoặc các ngành liên quan",
                "Hiểu về software testing lifecycle (STLC)",
                "Biết viết test case, test plan",
                "Sử dụng được bug tracking tool (Jira, Redmine)",
                "Tiếng Anh đọc tài liệu tốt, tiếng Nhật là điểm cộng",
                "Attention to detail, logic thinking"
            ),
            benefits = listOf(
                "Lương competitive, review hàng năm",
                "Đào tạo tiếng Nhật miễn phí (N5-N3)",
                "Cơ hội onsite tại Nhật Bản",
                "Bảo hiểm cao cấp, WFH policy",
                "Đào tạo ISTQB foundation",
                "Môi trường quốc tế, đồng nghiệp Nhật"
            ),
            skills = listOf("Manual Testing", "Test Case", "JIRA", "Bug Tracking", "API Testing", "SQL"),
            deadline = "2026-07-05",
            postedAt = "2026-05-17",
            viewCount = 987,
            applicationCount = 73,
            isSaved = false,
            isFeatured = false,
            employerId = "emp_nashtech",
            employerName = "NashTech HR Team",
            employerEmail = "careers.dn@nashtech.com",
            employerPhone = "0236 369 6969",
            companySize = "500+ nhân viên",
            companyIndustry = "Outsourcing",            companyWebsite = "https://nashtech.com/vi-vn"
        ),
        Job(
            id = "job_12",
            title = "DevOps Engineer",
            companyName = "GCP Vietnam",
            companyAddress = "Remote / Văn phòng Google, Quận 2, TP. HCM",
            location = "Remote",
            salaryMin = 30,
            salaryMax = 45,
            salaryUnit = "triệu/tháng",
            jobType = JobType.Remote,
            experienceLevel = ExperienceLevel.Middle,
            description = "GCP Vietnam tìm kiếm DevOps Engineer xây dựng và vận hành hạ tầng cloud trên Google Cloud Platform cho các enterprise clients. Tech stack hiện đại, làm việc với scale lớn.",
            requirements = listOf(
                "Tối thiểu 2 năm kinh nghiệm DevOps/SRE",
                "Chứng chỉ GCP Associate Cloud Engineer hoặc cao hơn",
                "Thành thạo Docker, Kubernetes, Terraform",
                "Kinh nghiệm CI/CD (Jenkins, GitLab CI, GitHub Actions)",
                "Linux system administration tốt",
                "Monitoring (Prometheus, Grafana, Datadog)"
            ),
            benefits = listOf(
                "Lương top tier DevOps market",
                "Chứng chỉ GCP/SRE miễn phí (5000$/năm budget)",
                "100% remote work",
                "Đào tạo chuyên sâu SRE, Platform Engineering",
                "Làm việc với enterprise clients scale lớn",
                "Thiết bị cao cấp (MacBook Pro, work station)"
            ),
            skills = listOf("GCP", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Monitoring"),
            deadline = "2026-07-10",
            postedAt = "2026-05-14",
            viewCount = 3214,
            applicationCount = 38,
            isSaved = true,
            isFeatured = true,
            employerId = "emp_gcp",
            employerName = "GCP Vietnam Engineering",
            employerEmail = "devops.vn@gcp-vn.com",
            employerPhone = "028 7777 9999",
            companySize = "100-200 nhân viên",
            companyIndustry = "Cloud Services",            companyWebsite = "https://cloud.google.com"
        )
    )

    suspend fun createJob(
        title: String,
        companyName: String,
        companyAddress: String,
        location: String,
        salaryMin: Int?,
        salaryMax: Int?,
        jobType: JobType,
        experienceLevel: ExperienceLevel,
        description: String,
        requirements: List<String>,
        benefits: List<String>,
        skills: List<String>,
        deadline: String,
        companyWebsite: String? = null
    ): Result<Job> {
        delay(600)
        val newJob = Job(
            id = "job_${nextJobId++}",
            title = title,
            companyName = companyName,
            companyAddress = companyAddress,
            location = location,
            salaryMin = salaryMin,
            salaryMax = salaryMax,
            salaryUnit = "triệu/tháng",
            jobType = jobType,
            experienceLevel = experienceLevel,
            description = description,
            requirements = requirements,
            benefits = benefits,
            skills = skills,
            deadline = deadline,
            postedAt = java.time.LocalDate.now().toString(),
            viewCount = 0,
            applicationCount = 0,
            isSaved = false,
            isFeatured = false,
            employerId = "current_user",
            employerName = "Người dùng hiện tại",
            employerEmail = "",
            employerPhone = "",
            companySize = null,
            companyIndustry = null,
            companyWebsite = companyWebsite
        )
        mockJobs.add(0, newJob)
        return Result.success(newJob)
    }
}

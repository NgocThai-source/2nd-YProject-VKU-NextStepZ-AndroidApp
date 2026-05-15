package com.example.nextstepz.ui.screens.home

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AutoAwesome
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Lightbulb
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.Phone
import androidx.compose.material.icons.outlined.Psychology
import androidx.compose.material.icons.outlined.Public
import androidx.compose.material.icons.outlined.RocketLaunch
import androidx.compose.material.icons.outlined.School
import androidx.compose.material.icons.automirrored.outlined.Send
import androidx.compose.material.icons.automirrored.outlined.TrendingUp
import androidx.compose.material.icons.outlined.WorkOutline
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nextstepz.R
import com.example.nextstepz.ui.components.CreatorCard
import com.example.nextstepz.ui.components.FeatureCard
import com.example.nextstepz.ui.components.GlassCard
import com.example.nextstepz.ui.components.SectionHeader
import com.example.nextstepz.ui.components.TimelineItem
import com.example.nextstepz.ui.theme.AccentAmber
import com.example.nextstepz.ui.theme.AccentCyan
import com.example.nextstepz.ui.theme.AccentEmerald
import com.example.nextstepz.ui.theme.AccentOrange
import com.example.nextstepz.ui.theme.BrandBlue
import com.example.nextstepz.ui.theme.BrandMagenta
import com.example.nextstepz.ui.theme.BrandPurple
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GlassWhite
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.TextPrimary
import com.example.nextstepz.ui.theme.TextSecondary
import kotlinx.coroutines.delay

/**
 * Home Screen — Premium landing page showcasing the NextStepZ platform.
 *
 * Sections:
 * 1. Hero — Logo & tagline with fade-in animation
 * 2. Current situation — The problem NextStepZ aims to solve
 * 3. App purpose — Why NextStepZ was created
 * 4. Features — What the app can do for students (grid of FeatureCards)
 * 5. Creators — Team members (placeholder for user to fill in)
 * 6. Vision & Mission — Quote card with gradient text
 * 7. Workflow — How the app works (Timeline/Stepper)
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun HomeScreen() {
    // ─── Staggered animation states ─────────────────────────────
    var heroVisible by remember { mutableStateOf(false) }
    var section1Visible by remember { mutableStateOf(false) }
    var section2Visible by remember { mutableStateOf(false) }
    var section3Visible by remember { mutableStateOf(false) }
    var section4Visible by remember { mutableStateOf(false) }
    var section5Visible by remember { mutableStateOf(false) }
    var section6Visible by remember { mutableStateOf(false) }
    var section7Visible by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        heroVisible = true
        delay(200)
        section1Visible = true
        delay(200)
        section2Visible = true
        delay(200)
        section3Visible = true
        delay(200)
        section4Visible = true
        delay(200)
        section5Visible = true
        delay(200)
        section6Visible = true
        delay(200)
        section7Visible = true
    }

    val fadeInSpec = fadeIn(
        animationSpec = tween(durationMillis = 600, easing = FastOutSlowInEasing)
    )
    val slideInSpec = slideInVertically(
        initialOffsetY = { it / 6 },
        animationSpec = tween(durationMillis = 600, easing = FastOutSlowInEasing)
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Spacer(modifier = Modifier.height(36.dp))

        // ═══════════════════════════════════════════════════════════
        // SECTION 1: Hero — Logo + Tagline + Intro
        // ═══════════════════════════════════════════════════════════
        AnimatedVisibility(
            visible = heroVisible,
            enter = fadeInSpec + slideInSpec
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                // ── Logo (bigger, centered) ──
                Image(
                    painter = painterResource(id = R.drawable.logo_full),
                    contentDescription = "NextStepZ Logo",
                    modifier = Modifier
                        .fillMaxWidth(0.90f)
                        .padding(vertical = 4.dp),
                    contentScale = ContentScale.Fit
                )

                Spacer(modifier = Modifier.height(6.dp))

                // ── Tagline — "Bước đầu tiên đến với" larger, "tương lai nghề nghiệp" on its own line ──
                Text(
                    text = buildAnnotatedString {
                        withStyle(
                            SpanStyle(
                                color = TextSecondary,
                                fontSize = 26.sp
                            )
                        ) {
                            append("Bước đầu tiên đến với\n")
                        }
                        withStyle(
                            SpanStyle(
                                brush = Brush.horizontalGradient(
                                    listOf(GradientStart, GradientMid, GradientEnd)
                                ),
                                fontWeight = FontWeight.Bold
                            )
                        ) {
                            append("tương lai nghề nghiệp")
                        }
                    },
                    style = MaterialTheme.typography.headlineSmall,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(20.dp))

                // ── Description text ──
                Text(
                    text = "Chúng tôi ở đây để biến sự mơ hồ khi bắt đầu sự nghiệp thành những bước đi rõ ràng.",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.Medium
                    ),
                    color = TextPrimary,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "NextStepZ giúp sinh viên tạo CV chuyên nghiệp, " +
                            "khám phá công việc phù hợp và định hướng lộ trình phát triển bản thân. " +
                            "Mỗi sinh viên đều xứng đáng có một khởi đầu tự tin hơn trên hành trình nghề nghiệp.",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 4.dp)
                )

                Spacer(modifier = Modifier.height(20.dp))

                // ── Header illustration (portrait, full width, no frame) ──
                Image(
                    painter = painterResource(id = R.drawable.header),
                    contentDescription = "NextStepZ Illustration",
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(24.dp)),
                    contentScale = ContentScale.FillWidth
                )
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ═══════════════════════════════════════════════════════════
        // SECTION 2: Tình trạng hiện nay
        // ═══════════════════════════════════════════════════════════
        AnimatedVisibility(
            visible = section1Visible,
            enter = fadeInSpec + slideInSpec
        ) {
            Column {
                SectionHeader(
                    title = "Thực trạng hiện nay",
                    subtitle = "Thực trạng sinh viên Việt Nam sau khi ra trường"
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Section illustration
                Image(
                    painter = painterResource(id = R.drawable.home_thuc_trang),
                    contentDescription = "Thực trạng sinh viên",
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .border(
                            width = 1.dp,
                            color = GlassBorder,
                            shape = RoundedCornerShape(20.dp)
                        ),
                    contentScale = ContentScale.Crop
                )

                Spacer(modifier = Modifier.height(12.dp))

                GlassCard {
                    // Stats row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        StatItem(value = "60%", label = "Gặp khó khăn\nkhi tìm việc")
                        StatItem(value = "73%", label = "Làm việc\ntrái ngành")
                        StatItem(value = "85%", label = "Thiếu kỹ năng\nthực tế")
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Divider line
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(1.dp)
                            .background(
                                Brush.horizontalGradient(
                                    listOf(
                                        GradientStart.copy(alpha = 0f),
                                        GradientMid.copy(alpha = 0.3f),
                                        GradientEnd.copy(alpha = 0f)
                                    )
                                )
                            )
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        text = "Mỗi năm, nhiều sinh viên tốt nghiệp nhưng vẫn chưa có định hướng nghề nghiệp rõ ràng. " +
                                "Các bạn thường thiếu thông tin về thị trường lao động, chưa biết cách xây dựng CV nổi bật " +
                                "và gặp khó khăn khi tìm kiếm công việc phù hợp.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextSecondary,
                        textAlign = TextAlign.Justify
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Theo khảo sát và ghi nhận từ thực tế sinh viên mới ra trường.",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontWeight = FontWeight.Light
                        ),
                        color = TextSecondary.copy(alpha = 0.6f),
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ═══════════════════════════════════════════════════════════
        // SECTION 3: Mục đích ra đời
        // ═══════════════════════════════════════════════════════════
        AnimatedVisibility(
            visible = section2Visible,
            enter = fadeInSpec + slideInSpec
        ) {
            Column {
                SectionHeader(
                    title = "Mục đích ra đời",
                    subtitle = "Tại sao NextStepZ được tạo ra?"
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Section illustration
                Image(
                    painter = painterResource(id = R.drawable.home_muc_dich),
                    contentDescription = "Mục đích ra đời",
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .border(
                            width = 1.dp,
                            color = GlassBorder,
                            shape = RoundedCornerShape(20.dp)
                        ),
                    contentScale = ContentScale.Crop
                )

                Spacer(modifier = Modifier.height(12.dp))

                GlassCard {
                    Row(
                        verticalAlignment = Alignment.Top,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(
                                    Brush.linearGradient(
                                        listOf(
                                            GradientStart.copy(alpha = 0.2f),
                                            GradientMid.copy(alpha = 0.1f)
                                        )
                                    )
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            androidx.compose.material3.Icon(
                                imageVector = Icons.Outlined.RocketLaunch,
                                contentDescription = null,
                                tint = BrandBlue,
                                modifier = Modifier.size(24.dp)
                            )
                        }

                        Spacer(modifier = Modifier.width(14.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "NextStepZ ra đời với sứ mệnh thu hẹp khoảng cách giữa đào tạo và thực tiễn.",
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    fontWeight = FontWeight.Medium
                                ),
                                color = TextPrimary
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "NextStepZ được xây dựng để đồng hành cùng sinh viên ngay từ khi còn ngồi trên ghế nhà trường: " +
                                        "định hướng nghề nghiệp, tạo CV chuyên nghiệp, " +
                                        "tìm kiếm việc làm phù hợp và phát triển bản thân mỗi ngày.",
                                style = MaterialTheme.typography.bodySmall,
                                color = TextSecondary,
                                textAlign = TextAlign.Justify
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ═══════════════════════════════════════════════════════════
        // SECTION 4: App giúp được gì cho sinh viên?
        // ═══════════════════════════════════════════════════════════
        AnimatedVisibility(
            visible = section3Visible,
            enter = fadeInSpec + slideInSpec
        ) {
            Column {
                SectionHeader(
                    title = "NextStepZ giúp gì cho bạn?",
                    subtitle = "Những giá trị NextStepZ mang đến cho sinh viên"
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Section illustration
                Image(
                    painter = painterResource(id = R.drawable.home_giup_gi),
                    contentDescription = "NextStepZ giúp gì cho bạn",
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .border(
                            width = 1.dp,
                            color = GlassBorder,
                            shape = RoundedCornerShape(20.dp)
                        ),
                    contentScale = ContentScale.Crop
                )

                Spacer(modifier = Modifier.height(12.dp))

                FlowRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    maxItemsInEachRow = 2
                ) {
                    FeatureCard(
                        icon = Icons.Outlined.Description,
                        title = "Tạo CV\nchuyên nghiệp",
                        description = "Mẫu CV hiện đại, dễ tùy chỉnh",
                        accentColor = BrandBlue,
                        modifier = Modifier.weight(1f),
                        cardWidth = 0.dp
                    )
                    FeatureCard(
                        icon = Icons.Outlined.WorkOutline,
                        title = "Tìm việc làm\nphù hợp",
                        description = "Kết nối trực tiếp với doanh nghiệp",
                        accentColor = AccentEmerald,
                        modifier = Modifier.weight(1f),
                        cardWidth = 0.dp
                    )
                    FeatureCard(
                        icon = Icons.Outlined.Psychology,
                        title = "Phát triển\nkỹ năng",
                        description = "Bài viết và kinh nghiệm thực tế",
                        accentColor = AccentOrange,
                        modifier = Modifier.weight(1f),
                        cardWidth = 0.dp
                    )
                    FeatureCard(
                        icon = Icons.AutoMirrored.Outlined.TrendingUp,
                        title = "Định hướng\nnghề nghiệp",
                        description = "AI gợi ý lộ trình phù hợp",
                        accentColor = AccentCyan,
                        modifier = Modifier.weight(1f),
                        cardWidth = 0.dp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ═══════════════════════════════════════════════════════════
        // SECTION 5: Giới thiệu người sáng tạo
        // ═══════════════════════════════════════════════════════════
        AnimatedVisibility(
            visible = section4Visible,
            enter = fadeInSpec + slideInSpec
        ) {
            Column {
                SectionHeader(
                    title = "Đội ngũ sáng tạo",
                    subtitle = "Những người xây dựng và phát triển NextStepZ"
                )

                Spacer(modifier = Modifier.height(16.dp))

                CreatorCard(
                    name = "Nguyễn Ngọc Thái",
                    role = "Android Frontend Developer & UI/UX",
                    university = "ĐH CNTT & TT Việt - Hàn, VKU",
                    avatarRes = R.drawable.home_member_1
                )

                Spacer(modifier = Modifier.height(12.dp))

                CreatorCard(
                    name = "Đoàn Văn Nguyên",
                    role = "Backend Developer & Database",
                    university = "ĐH CNTT & TT Việt - Hàn, VKU",
                    avatarRes = R.drawable.home_member_2
                )
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ═══════════════════════════════════════════════════════════
        // SECTION 6: Tầm nhìn / Sứ mệnh
        // ═══════════════════════════════════════════════════════════
        AnimatedVisibility(
            visible = section5Visible,
            enter = fadeInSpec + slideInSpec
        ) {
            Column {
                SectionHeader(
                    title = "Tầm nhìn & Sứ mệnh"
                )

                Spacer(modifier = Modifier.height(16.dp))

                GlassCard {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        // Quote icon
                        Text(
                            text = "❝",
                            style = MaterialTheme.typography.displaySmall.copy(
                                brush = Brush.horizontalGradient(
                                    listOf(GradientStart, GradientMid, GradientEnd)
                                )
                            ),
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "NextStepZ hướng đến việc giúp sinh viên tự tin bước vào " +
                                    "thị trường lao động thông qua công nghệ.",
                            style = MaterialTheme.typography.bodyLarge.copy(
                                fontWeight = FontWeight.Medium
                            ),
                            color = TextPrimary,
                            textAlign = TextAlign.Center
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Mission items
                        MissionItem(
                            icon = Icons.Outlined.Lightbulb,
                            text = "Cung cấp công cụ hỗ trợ nghề nghiệp toàn diện"
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        MissionItem(
                            icon = Icons.Outlined.School,
                            text = "Kết nối sinh viên với cơ hội việc làm thực tế"
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        MissionItem(
                            icon = Icons.Outlined.AutoAwesome,
                            text = "Ứng dụng AI để cá nhân hóa trải nghiệm"
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ═══════════════════════════════════════════════════════════
        // SECTION 7: Quy trình hoạt động
        // ═══════════════════════════════════════════════════════════
        AnimatedVisibility(
            visible = section6Visible,
            enter = fadeInSpec + slideInSpec
        ) {
            Column {
                SectionHeader(
                    title = "Quy trình hoạt động",
                    subtitle = "Bắt đầu hành trình chỉ với vài bước đơn giản"
                )

                Spacer(modifier = Modifier.height(16.dp))

                GlassCard {
                    TimelineItem(
                        stepNumber = 1,
                        title = "Tạo tài khoản",
                        description = "Đăng ký miễn phí với email hoặc tài khoản mạng xã hội"
                    )
                    TimelineItem(
                        stepNumber = 2,
                        title = "Hoàn thiện hồ sơ",
                        description = "Tạo CV chuyên nghiệp với các mẫu có sẵn"
                    )
                    TimelineItem(
                        stepNumber = 3,
                        title = "Khám phá cơ hội",
                        description = "Tìm kiếm việc làm phù hợp với kỹ năng và sở thích"
                    )
                    TimelineItem(
                        stepNumber = 4,
                        title = "Ứng tuyển & Theo dõi",
                        description = "Nộp đơn trực tiếp, theo dõi trạng thái và cải thiện hồ sơ",
                        isLast = true
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ═══════════════════════════════════════════════════════════
        // SECTION 8: Thông tin liên hệ
        // ═══════════════════════════════════════════════════════════
        AnimatedVisibility(
            visible = section7Visible,
            enter = fadeInSpec + slideInSpec
        ) {
            Column {
                SectionHeader(
                    title = "Thông tin liên hệ",
                    subtitle = "Kết nối với chúng tôi"
                )

                Spacer(modifier = Modifier.height(16.dp))

                GlassCard {
                    // Description
                    Text(
                        text = "NextStepZ luôn sẵn sàng lắng nghe ý kiến đóng góp, câu hỏi hỗ trợ hoặc cơ hội hợp tác từ bạn. " +
                                "Hãy để lại email để chúng tôi có thể phản hồi và kết nối với bạn nhanh nhất.",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Email input + Send button
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Email TextField
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(48.dp)
                                .clip(RoundedCornerShape(14.dp))
                                .background(GlassWhite)
                                .border(
                                    width = 1.dp,
                                    color = GlassBorder,
                                    shape = RoundedCornerShape(14.dp)
                                )
                                .padding(horizontal = 14.dp),
                            contentAlignment = Alignment.CenterStart
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                androidx.compose.material3.Icon(
                                    imageVector = Icons.Outlined.Email,
                                    contentDescription = null,
                                    tint = TextSecondary.copy(alpha = 0.5f),
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Nhập email liên hệ",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = TextSecondary.copy(alpha = 0.5f)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.width(10.dp))

                        // Send button
                        Box(
                            modifier = Modifier
                                .height(48.dp)
                                .clip(RoundedCornerShape(14.dp))
                                .background(
                                    Brush.horizontalGradient(
                                        listOf(GradientStart, GradientMid, GradientEnd)
                                    )
                                )
                                .padding(horizontal = 20.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                androidx.compose.material3.Icon(
                                    imageVector = Icons.AutoMirrored.Outlined.Send,
                                    contentDescription = null,
                                    tint = TextPrimary,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "Gửi",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = TextPrimary
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    // Gradient divider
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(1.dp)
                            .background(
                                Brush.horizontalGradient(
                                    listOf(
                                        GradientStart.copy(alpha = 0f),
                                        GradientMid.copy(alpha = 0.3f),
                                        GradientEnd.copy(alpha = 0f)
                                    )
                                )
                            )
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    // Contact items
                    ContactItem(
                        icon = Icons.Outlined.Public,
                        label = "Facebook",
                        value = "facebook.com/2nthais/"
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    ContactItem(
                        icon = Icons.Outlined.Phone,
                        label = "Phone / Telegram / Zalo",
                        value = "+84 338 445 343"
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    ContactItem(
                        icon = Icons.Outlined.Email,
                        label = "Email",
                        value = "nguyenngocthai.job@gmail.com"
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    ContactItem(
                        icon = Icons.Outlined.LocationOn,
                        label = "Địa chỉ",
                        value = "470 Đường Trần Đại Nghĩa, phường Hòa Quý, quận Ngũ Hành Sơn, TP. Đà Nẵng"
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Copyright footer
                Text(
                    text = "© 2025 NextStepZ. All rights reserved.",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary.copy(alpha = 0.4f),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }

        // Bottom spacing for nav bar
        Spacer(modifier = Modifier.height(24.dp))
    }
}

// ─── Internal Composables ───────────────────────────────────────────────────

@Composable
private fun StatItem(
    value: String,
    label: String,
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = value,
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Bold,
                brush = Brush.verticalGradient(
                    listOf(GradientStart, GradientMid)
                )
            ),
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = TextSecondary,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
private fun MissionItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    text: String,
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.fillMaxWidth()
    ) {
        com.example.nextstepz.ui.components.GradientIcon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.width(10.dp))
        Text(
            text = text,
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary
        )
    }
}

@Composable
private fun ContactItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String,
) {
    Row(
        verticalAlignment = Alignment.Top,
        modifier = Modifier.fillMaxWidth()
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(
                    Brush.linearGradient(
                        listOf(
                            GradientStart.copy(alpha = 0.15f),
                            GradientMid.copy(alpha = 0.1f)
                        )
                    )
                ),
            contentAlignment = Alignment.Center
        ) {
            com.example.nextstepz.ui.components.GradientIcon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(18.dp)
            )
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(
                text = label,
                style = MaterialTheme.typography.labelMedium.copy(
                    fontWeight = FontWeight.SemiBold
                ),
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary
            )
        }
    }
}

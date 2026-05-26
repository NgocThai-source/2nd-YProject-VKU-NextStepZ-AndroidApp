package com.example.nextstepz.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nextstepz.ui.navigation.BottomNavItem
import com.example.nextstepz.ui.navigation.Screen
import com.example.nextstepz.ui.theme.BrandBlue
import com.example.nextstepz.ui.theme.ErrorRed
import com.example.nextstepz.ui.theme.GlassBorder
import com.example.nextstepz.ui.theme.GradientEnd
import com.example.nextstepz.ui.theme.GradientMid
import com.example.nextstepz.ui.theme.GradientStart
import com.example.nextstepz.ui.theme.NavBarBackground
import com.example.nextstepz.ui.theme.NavBarInactive

/**
 * Premium glassmorphism bottom navigation bar.
 * Features gradient-highlighted active tab with smooth animations.
 */
@Composable
fun BottomNavBar(
    items: List<BottomNavItem>,
    currentRoute: String,
    onItemClick: (BottomNavItem) -> Unit,
    unreadCount: Int = 0,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(NavBarBackground)
            .border(
                width = 0.5.dp,
                brush = Brush.horizontalGradient(
                    listOf(
                        Color.Transparent,
                        GlassBorder,
                        Color.Transparent
                    )
                ),
                shape = RoundedCornerShape(topStart = 0.dp, topEnd = 0.dp)
            )
            .windowInsetsPadding(WindowInsets.navigationBars)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            items.forEach { item ->
                val isSelected = currentRoute == item.screen.route
                BottomNavItemView(
                    item = item,
                    isSelected = isSelected,
                    onClick = { onItemClick(item) },
                    showBadge = item.screen.route == Screen.Notification.route,
                    badgeCount = unreadCount
                )
            }
        }
    }
}

@Composable
private fun BottomNavItemView(
    item: BottomNavItem,
    isSelected: Boolean,
    onClick: () -> Unit,
    showBadge: Boolean = false,
    badgeCount: Int = 0
) {
    val interactionSource = remember { MutableInteractionSource() }

    Column(
        modifier = Modifier
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick
            )
            .padding(horizontal = 4.dp, vertical = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Icon with gradient when active
        Box(
            modifier = Modifier
                .then(
                    if (isSelected) {
                        Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                Brush.horizontalGradient(
                                    listOf(
                                        GradientStart.copy(alpha = 0.15f),
                                        GradientMid.copy(alpha = 0.15f),
                                        GradientEnd.copy(alpha = 0.10f)
                                    )
                                )
                            )
                            .padding(horizontal = 16.dp, vertical = 6.dp)
                    } else {
                        Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
                    }
                ),
            contentAlignment = Alignment.Center
        ) {
            if (isSelected) {
                GradientIcon(
                    imageVector = item.icon,
                    contentDescription = item.label,
                    modifier = Modifier.size(24.dp)
                )
            } else {
                Icon(
                    imageVector = item.icon,
                    contentDescription = item.label,
                    tint = NavBarInactive,
                    modifier = Modifier.size(22.dp)
                )
            }

            // Unread badge
            if (showBadge && badgeCount > 0) {
                val scale by animateFloatAsState(
                    targetValue = 1f,
                    animationSpec = tween(300, easing = FastOutSlowInEasing),
                    label = "badgeScale"
                )
                Box(
                    modifier = Modifier
                        .offset(x = 12.dp, y = (-4).dp)
                        .scale(scale)
                        .size(if (badgeCount > 9) 18.dp else 16.dp)
                        .clip(CircleShape)
                        .background(ErrorRed)
                        .padding(horizontal = 3.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (badgeCount > 99) "99+" else badgeCount.toString(),
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold
                        ),
                        color = Color.White
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(2.dp))

        // Label
        Text(
            text = item.label,
            style = MaterialTheme.typography.labelSmall.copy(
                fontSize = 10.sp,
                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                letterSpacing = 0.sp
            ),
            color = if (isSelected) {
                GradientMid
            } else {
                NavBarInactive
            }
        )
    }
}

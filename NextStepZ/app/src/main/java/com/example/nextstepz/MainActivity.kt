package com.example.nextstepz

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.navigation.compose.rememberNavController
import com.example.nextstepz.ui.navigation.NavGraph
import com.example.nextstepz.ui.theme.NextStepZTheme

// MainActivity - Entry point
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NextStepZTheme {
                val navController = rememberNavController()
                NavGraph(navController = navController)
            }
        }
    }
}
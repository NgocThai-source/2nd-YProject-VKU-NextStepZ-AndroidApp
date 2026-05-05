package com.example.nextstepz

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.rememberNavController
import com.example.nextstepz.ui.navigation.NextStepZNavGraph
import com.example.nextstepz.ui.theme.NextStepZTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            NextStepZTheme {
                val navController = rememberNavController()
                NextStepZNavGraph(navController = navController)
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    NextStepZTheme {
        val navController = rememberNavController()
        NextStepZNavGraph(navController = navController)
    }
}
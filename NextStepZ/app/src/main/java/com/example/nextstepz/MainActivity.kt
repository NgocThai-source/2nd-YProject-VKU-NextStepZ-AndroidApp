package com.example.nextstepz

import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.annotation.RequiresApi
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.rememberNavController
import com.example.nextstepz.ui.navigation.NextStepZNavGraph
import com.example.nextstepz.ui.theme.NextStepZTheme

class MainActivity : ComponentActivity() {
    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val logoutMessage = intent.getStringExtra("LOGOUT_MESSAGE")
        if (!logoutMessage.isNullOrEmpty()) {
            Toast.makeText(this, logoutMessage, Toast.LENGTH_LONG).show()
        }
        enableEdgeToEdge()
        setContent {
            NextStepZTheme {
                val navController = rememberNavController()
                NextStepZNavGraph(navController = navController)
            }
        }
    }
}

@RequiresApi(Build.VERSION_CODES.O)
@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    NextStepZTheme {
        val navController = rememberNavController()
        NextStepZNavGraph(navController = navController)
    }
}
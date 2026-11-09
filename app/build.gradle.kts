plugins {
    id("com.android.application")
}

android {
    namespace = "com.pixeladventure.game"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.pixeladventure.game"
        minSdk = 26
        targetSdk = 34
        versionCode = 9
        versionName = "3.3"
    }

    buildTypes {
        release { isMinifyEnabled = false }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

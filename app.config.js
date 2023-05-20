const withReactNativeFirebase = require("./firebase-fix.plugin");

export default {
    "expo": {
        "name": "SmashApp Challenges",
        "slug": "smashappchallenges",
        "scheme": "smashappchallenges",
        "runtimeVersion": "08042023",
        "updates": {
            "channels": {
                "ios": "48",
                "android": "android"
              },
            "requestHeaders": {
                "channelName": "48"
            },
            "url": "https://u.expo.dev/3a9e4f6e-448d-4ac8-9492-efddfd9bd3f9",
        },
        "plugins": [
            "sentry-expo",
            [
                withReactNativeFirebase,
                "custom"
            ],
            [
                "expo-media-library",
                {
                    "photosPermission": "Allow SmashApp to access your photos so you can show completion of an activity.",
                    "savePhotosPermission": "Allow SmashApp to save photos and images of your badges to your device so you can share it.",
                    "isAccessMediaLocationEnabled": false
                }
            ],
            [
                "expo-build-properties",
                {
                    "android": {
                        "compileSdkVersion": 31,
                        "targetSdkVersion": 31,
                        "buildToolsVersion": "31.0.0"
                    },
                    "ios": {
                        "deploymentTarget": "13.0",
                        "useFrameworks": "static"
                    }
                }
            ],
            [
                "expo-image-picker",
                {
                    "photosPermission": "Allow SmashApp to access your photos to show completion of an activity or motivate other players"
                }
            ]
        ],
        "version": "114",
        "description": "SmashApp - Challenges",
        "orientation": "portrait",
        "privacy": "public",
        "icon": "./assets/icon.png",
        "primaryColor": "#00AAFF",
        "splash": {
            "image": "./assets/splash.png",
            "resizeMode": "cover",
            "backgroundColor": "#FF5E3A"
        },
        "packagerOpts": {},
        "androidStatusBar": {
            "barStyle": "dark-content"
        },
        "ios": {
            "bundleIdentifier": "com.smashapp.challenges",
            "associatedDomains": [
                "applinks:smashapprelease.page.link",
                "applinks:smashappchallenges.page.link",
                "applinks:smashapp-deep-links.web.app",
                "applinks:invites.smashapp.com.au"
            ],
            "entitlements": {
                "com.apple.developer.networking.wifi-info": true,
            },
            "googleServicesFile": "./GoogleService-Info.plist",
            "usesAppleSignIn": true,
            "infoPlist": {
                "NSCameraUsageDescription": "Used to take photos or videos to post and show completion of an activity.",
                "NSPhotoLibraryAddUsageDescription": "Allow SmashApp to save photos.",
                "NSPhotoLibraryUsageDescription": "Allow SmashApp to access your photos.",
                "NSMicrophoneUsageDescription": "This app uses the camera and microphone to post photos & videos and show completion of an activity",
                "NSLocationWhenInUseUsageDescription": "Used to add and show location when completing an activity"
            },
            "backgroundColor": "#fa4f49",
            "config": {
                "badge": true
            }
        },
        "android": {
            "package": "com.smashapp.challenges",
            "versionCode": 114,
            "googleServicesFile": "./google-services-android.json",
            "updateMetaData": {
                "channelName": "android",
            },
            "permissions": [
                "CAMERA",
                "CAMERA_ROLL",
                "NOTIFICATIONS",
                "RECORD_AUDIO",
                "AUDIO_RECORDING",
                "READ_EXTERNAL_STORAGE",
                "WRITE_EXTERNAL_STORAGE",
                "com.anddoes.launcher.permission.UPDATE_COUNT",
                "com.google.android.c2dm.permission.RECEIVE",
                "com.majeur.launcher.permission.UPDATE_BADGE",
                "com.sec.android.provider.badge.permission.READ",
                "com.sec.android.provider.badge.permission.WRITE",
                "com.sonyericsson.home.permission.BROADCAST_BADGE",
                "com.huawei.android.launcher.permission.CHANGE_BADGE",
                "android.permission.READ_EXTERNAL_STORAGE",
                "android.permission.WRITE_EXTERNAL_STORAGE"
            ],
            "softwareKeyboardLayoutMode": "pan",
            "intentFilters": [
                {
                    "action": "VIEW",
                    "data": [
                        {
                            "scheme": "https",
                            "host": "smashappchallenges.page.link",
                            "pathPrefix": "/"
                        }
                    ],
                    "category": [
                        "BROWSABLE",
                        "DEFAULT"
                    ]
                }
            ],
            "backgroundColor": "#fa4f49"
        },
        "assetBundlePatterns": [
            "assets/*"
        ],
        "platforms": [
            "android",
            "ios"
        ],
        "extra": {
            "eas": {
                "projectId": "3a9e4f6e-448d-4ac8-9492-efddfd9bd3f9"
            }
        }
    }
}





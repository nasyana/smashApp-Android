import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("../../assets/fonts/SpaceMono-Regular.ttf"),
          "Avenir-Black": require("../../assets/fonts/Avenir-Black.ttf"),
          "Avenir-Heavy": require("../../assets/fonts/Avenir-Heavy.ttf"),
          "Avenir-Medium": require("../../assets/fonts/Avenir-Medium.ttf"),
          "Avenir-Roman": require("../../assets/fonts/Avenir-Roman.otf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn('xxx', e);
      } finally {
        setLoadingComplete(true);
        setTimeout(() => {

        SplashScreen.hideAsync();
        }, 1000);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}

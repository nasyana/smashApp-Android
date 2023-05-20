import LottieView from 'lottie-react-native';
import * as React from 'react';

const LottieAnimation = ({
   source,
   style,
   loop = true,
   autoPlay = true,
   ...rest
}) => {
   const lottieRef = React.useRef<LottieView | null>(null);
   const [lottieSpeed, setLottieSpeed] = React.useState<number>(1);

   React.useEffect(() => {
      setLottieSpeed(0.8);
      let timeout;
      if (lottieRef.current) {
         lottieRef.current.play();
         timeout = setTimeout(() => {
            setLottieSpeed(1);
         }, 650);
      }

      // return () => {
      //    clearTimeout(timeout);
      // }

   }, [lottieRef.current]);

   return (
      <LottieView
         ref={lottieRef}
         source={source}
         style={style}
         loop={loop}
         autoPlay={autoPlay}
         speed={lottieSpeed}
         {...rest}
      />
   );
};

export default LottieAnimation;

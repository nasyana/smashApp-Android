import React, {useRef} from 'react';
import {
   gestureHandlerRootHOC,
   TapGestureHandler,
   State,
} from 'react-native-gesture-handler';

function TapHandler({children, onSinglePress, onDoublePress}) {
   const doubleTapRef = useRef(null);
   const _onSingleTap = (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {
         alert("I'm touched");
         onSinglePress();
      }
   };
   const _onDoubleTap = (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {
         alert('D0able tap, good job!');
         onDoublePress();
      }
   };
   return (
      <TapGestureHandler
         waitFor={doubleTapRef.current}
         onHandlerStateChange={_onSingleTap}>
         <TapGestureHandler
            ref={doubleTapRef}
            numberOfTaps={2}
            // maxDelayMs={250}
            onHandlerStateChange={_onDoubleTap}>
            {children}
         </TapGestureHandler>
      </TapGestureHandler>
   );
}

export default gestureHandlerRootHOC(TapHandler);

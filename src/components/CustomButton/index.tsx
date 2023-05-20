import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps, ButtonSize, Colors } from 'react-native-ui-lib';

interface CustomButtonProps {
   backgroundColor?: string;
   style?: any;
}
const CustomButton = ({
   backgroundColor = Colors.buttonLink,
   style,
   ...rest
}: CustomButtonProps & ButtonProps) => {
   return (
      <Button
         size={'large' as ButtonSize}
         marginH-36
         marginB-16
         text70BO
         backgroundColor={backgroundColor}
         style={[{ paddingVertical: 12 }]}
         {...rest}
      />
   );
};

export default React.memo(CustomButton);

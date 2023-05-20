import { scaleH } from 'config/scaleAccordingToDevice';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgArrow(props) {
  return (
    <Svg
      width={14}
      height={scaleH(54)}
      viewBox="0 0 14 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path fill="#FF5E3A" d="M6 0h2v46H6z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 54l7-8H0l7 8z"
        fill="#FF5E3A"
      />
    </Svg>
  );
}

export default SvgArrow;

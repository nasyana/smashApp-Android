import React, { useState, useRef, useEffect } from 'react';
import { SkCanvas } from 'react-native-skia';
import { useWindowDimensions, TouchableOpacity } from 'react-native';

const SkiaCircle = () => {
  const [color, setColor] = useState('#ff0000');
  const [canvas, setCanvas] = useState(null);
  const dimensions = useWindowDimensions();
  const circleRadius = Math.min(dimensions.width, dimensions.height) / 4;

  const animateColor = () => {
    const startColor = parseInt(color.substring(1), 16);
    const endColor = Math.floor(Math.random() * 0xffffff);
    const colorDiff = endColor - startColor;
    let step = 0;
    const animationFrame = () => {
      const nextColor = (startColor + step * colorDiff).toString(16);
      setColor(`#${'0'.repeat(6 - nextColor.length)}${nextColor}`);
      step += 0.01;
      if (step <= 1) {
        requestAnimationFrame(animationFrame);
      }
    };
    animationFrame();
  };

  const onPress = () => {
    animateColor();
  };

  const onCanvasInitialized = canvas => {
    setCanvas(canvas);
  };

  const drawCircle = (canvas, color) => {
    canvas.clear(0xffffffff);
    canvas.drawColor(color, 1);
    canvas.drawCircle(dimensions.width / 2, dimensions.height / 2, circleRadius);
  };

  useEffect(() => {
    if (canvas) {
      drawCircle(canvas, color);
    }
  }, [canvas, color]);

  return (
    <TouchableOpacity onPress={onPress}>
      <SkCanvas onInitialized={onCanvasInitialized} width={dimensions.width} height={dimensions.height} />
    </TouchableOpacity>
  );
};

export default SkiaCircle;

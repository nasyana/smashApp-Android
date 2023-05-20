import {FONTS} from 'config/FoundationConfig';
import {width} from 'config/scaleAccordingToDevice';
import {StyleSheet} from 'react-native';
import {Colors} from 'react-native-ui-lib';

export default StyleSheet.create({
  mainContainer: {
    height: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 48,
    marginHorizontal: 24,
    borderWidth: 2,
    borderColor: '#E9E9E9',
  },
  segmentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSegment: {
    flex: 1,
    zIndex: 5,
    borderRadius: 100,
    position: 'absolute',
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  touchableSegment: {
    zIndex: 10,
  },
  animatedView: {
    zIndex: 5,
    position: 'absolute',
  },
  defaultText: {
    color: Colors.color6D,
    fontSize: 14,
    fontFamily: FONTS.heavy,
  },
  activeText: {
    color: '#FFFFFF',
  },
  vivid: {
    opacity: 0.7,
  },
});

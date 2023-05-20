import React, { Component } from 'react'
import { Text, View, Dimensions } from 'react-native'
import { Video } from 'expo-av';
import VideoCacheManager from './components/VideoCacheManager';

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;


export class SmartVideo extends Component {


    state = {
        uri: undefined
    }

    async load({ uri }: ImageProps): Promise<void> {
        if (uri) {
            const entry = VideoCacheManager.get(uri);
            const path = await entry.getPath();
            if (path) {
                this.setState({ uri: path });
            }
        }
    }


    componentDidMount() {
        this.load(this.props);
    }

    componentWillUnmount() {
        const { uri } = this.props;
        const entry = VideoCacheManager.get(uri);
        entry.cancel();
    }

    componentDidUpdate(prevProps: ImageProps, prevState: ImageState) {

        const { uri } = this.state;
        if (this.props.uri !== prevProps.uri) {
            this.load(this.props);
        }
    }

    render() {

        const { uri } = this.state;

        return (
            <Video
                key={uri}
                {...this.props}
                // source={{ uri: this.state.uri}}
                // isBackground
                // rate={1.0}
                volume={this.props?.audio ? 1.0 : 0} 
                isMuted={false} 
                // resizeMode="cover" 
                shouldPlay={true}
                isLooping 
                // useNativeControls={false}
                // style={{ position: "absolute", width, height }}
                source={{ uri: this.state.uri }}
            />
        )
    }
}

export default SmartVideo

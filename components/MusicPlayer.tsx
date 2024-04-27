import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native';
import TrackPlayer, {
    Capability,
    State,
    Event,
    usePlaybackState,
    useProgress,
    useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

function MusicPlayer() {

    const podcastsCount = 10//podcasts.length;
    const [trackIndex, setTrackIndex] = useState(0);
    const [trackTitle, setTrackTitle] = useState();
    const [trackArtist, setTrackArtist] = useState();
    const [trackArtwork, setTrackArtwork] = useState();

    const playBackState: any = usePlaybackState();
    const progress = useProgress();

    const setupPlayer = async () => {
        try {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.updateOptions({

                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious
                ],
            });
            const track1 = {
                url: 'https://audiocdn.epidemicsound.com/ES_ITUNES/h8jx0H_18%20Karat/ES_18%20Karat.mp3',
                title: 'Avaritia',
                artist: 'deadmau5',
                album: 'while(1<2)',
                genre: 'Progressive House, Electro House',
                date: '2014-05-20T07:00:00+00:00', // RFC 3339
                artwork: 'http://example.com/cover.png', // Load artwork from the network
                duration: 402 // Duration in seconds
            };

            await TrackPlayer.add(track1);
            await gettrackdata();
            await TrackPlayer.play();
        } catch (error) { console.log(error); }
    };

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const { title, artwork, artist } = track;
            console.log(event.nextTrack);
            setTrackIndex(event.nextTrack);
            setTrackTitle(title);
            setTrackArtist(artist);
            setTrackArtwork(artwork);
        }
    });

    const gettrackdata = async () => {
        let trackIndex = await TrackPlayer.getActiveTrackIndex();
        let trackObject = trackIndex && await TrackPlayer.getTrack(trackIndex);
        console.log(trackIndex);
        if (trackObject && trackIndex) {
            setTrackIndex(trackIndex);
            setTrackTitle(trackObject.title);
            setTrackArtist(trackObject.artist);
            setTrackArtwork(trackObject.artwork);
        }
    };

    const togglePlayBack = async (playBackState: State) => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if (currentTrack != null) {
            if ((playBackState == State.Paused) || (playBackState == State.Ready)) {
                await TrackPlayer.play();
            } else {
                await TrackPlayer.pause();
            }
        }
    };

    const nexttrack = async () => {
        if (trackIndex < podcastsCount - 1) {
            await TrackPlayer.skipToNext();
            gettrackdata();
        };
    };

    const previoustrack = async () => {
        if (trackIndex > 0) {
            await TrackPlayer.skipToPrevious();
            gettrackdata();
        };
    };

    useEffect(() => {
        setupPlayer();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContainer}>
                <View style={styles.mainWrapper}>
                    <Image source={trackArtwork} style={styles.imageWrapper} />
                </View>
                <View style={styles.songText}>
                    <Text style={[styles.songContent, styles.songTitle]} numberOfLines={3}>{trackTitle}</Text>
                    <Text style={[styles.songContent, styles.songArtist]} numberOfLines={2}>{trackArtist}</Text>
                </View>
                <View>
                    <Slider
                        style={styles.progressBar}
                        value={progress.position}
                        minimumValue={0}
                        maximumValue={progress.duration}
                        thumbTintColor="#FFD369"
                        minimumTrackTintColor="#FFD369"
                        maximumTrackTintColor="#fff"
                        onSlidingComplete={async value => await TrackPlayer.seekTo(value)}
                    />
                    <View style={styles.progressLevelDuraiton}>
                        <Text style={styles.progressLabelText}>
                            {new Date(progress.position * 1000)
                                .toLocaleTimeString()
                                .substring(3)}
                        </Text>
                        <Text style={styles.progressLabelText}>
                            {new Date((progress.duration - progress.position) * 1000)
                                .toLocaleTimeString()
                                .substring(3)}
                        </Text>
                    </View>
                </View>
                <View style={styles.musicControlsContainer}>
                    <TouchableOpacity onPress={previoustrack}>
                        <Ionicons
                            name="play-skip-back-outline"
                            size={35}
                            color="#FFD369"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
                        <Ionicons name='play-skip-forward-outline' size={75}
                            color="#FFD369"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nexttrack}>
                        <Ionicons
                            name="play-skip-forward-outline"
                            size={35}
                            color="#FFD369"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default MusicPlayer;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222831',
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainWrapper: {
        width: width,
        height: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        alignSelf: "center",
        width: '90%',
        height: '90%',
        borderRadius: 15,
    },
    songText: {
        marginTop: 2,
        height: 70
    },
    songContent: {
        textAlign: 'center',
        color: '#EEEEEE',
    },
    songTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    songArtist: {
        fontSize: 16,
        fontWeight: '300',
    },
    progressBar: {
        alignSelf: "stretch",
        marginTop: 40,
        marginLeft: 5,
        marginRight: 5
    },
    progressLevelDuraiton: {
        width: width,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabelText: {
        color: '#FFF',
    },
    musicControlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        width: '60%',
    },
});
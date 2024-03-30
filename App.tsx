import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ExpoInstaStory from 'expo-insta-story';

export default function App() {

  const data = [
    {
      id: 1,
      avatar_image: 'https://patch.com/img/cdn20/shutterstock/24942087/20220206/044023/styles/patch_image/public/shutterstock-1114807187___06163948804.jpg?width=1200',
      user_name: 'Lexique',
      stories: [
        {
          story_id: 1,
          story:
            'https://patch.com/img/cdn20/shutterstock/24942087/20220206/044023/styles/patch_image/public/shutterstock-1114807187___06163948804.jpg?width=1200',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
          duration: 10, //This tells the duration of each screen
        },
        {
          story_id: 2,
          story:
            'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
          duration: 10,
        }
      ],
    },
    {
      id: 2,
      avatar_image:
        'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      user_name: 'Test User',
      stories: [
        {
          story_id: 1,
          story:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 1 swiped'),
          duration: 10,
        },
        {
          story_id: 2,
          story: 'https://demo-link/123-123-123.mp4',
          swipeText: 'Custom swipe text for this story',
          onPress: () => console.log('story 2 swiped'),
          duration: 10, // The duration of the video in seconds. Specifies how long the video will be displayed.=
          isVideo: true, // This field indicates that the item is a video. When passing a video URL, make sure to include this field.
        }
      ],
    }
  ];


  return (
    <View style={styles.container}>
      <Text>Open up App.tsx ssssto start working on your app!</Text>
      <ExpoInstaStory data={data} duration={10} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native'; // FlatList를 import 합니다.
import YoutubePlayer from 'react-native-youtube-iframe';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

const fetchLikedVideos = async (userEmail) => {
    try {
        const likedVideosSnapshot = await getDocs(collection(firestore, "users", userEmail, "LikedVideos"));
        if (!likedVideosSnapshot.empty) {
            const likedVideos = [];
            likedVideosSnapshot.forEach((doc) => {
                console.log("Document ID: ", doc.id, " => ", doc.data());
                likedVideos.push({ id: doc.id, ...doc.data() });
            });

            return likedVideos;
        } else {
            console.log("No liked videos found");
        }
    } catch (e) {
        console.error("Error getting documents: ", e);
    }
};





const LikedVideosScreen = ({ navigation, isLoggedIn, userEmail }) => {
    
    const fetchVideos = async () => {
        const fetchedVideos = await fetchLikedVideos(userEmail);
        setVideos(fetchedVideos);
    }


    const removeFavorite = async (video) => {

        if(!isLoggedIn) {
            Alert.alert(
                '경고!',
                '해당 영상을 즐겨 찾기에서 삭제하실려면 로그인을 해주세요',
                [
                    {
                      text: '예',
            
                      onPress: () => navigation.navigate('로그인'),
                    }
                ]
            );
            return;
        }
    
    
        console.log(video);


        try {
            const userSnapshot = await getDoc(doc(firestore, "users", userEmail));
            if (userSnapshot.exists()) {
                const docRef = collection(firestore, "users", userEmail, "LikedVideos");
                const querySnapshot = await getDocs(docRef);
                querySnapshot.forEach((document) => {
                    if(document.id === video.id) {
                        deleteDoc(doc(firestore, "users", userEmail, "LikedVideos", document.id))
                            .then(() => {
                                console.log("Document deleted with ID: ", document.id);
                                Alert.alert(
                                    '성공!',
                                    '해당 영상이 즐겨찾기에서 삭제 되었습니다!'
                                );
                                fetchVideos();
                            })
                            .catch((error) => {
                                console.error("Error deleting document: ", error);
                            });
                    }
                });
            } else {
                console.error("User not found");
            }
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
        
        
    
    };
    
    useFocusEffect(
        React.useCallback(() => {
            if (!isLoggedIn ) {

                Alert.alert(
                    '경고!',
                    '즐겨찾는 영상을 보실려면 로그인을 해주세요',
                    [
                        {
                          text: '예',
                
                          onPress: () => navigation.navigate('로그인'),
                        }
                    ],
                );

                
                return;
            }else {
                fetchVideos();
            }
        }, [isLoggedIn, userEmail])
    );

    const [videos, setVideos] = useState([]);

    return (
    
        <View style={styles.container}>
            <Text style={styles.title}>즐겨 찾는 영상</Text>
            <FlatList
                data={videos}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity onPress={() => removeFavorite (item)}>
                                <Text style={{color: 'red'}}><MaterialIcons name="delete" size={24} color="red" /> 삭제하기</Text>
                            </TouchableOpacity>
                            <YoutubePlayer
                        height={300}
                        videoId={item.videoId}
                    />
                    </View>
                    
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },


    container: {
        padding: 15
    }
});


export default LikedVideosScreen;

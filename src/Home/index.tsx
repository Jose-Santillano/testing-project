import { useEffect, useState } from 'react';
import { ImageSourcePropType, View, Text } from 'react-native';
import { Camera, CameraType, FaceDetectionResult } from 'expo-camera';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import * as FaceDetector from 'expo-face-detector';

//Estilos
import { styles } from './styles';

//Imagenes
import neutralImg from '../assets/neutral-face.png';
import smilingImg from '../assets/smile-face.png';
import winkingImg from '../assets/winking-face.png';


export function Home() {
 
  const [faceDetected, setFaceDetected] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [emoji, setEmoji] = useState<ImageSourcePropType>(neutralImg);

  const faceValues = useSharedValue({
    width: 0,
    height: 0,
    x: 0,
    y: 0
  });

  function  handleFacesDetected({ faces }: FaceDetectionResult) {
    //console.log(faces);

    const face = faces[0] as any;

    if(face){
      const { size, origin } = face.bounds;

      faceValues.value = {
        width: size.width,
        height: size.height,
        x: origin.x,
        y: origin.y,
      }

      setFaceDetected(true);

      if(face.smilingProbability > 0.5){
        setEmoji(smilingImg);
      }else if(face.leftEyeOpenProbability > 0.5 || face.rightEyeOpenProbability > 0.5){
        setEmoji(winkingImg);
      }
      else{
        setEmoji(neutralImg);
      }
    }else{
      setFaceDetected(false);
    }
 
  }

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute', 
    zIndex: 1,
    width: faceValues.value.width,
    height: faceValues.value.height,
    transform: [
      { translateX: faceValues.value.x },
      { translateY: faceValues.value.y },
    ],
  }));

  useEffect(() => {
    requestPermission();

  }, []);

  useEffect(() => {
      if(emoji.toString() === '1'){
        console.log("Sonriendo");
      }else if(emoji.toString() === '2'){
        console.log("Alegre");
      }else{
        console.log("Neutro")
      }
  }, [emoji])
  
  if(!permission?.granted){
    return;
  }

  /* No se muestra la cara pero la IA si reconoce los gestos, hay que arreglar
    {
        faceDetected && 
        <Animated.Image
          style={animatedStyle} 
          source={emoji}
        />
      }
  */
  return (
    <View style={styles.container}>

      {
        faceDetected && 
        <Text> ---- Expresion : {
            emoji.toString() === '1' ? 'Neutro' : emoji.toString() === '2' ? 'Alegre' : 'Neutro'
          }</Text>
      }

        <Camera 
            style={styles.camera} 
            type={CameraType.front}
            onFacesDetected={handleFacesDetected}
            faceDetectorSettings={{ 
              mode: FaceDetector.FaceDetectorMode.fast,
              detectLandMarks: FaceDetector.FaceDetectorLandmarks.all,
              runClassifications: FaceDetector.FaceDetectorClassifications.all,
              minDetectionInterval: 100,
              tracking: true,
            }}
          />         
    </View>
  );
}

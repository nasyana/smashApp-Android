// @flow
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import firebaseInstance from '../config/Firebase'; // import the firebaseInstance you created

const firestore = firebaseInstance.firestore;
export type Picture = {
   uri: string,
   width: number,
   height: number,
};

type UploadOptions = {
   returnedImageFromCameraOrPicker: ImagePicker.ImagePickerResult;
   postId: string;
   progressCallbackFunction: (progress: number) => void;
   isVideo?: boolean;
   size?: string;
};


/// add constructor



const id = () =>
   Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

const nId = () => Math.floor(Math.random() * 10);

const small = 200;
export default class ImageUpload {



   // create constructor

   constructor(options: UploadOptions) {
      this.options = options;
   }
   static uid(): string {
      return `${id()}${id()}-${id()}-${id()}-${id()}-${id()}${id()}${id()}`;
   }

   static teamCode(): string {
      return `${nId()}${nId()}${nId()}${nId()}`;
   }

   static async preview({ uri }: Picture): Promise<string> {
      const result = await ImageManipulator.manipulateAsync(
         uri,
         [{ resize: { width: 5, height: 5 } }],
         {
            base64: true,
            format: 'png',
         },
      );
      return `data:image/jpeg;base64,${result.base64 || ''}`;
   }

   static async savePictureLocally(
      pic: Picture,
      postId: string,
   ): Promise<boolean> {
      let savedPicLocally = false;

      if (pic && postId) {

         try {

            await AsyncStorage.setItem(postId, JSON.stringify(pic));
            savedPicLocally = true;

            // console.log('saved locally!!')
         } catch (e) {
            // saving error
            // console.log("unable to save local pic", e);
         }
      }

      return savedPicLocally;
   }

   static async deletePictureLocally(postId: string): Promise<boolean> {
      let deletedPicLocally = false;

      if (postId) {
         try {
            await AsyncStorage.removeItem(postId);
            deletedPicLocally = true;
         } catch (e) {
            // delete error
            // console.log("unable to delete local pic", e);
         }
      }

      return deletedPicLocally;
   }

   static async getLocalPic(postId: string): Promise<Picture> {
      let pic: Picture = null;
      if (postId) {
         try {
            const picString = await AsyncStorage.getItem(postId);
            pic = JSON.parse(picString);
         } catch (e) {
            // get error
            // console.log("unable to get local pic", e);
         }
      }

      return pic;
   }


   static async uploadMedia({
      returnedImageFromCameraOrPicker,
      postId = '123',
      progressCallbackFunction,
      isVideo = false,
      size = 'full',
   }: UploadOptions) {
      if (!returnedImageFromCameraOrPicker.cancelled) {
         // Prepare the file for upload
         const response = await fetch(returnedImageFromCameraOrPicker.uri);
         const blob = await response.blob();

         // Create a unique file name based on the postId and current timestamp
         const fileName = `${postId}_${new Date().getTime()}.${isVideo ? 'mp4' : 'jpg'}`;

         // Create a reference to the file in Firebase Storage
         const fileRef = ref(storage, `images/${size}/${fileName}`);

         // Upload the file to Firebase Storage
         const uploadTask = uploadBytesResumable(fileRef, blob);

         // Monitor the upload progress and call the provided callback function
         uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressCallbackFunction(progress);
         });

         // Get the uploaded file's download URL and update the Firestore document
         try {
            await uploadTask;
            const downloadURL = await getDownloadURL(fileRef);

            // Update the 'picture.uri' field in the 'posts' collection
            const postRef = doc(firestore, 'posts', postId);
            await updateDoc(postRef, { 'picture.uri': downloadURL });

            console.log('Upload and update successful');

            return downloadURL;
         } catch (error) {
            console.error('Error uploading and updating the image:', error);
            return false
         }
      }

   }

   static async upload(returnedImageFromCameraOrPicker, postId = '123', progressCallbackFunction, isVideo = false, size = 'full') {
      return new Promise(async (resolve, reject) => {
        const ogPic = returnedImageFromCameraOrPicker;
        let picture = {};
    
        if (postId && !isVideo) {
          picture = await ImageManipulator.manipulateAsync(
            ogPic.uri,
            [
              {
                resize: {
                  width: size == 'small' ? small : 800,
                  // height:
                  //    size == 'small'
                  //       ? small * (ogPic.height / ogPic.width)
                  //       : 800 * (ogPic.height / ogPic.width),
                },
              },
            ],
            {
              base64: true,
              format: 'jpeg',
              compress: Platform.OS === 'android' ? 0.8 : 0.5,
            },
          );
    
         //  await ImageUpload.savePictureLocally(picture, postId);
        } else if (!isVideo) {
          picture = await ImageManipulator.manipulateAsync(
            ogPic.uri,
            [
              {
                resize: {
                  width: size == 'small' ? small : 800,
                  height:
                    size == 'small'
                      ? small * (ogPic.height / ogPic.width)
                      : 800 * (ogPic.height / ogPic.width),
                },
              },
            ],
            { base64: true, format: 'jpeg', compress: 0.5 },
          );
    
         //  await ImageUpload.savePictureLocally(picture, postId);
        } else if (isVideo) {
          picture = ogPic;
        } else {
          picture = ogPic;
        }
    
        console.log('picture in upload', picture);
        try {
          const response = await fetch(picture.uri);
          const blob = await response.blob();
    
          const storageRef = ref(firebaseInstance.storage, `${isVideo ? 'videos' : 'images'}/${postId}/${size}_${new Date().getTime()}`);
          const uploadTask = uploadBytesResumable(storageRef, blob, { contentType: isVideo ? 'video/mp4' : 'image/png' });
          
          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressCallbackFunction(progress);
          }, (error) => {
            console.error('Error uploading file: ', error);
          }, async () => {
            // Upload completed successfully, now we can get the download URL
            console.log('picupload try to getDownloadURL');
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('picupload try to downloadURL2', downloadURL, 'tiko', postId);
            // Save the download URL to Firestore
            //  const postRef = doc(firebaseInstance.firestore, 'posts', postId);
            //  await setDoc(postRef, { picture: {uri: downloadURL} }, { merge: true });
            console.log('picupload try to downloadURL3', downloadURL);
            // Return the download URL
    
            resolve(downloadURL);
          });
        } catch (error) {
          console.error('Error uploading file: ', error);
          throw error;
        }
      });
    }
    

   static async uploadOld(
      ogPic: Picture,
      postId: string,
      progressCallback,
      isVideo,
      size = 'full',
   ): Promise<string> {
      let picture = null;

      // // console.log('postId from upload function', postId)

      if (postId && !isVideo) {
         picture = await ImageManipulator.manipulateAsync(
            ogPic.uri,
            [
               {
                  resize: {
                     width: size == 'small' ? small : 800,
                     // height:
                     //    size == 'small'
                     //       ? small * (ogPic.height / ogPic.width)
                     //       : 800 * (ogPic.height / ogPic.width),
                  },
               },
            ],
            {
               base64: true,
               format: 'jpeg',
               compress: Platform.OS === 'android' ? 0.8 : 0.5,
            },
         );

         await ImageUpload.savePictureLocally(picture, postId);


      } else if (!isVideo) {
         picture = await ImageManipulator.manipulateAsync(
            ogPic.uri,
            [
               {
                  resize: {
                     width: size == 'small' ? small : 800,
                     height:
                        size == 'small'
                           ? small * (ogPic.height / ogPic.width)
                           : 800 * (ogPic.height / ogPic.width),
                  },
               },
            ],
            { base64: true, format: 'jpeg', compress: 0.5 },
         );

         await ImageUpload.savePictureLocally(picture, postId);
      } else if (isVideo) {
         picture = ogPic;
      } else {
         picture = ogPic;
      }

      const blob = await new Promise((resolve, reject) => {
         const xhr = new XMLHttpRequest();
         // eslint-disable-next-line
         xhr.onload = function () {
            resolve(xhr.response);
         };
         // eslint-disable-next-line
         xhr.onerror = function (e) {
            // eslint-disable-next-line
            // console.log(e);
            reject(new TypeError('Network request failed'));
         };

         xhr.responseType = 'blob';
         xhr.open('GET', picture.uri, true);

         xhr.send(null);
      });

      const naseApp = firebaseInstance.storage;

      naseApp.setMaxUploadRetryTime(770000000);

      naseApp.setMaxOperationRetryTime(770000000);


      const ref = firebaseInstance.storage.ref().child(ImageUpload.uid());

      let uploadTask = ref.put(blob);

      return new Promise((resolve, reject) => {
         uploadTask.on(
            firebaseInstance.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
               var progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

               if (progressCallback) {
                  progressCallback(parseInt(progress));
               }

               switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED:
                     break;
                  case firebase.storage.TaskState.RUNNING:
                     break;
               }
            },
            (error) => {

               switch (error.code) {
                  case 'storage/unauthorized':
                     reject(
                        "User doesn't have permission to access the object",
                     );
                     break;

                  case 'storage/canceled':
                     // User canceled the upload
                     reject('User canceled the upload');
                     break;

                  case 'storage/unknown':
                     break;
               }
            },
            () => {
               // Upload completed successfully, now we can get the download URL
               uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  this.downloadURL = downloadURL;

                  if (progressCallback) {
                     progressCallback(false);
                  }
                  resolve(downloadURL);
               });
            },
         );
      });

      //const downloadURL = await snapshot.ref.getDownloadURL();
      return this.downloadURL;
   }
}

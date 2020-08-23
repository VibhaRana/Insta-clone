import React, {useState} from 'react'
import './ImageUpload.css'
import firebase from 'firebase'
import {storage, db} from './firebase.js'
import Button from '@material-ui/core/Button';

//Working on Storing IG posts and images in Firebase

function ImageUpload({username}) {
    const[caption, setCaption] = useState('')
    const[image, setImage] = useState(null)
    const[progress, setProgress] = useState(0)
    
    const handleCaption = (event) => {
        setCaption(event.target.value)
    }

    const handleChange = (e) => {
        //Get the first file you selected
        if(e.target.files[0]) {
            setImage(e.target.files[0])

        }
    }

    const handleUpload = () => {
        //Its basically a code snippet for uploading files.
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (error) => {
                //Error function
                console.log(error)
                alert(error.message)
            },
            () => {
                //complete function. Its again snippet. it gets the download link of image which is already uploaded
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    //post image inside db
                    db.collection('posts').add({
                        //serverTimestamp gives consistent time irrevalent wherever you are in world, and keep the new posts on top
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl : url,
                        username : username
                    })
                    // once its done, set it back to normal
                    setProgress(0)
                    setCaption('')
                    setImage(null)
                })
            }
        )

    }

    return (
        <div className = 'imageupload'>
      
            {/* I want to have ...*/}
            {/* Caption Input */}
            {/* File Picker */}
            {/* Post Button */} 

            <progress className = 'imageupload_progress' value = {progress} max = '100' />
            <input type = 'text' placeholder = 'Enter your caption' onChange = {handleCaption} value = {caption} />
            <input type = 'file' onChange={handleChange}/>
            <Button onClick = {handleUpload}>
                Upload
            </Button>

        </div>
    )
}

export default ImageUpload

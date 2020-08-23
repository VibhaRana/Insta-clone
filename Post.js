import React, {useState, useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase'

function Post({postId, user, username, caption, imageUrl}) {
    const[comments, setComments] = useState([])
    const[comment, setComment] = useState('')

    //code snippet for adding comments 
    useEffect(() => {
        let unsubscribe
        if(postId) {
            unsubscribe = db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp' , 'desc')
            .onSnapshot((snapshot) =>   {
                setComments(snapshot.docs.map(doc => doc.data()))
            })
        }
        return () => {
            unsubscribe()
        }
    }, [postId])

    function postComment(e){
        //submit your comment to database for that specific post
        e.preventDefault()
        //code snippet for posting comment
        db.collection('posts')
        .doc(postId) 
        .collection('comments')
        .add({
           //Note - user is the person who signed in, username is the person who is writing comment
            text : comment,
            username : user.displayName,
           timestamp :  firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return (
        <div className = 'post'>
        <div className = 'post_header'>
        <Avatar 
            className = 'post_avatar'
            alt = ''
            src = '/static/images/avatar/1.jpg'
        />
           <h3>{username}</h3>
            {/* header -> avatar + username */}
        </div>
       

            <img class = 'post_image' src = {imageUrl} alt = 'profile'/>
            {/* image */}

            <h4 className = 'post_text'><strong>{username}:</strong>  {caption}</h4>
             <div className = 'post_comment'>
             {comments.map((comment) => {
                return (
                    <p>
                    <strong>{comment.username}</strong> : {comment.text}
                    </p>
                )
            })}
             </div>
           
            {/* username + caption */}
            <form className = 'post_commentBox'>
                <input 
                    className = 'post_input'
                    type = 'text'
                    placeholder = 'Add a comment'
                     value = {comment}
                    onChange={(e) => setComment(e.target.value)}

                />
                <button
                disabled = {!comment}
                className = 'post_button'
                type = 'submit'
                onClick={postComment}
                >
                Post
                </button>
            </form>
        </div>
    )
}

export default Post

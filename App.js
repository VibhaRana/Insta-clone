import React, {useState, useEffect} from 'react'
import Post from './Post'
import {db, auth} from './firebase'
import InstagramEmbed from 'react-instagram-embed'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import ImageUpload from './ImageUpload'

import './App.css';

function getModalStyle() {
  const top = 50 
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App(props) {
  const classes = useStyles()
  const[modalStyle] = useState(getModalStyle)

  const[posts, setPosts] = useState([])
  const[open, setOpen] = useState(false) 
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')
  const[username, setUsername] = useState('')
  const[user, setUser] = useState(null)
  const[openSignIn, setOpenSignIn] = useState('')

  useEffect(() => {
    //this piece of code is backend listener
   const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        // user has logged in ...
        console.log(authUser)
        setUser(authUser)    

        if(authUser.displayName) {
          // dont update username

        }else{
          //if we just created someone
          return authUser.updateProfile({
            displayName: username
          })
        }


      }else{
        // user has logged out
        setUser(null)
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe()
    }
  }, [user, username])
 

  //useEffect- runs a piece of code on a condition, in this case code will run every single time code change
  useEffect(() => {
    //this is where code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //snapshot do is - every time a new post is added, the code fires...
      setPosts(snapshot.docs.map(doc => ({
        id : doc.id,
       post :  doc.data()
      })))

    })

  }, [posts])

  const signUp = (event) => {
    event.preventDefault()
    setOpen(true)

    auth.createUserWithEmailAndPassword(email, password)
    //this gives back authUser
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName : username
      })
    })
    .catch((error) => alert(error.message))
  }

  
  const handleClose = () => {
    setOpen(false)
  }

  const signIn = (event) => {
    event.preventDefault()

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))
     
  }

 

  return (
  <div className="app">
     <Modal
      open={open}
      onClose={handleClose}
      >
   <div style={modalStyle} className={classes.paper}>
   <form className = 'app_signup'>
       <center>
         <img 
          src = 'https://3j6x6z2bx1qq1aawwt3b6y0a-wpengine.netdna-ssl.com/wp-content/uploads/post/instagram-logo.png'
           className = 'app_headerImage'
           alt = ''
         />
         </center>

          <Input 
             placeholder = 'username'
             type = 'text'
             value={username}
             onChange = {(e) => setUsername(e.target.value)}
           />
           <Input 
             placeholder = 'email'
             type = 'text'
             value={email}
             onChange = {(e) => setEmail(e.target.value)}
           />

           <Input 
             placeholder = 'password'
             type = 'password'
             value={password}
             onChange = {(e) => setPassword(e.target.value)}
           />
             <Button type = 'submit' onClick = {signUp}>Sign Up</Button>
       </form>
       </div>
        </Modal>
        

        {/* Modal for sign in button */}
        <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        >
        <div style={modalStyle} className={classes.paper}>
       <form className = 'app_signup'>
         <center>
         <img 
          src = 'https://3j6x6z2bx1qq1aawwt3b6y0a-wpengine.netdna-ssl.com/wp-content/uploads/post/instagram-logo.png'
           className = 'app_headerImage'
           alt = ''
         />
         </center>

        
           <Input 
             placeholder = 'email'
             type = 'text'
             value={email}
             onChange = {(e) => setEmail(e.target.value)}
           />

           <Input 
             placeholder = 'password'
             type = 'password'
             value={password}
             onChange = {(e) => setPassword(e.target.value)}
           />
             <Button type = 'submit' onClick = {signIn}>Sign In</Button>
       </form>
       </div>
        </Modal>


    <div className = 'app_header'>
      <img 
        src = 'https://3j6x6z2bx1qq1aawwt3b6y0a-wpengine.netdna-ssl.com/wp-content/uploads/post/instagram-logo.png'
        alt = 'profile'
      />
       {user ? (
      <Button onClick={() => auth.signOut()}>Logout</Button>
    ) : (
      <div className = 'app_loginContainer'>
      <Button onClick = {() => setOpenSignIn(true)}>Sign In</Button>
       <Button type = 'submit' onClick = {() => setOpen(true)}>Sign Up</Button>

      </div>
    )}
    </div>

    <div className = 'app_posts'>
    <div className = 'app_postsLeft'>
    {
      posts.map(({id, post}) => (
        <Post 
          postId = {id}
          key = {id}
          user = {user}
          username = {post.username}
          caption = {post.caption}
          imageUrl = {post.imageUrl}
        />
      ))
    }
    </div>
    <div className = 'app_postsRight'>
    <InstagramEmbed
    url='https://instagr.am/p/Zw9o4/'
    maxWidth={320}
    hideCaption={false}
    containerTagName='div'
    protocol=''
    injectScript
    onLoading={() => {}}
    onSuccess={() => {}}
    onAfterRender={() => {}}
    onFailure={() => {}}
    />
    </div>
    </div>

   
   
   

    {/* <Button onClick = {signUp}>Sign Up</Button> */}
   
   
     {/* If user has logged in.. */}
  {user?.displayName ? (
    <ImageUpload 
      username={user.displayName}
    />
  ) : 
 
    (
      <h3>Sorry, you need to login to upload</h3>
      )
  }
   
    
    </div>
  );
}

export default App;

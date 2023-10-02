 import "./rightbar.css"
import Online from "../online/Online";
import {useEffect, useState, useContext, useRef} from "react";
import {io} from "socket.io-client";
import ChatOnline from "../chatOnline/ChatOnline";
import axios from "axios";
import {axiosInstance} from "../../config";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {Add, Remove, FileUpload} from "@mui/icons-material";
import EditProfile from "../editProfile/EditProfile";
import { useAuth, uploadPFP } from "../../firebase";

export default function Rightbar({user}) { //user refers to user that rightbar is being generated for
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const {user: currentUser, dispatch} = useContext(AuthContext);
  const [followed,  setFollowed] = useState(false);
  const [city, setCity] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("");

  useEffect(()=> { //obtain all of user's friends 
    const getFriends = async () => {
      try{
        // console.log(user)
        const friendList = await axiosInstance("/users/friends/" + user._id);
        setFriends(friendList.data);
      } catch(err){
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  useEffect(() => { //ensure follow button renders correctly
    setFollowed(currentUser.following.includes(user?._id))
  }, [user]);
  
  useEffect(() => { //updates the user info in rightbar
    if (user?.username === currentUser.username) {
      setCity(currentUser?.city);
      setCourse(currentUser?.course);
      setStatus(currentUser?.relationship);
    }
    else {
      setCity(user?.city);
      setCourse(user?.course);
      setStatus(user?.relationship);   
    }
  }, [user, currentUser])
  
  const handleClick = async () => { //function that handles clicking of follow button
    // console.log(user);
    try{
      if(followed){
        await axiosInstance.put("/users/"+ user._id + "/unfollow", {
          userID: currentUser._id
        })
        dispatch({type:"UNFOLLOW", payload: user._id})
      } else {
        await axiosInstance.put("/users/"+ user._id + "/follow", {
          userID: currentUser._id
        })
        dispatch({type:"FOLLOW", payload: user._id})
      }
      setFollowed(!followed);
    } catch(err){
      console.log(err);
    }
  }

  const ProfileRightBar = () => {
    // const firebaseUser = useAuth();
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
    
    function handleChange(e) { //add photo to state
      if (e.target.files[0]) {
        setPhoto(e.target.files[0])
      }
    }
  
    const handleUpload = async(e) =>  { 
      // upload photo to firebase
      const pfpURL = await uploadPFP(photo, user._id);
      // console.log(pfpURL)
      // upload URL to mongoDB
      await axiosInstance.put("/users/"+ user._id, { 
        userID: currentUser._id,  
        profilePicture: pfpURL
      });
      window.location.reload()
      console.log(currentUser)
    }


    return (
      <>
      {user.username !== currentUser.username && (
        <button className="rightbarFollowButton" onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <Remove/> : <Add/>}
        </button>
      )}
      
      <label htmlFor="files" className="uploadPhoto">
        <FileUpload className="shareIcon"/>
        <span className="shareOptionText">Upload profile picture</span>
        {/* allows files to be selected and only the first file is used */}
        <input 
            style={{display:"none"}} 
            type="file" 
            id="files" 
            accept=".png,.jpeg,.jpg" 
            onChange={handleChange}
        />
      </label>
      <button disabled={loading || !photo} onClick={handleUpload}>Upload</button>
      
      {user.username === currentUser.username && <EditProfile/>}

      <h4 className="rightbarTitle">User Information</h4>
      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">City:</span>
          <span className="rightbarInfoValue">{city}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Course:</span>
          <span className="rightbarInfoValue">{course}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Status:</span>
          <span className="rightbarInfoValue">{status}</span>
        </div>
      </div>
      <h4 className="rightbarTitle">User friends</h4>
      <div className="rightbarFollowings">
        {friends?.map((friend) => (
          <Link to = {"/profile/" + friend.username} style={{textDecoration:"none"}}> 
            <div className="rightbarFollowing">
              <img src = {
                    friend.profilePicture
                    ? friend.profilePicture
                    : PF + "noProfilePic.jpg"
                  } 
                  alt="" 
                  className="rightbarFollowingImg" 
              />
              <span className="rightbarFollowingName">{friend.username}</span>
            </div>
          </Link>
        ))}
      </div>
      </>
    )
  }
  
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightBar/>: null}
      </div>
    </div>
  )
}

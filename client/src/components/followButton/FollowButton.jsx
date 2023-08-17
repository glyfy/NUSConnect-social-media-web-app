import React from 'react';
import "./followButton.css";
import {MoreVert, Add, Remove} from "@mui/icons-material";
import { useState, useEffect, useContext } from "react";
import {format} from "timeago.js";
import {Link} from "react-router-dom";
import axios from "axios";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";

export default function FollowButton({user}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user: currentUser, dispatch} = useContext(AuthContext);
    const [followed,  setFollowed] = useState(false);
    useEffect(() => { //ensure follow button reflects correct status
        setFollowed(currentUser.following.includes(user?._id))
      }, [user]);
      
      const handleClick = async () => {
        // console.log(user);
        try{
          if(followed){
            await axiosInstance.put("/users/"+ user?._id + "/unfollow", { //unfollow user
              userID: currentUser._id
            })
            dispatch({type:"UNFOLLOW", payload: user?._id}) //dispatch unfollow action to Context
            setFollowed(!followed)
          } else {
            await axiosInstance.post("/conversations", { //create new conversation
              senderId: currentUser._id,
              receiverId: user?._id
            })
            await axiosInstance.put("/users/"+ user._id + "/follow", { //follow user  
              userID: currentUser._id
            })
            dispatch({type:"FOLLOW", payload: user._id}) //dispatch follow action to Context
            setFollowed(!followed)
          }
        }catch(err){
          console.log(err);
        }
      }
    return (
        <button className="followButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove/> : <Add/>}
        </button>
    )
}
import React from 'react'
import "./friendResult.css"
import {MoreVert, Add, Remove} from "@mui/icons-material";
import { useState, useEffect } from "react";
import {format} from "timeago.js";
import {Link} from "react-router-dom";
import axios from "axios";
import { axiosInstance } from "../../config";
import FollowButton from "../followButton/FollowButton";

export default function FriendResult({ user }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  
    return (
      <div className="searchResult">
        <div className="searchResultWrapper">
          <div className="searchResultTop">
            <div className="searchResultTopLeft">
              <Link to={"profile/" + user.username}>
                <img
                  src={
                    user.profilePicture
                      ? user.profilePicture
                      : PF + "noProfilePic.jpg"
                  }
                  alt=""
                  className="searchResultProfileImg"
                />
              </Link>
              <span className="searchResultUsername">{user.username}</span>
            </div>
            <div className="searchResultTopRight">
              <FollowButton user={user} />
              <div className="moreVertWrapper">
                <MoreVert />
              </div>
            </div>
          </div>
          <div className="searchResultCenter"></div>
          <div className="searchResultBottom">
            <div className="searchResultBottomLeft"></div>
            <div className="searchResultBottomRight"></div>
          </div>
        </div>
      </div>
    );
};

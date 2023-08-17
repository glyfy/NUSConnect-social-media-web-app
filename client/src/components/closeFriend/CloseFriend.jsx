  import { useEffect, useState } from "react";
import "./closeFriend.css";
import axios from "axios";

export default function CloseFriend({userID}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  
  useEffect(() => { //adds names of friends to sidebar
    const fetchUser = async () => {
      const res = (await axiosInstance.get(`/users/?userID=${userID}`)).data;
      setUser(res);
    };
    fetchUser();
  }, []);
  
  return (
    <li className="sidebarFriend">
        <img 
          className="sidebarFriendImg" 
          src = { user.profilePicture ? user.profilePicture: PF + "noProfilePic.jpg" } 
          alt="" 
        />
        <span className="sidebarFriendName"> {user.username} </span>
        
    </li> 
  )
}

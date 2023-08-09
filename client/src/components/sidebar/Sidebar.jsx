import "./sidebar.css"
import {RssFeed, Event} from "@mui/icons-material";
import CloseFriend from "../closeFriend/CloseFriend";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


export default function Sidebar() {
  const {user} = useContext(AuthContext);
  return (
    <div className="sidebar"> 
      <div className="sidebarWrapper">
        <ul className="sidebarFriendList">
          <div className="sidebarFriendListHeader">Friends</div>
          {user.following.map(u => 
            <CloseFriend key={u} userID={u}/>  
          )}
        </ul>
      </div>
    </div>
  )
}

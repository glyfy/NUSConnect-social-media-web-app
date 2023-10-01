import "./topbar.css";
import {Search, Person, Chat, Notifications} from '@mui/icons-material';
import {Link, useHistory} from "react-router-dom";
import { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {logOut} from "../../apiCalls";
import { logout, useAuth } from "../../firebase";
import axios from "axios";

function Topbar() {
    const {user: currentUser, dispatch} = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const searchInput = useRef();
    const history = useHistory();
    const firebaseUser = useAuth();
    const [user, setUser] = useState(null)

    const handleLogOut = async () => {
        await logout();
        logOut(dispatch); //update context to set user to null
        window.location.reload(); //refresh page
    }

    const handleSearch = () => {
        history.push("/search/" + searchInput.current.value)
    }

    useEffect(() => { //set the user for the share.jsx (to keep profile picture updated)
        const fetchUser = async () => { //async function can only be declared inside main function
          const res = await axios.get(`/users/?userID=${currentUser._id}`);
          setUser(res.data);
        };
        fetchUser();
      }, [currentUser.profilePicture] //second argument lets you choose what variable change trigger the effect
    ) 
    
    return (
        <div className="topbarContainer">
            <div className="topbarLeft"> 
                <Link to="/" style={{textDecoration:"none"}}>
                    <span className="logo">NUSConnect</span>
                </Link>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                <Search className="searchIcon"/>
                    <form onSubmit={handleSearch}>            
                        <input 
                            className="searchInput"
                            placeholder="Search for friends"  
                            ref={searchInput}
                        />
                    </form>          
                </div>
            </div>

            <div className="topbarRight">
                <div className="topbarLinks">
                    {/* <span className="topbarLink">Home</span> */}
                    {/* <span className="topbarLink">Timeline</span> */}
                </div>
                <div 
                    className="logOutButton"
                    onClick={handleLogOut}
                >Logout</div>
                <Link to={"/profile/"+ currentUser.username}>
                    <img 
                    src={
                    user?.profilePicture
                        ? user?.profilePicture
                        : PF + "noProfilePic.jpg"
                    } 
                    alt="" className="topbarImg" 
                    />
                </Link>
            </div>
        </div>
    );
}

export default Topbar;
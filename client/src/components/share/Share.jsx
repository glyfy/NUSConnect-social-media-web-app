import "./share.css";
import {PermMedia, Label, Room, EmojiEmotions , Cancel} from "@mui/icons-material"
import { AuthContext } from "../../context/AuthContext";
import { useContext, useRef, useState } from "react";
import axios from "axios";
import { axiosInstance } from "../../config"
import { useAuth, uploadPost } from "../../firebase";
export default function Share() {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user:currentUser} = useContext(AuthContext);
    const desc = useRef(); //text that user wants to share
    const [file, setFile] = useState(null);
    const [user, setUser] = useState(null)

    // const  firebaseUser = useAuth();

    const handleUpload = async (e) => { // upload photo to firebase
        e.preventDefault();
        const newPost = {
            userID: currentUser._id,
            desc: desc.current.value //uses the reference JSX element
        };
        if(file){ // if file is uploaded
            // add file metainfo to newPost
            const fileName = Date.now() + file.name;
            newPost.img = fileName;
            try{
                const photoURL = await uploadPost(file, currentUser._id)
                newPost.downloadURL = photoURL;
            } catch(err) {
                console.log(err);
            }
        }
        // upload newPost info to mongoDB
        await axiosInstance.post("/posts", newPost);
        window.location.reload();
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
    <div className="share">
        <div className="shareWrapper">
            <div className="shareTop">
                <img    
                src={
                user?.photoURL
                    ? user?.photoURL
                    : PF + "noProfilePic.jpg"
                }  
                alt="" 
                className="shareProfileImg"/>
                <input 
                    placeholder = {"What's on your mind " + user.username + "?"} 
                    className = "shareInput" 
                    ref = {desc}    
                />
            </div>
            <hr className="shareHr"/>
            {file && (
                <div className="shareImgContainer">
                    <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
                    <Cancel className="shareCancelImg" onClick={() => setFile(null)}/>
                </div>
            )}
            <form className="shareBottom" onSubmit = {handleUpload}>
                <div className="shareOptions">
                    <label htmlFor="file" className="shareOption">
                        <PermMedia htmlColor="red" className="shareIcon"/>
                        <span className="shareOptionText">Photo</span>
                        {/* allows files to be selected and only the first file is used */}
                        <input 
                            style={{display:"none"}} 
                            type="file" 
                            id="file" 
                            accept=".png,.jpeg,.jpg" 
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </label>
                </div>
                <button className="shareButton" type="submit">Share</button>
            </form>

        </div>
    </div>
  )
}

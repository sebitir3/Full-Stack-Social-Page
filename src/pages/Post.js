import React, {useEffect, useState, useContext} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext";

function Post(){ 
    let {id} = useParams();
    const [postObj, setPostObj] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const {authState} = useContext(AuthContext);

    let navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            setPostObj(response.data);
        });

        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
           setComments(response.data);
        });
    }, []);

    const addComment = () => {
        axios
        .post("http://localhost:3001/comments", {
            commentBody: newComment, 
            PostId: id,
        },
        {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        }
        )
        .then((response) => {
            if(response.data.error) {
                console.log(response.data.error);
            } else {
                const commentToBeAdded = {commentBody: newComment, username: response.data.username}
                setComments([...comments, commentToBeAdded]);
                setNewComment("");
            }
        });
    };

    const deleteComment = (id) => {
        axios.delete(`http://localhost:3001/comments/${id}`, {
           headers: {accessToken: localStorage.getItem("accessToken")},
        }).then(()=> {
            setComments(
               comments.filter((val) => {
                   return val.id != id;
               })
            );
        });
    };

    const deletePost = (id) => {
        axios.delete(`http://localhost:3001/posts/${id}`, {
            headers: {accessToken: localStorage.getItem("accessToken")},
         }).then(() => {
            navigate("/");
        });
    };
 
    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div className="title"> {postObj.title}</div>
                    <div className="body"> {postObj.postText}</div>
                    <div className="footer"> 
                        {postObj.username} {authState.username === postObj.username && (
                            <button onClick={() => {
                                deletePost(postObj.id);
                            }}>Delete Post</button>
                        )}
                    </div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input 
                        type="text" 
                        placeholder="Comment.." 
                        value={newComment}
                        onChange={(event) => {setNewComment(event.target.value)}}
                    />
                    <button onClick={addComment}> Add Comments </button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return (
                            <div key={key} className="comment"> 
                                {comment.commentBody} 
                                <label> Username: {comment.username}</label>
                                {authState.username === comment.username && (
                                    <button 
                                     onClick={() => {
                                         deleteComment(comment.id);
                                        }}
                                    >
                                        Delete
                                  </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post;
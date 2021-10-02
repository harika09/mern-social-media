import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";
import moment from "moment";
import Axios from "axios";
import "./Following.css";
import Navbar from "../Navbar/Navbar";

function Following() {
  const [followingPost, setFollowingPost] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  const headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("Token"),
    },
  };

  const loadUserFollowing = async () => {
    const posts = await Axios.get(
      `http://localhost:4000/auth/following/users`,
      headers
    );

    setFollowingPost(posts.data.following);
    setIsLoading(false);
    console.log(posts.data.following);
  };

  useEffect(() => {
    loadUserFollowing();
  }, [followingPost]);
  return (
    <>
      <Navbar />
      <div className="following-container">
        <div className="following-content bd-container">
          {isloading ? (
            <div className="loading-animation">
              <HashLoader loading color="#4B5A82" size={75} />
            </div>
          ) : (
            <div className="following-posts-list">
              {followingPost.length === 0 ? (
                "No Posts"
              ) : (
                <div className="user-following-post">
                  {followingPost.map((posts, key) => {
                    return (
                      <div key={posts._id} className="user-posts-container">
                        <div className="top-post-content">
                          <div className="post-user-info">
                            <div>
                              <img src={posts.avatar} alt={posts.username} />
                            </div>
                            <div>
                              <span>{posts.username}</span>
                              <span>{moment(posts.createdAt).fromNow()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="follow-post-image">
                          <img src={posts.image} alt={posts.title} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Following;

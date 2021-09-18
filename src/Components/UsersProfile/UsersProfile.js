import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { BounceLoader } from "react-spinners";
import Axios from "axios";
import "../Profile/Profile.css";

function UsersProfile() {
  const history = useHistory();
  const params = useParams();
  const [profile, setProfile] = useState({});
  const [isloading, setLoading] = useState(true);
  const [post, setPost] = useState([]);

  const headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("Token"),
    },
  };

  const loadProfile = async () => {
    const profile = await Axios.get(
      `http://localhost:4000/auth/view/profile/${params.id}`,
      headers
    );

    setProfile(profile.data.user);
    setPost(profile.data.post);
    setLoading(false);
  };

  const bntLogout = () => {
    localStorage.clear();
    history.push("/login");
  };

  useEffect(() => {
    const Token = localStorage.getItem("Token");
    if (Token) {
      loadProfile();
    } else {
      useHistory.push("/login");
    }
  });

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-content bd-container">
          {isloading ? (
            <div className="loading-animation">
              <BounceLoader loading color="#e98580" />
            </div>
          ) : (
            <div className="profile-wrapper">
              <div className="profile-top-content">
                <div className="profile-avatar">
                  <img src={profile.avatar} alt={profile.username} />
                </div>

                <div className="profile-info">
                  <div className="profile-name">
                    <div>
                      <strong>{profile.username}</strong>
                    </div>

                    <div className="profile-btn">
                      <button className="btn-edit">
                        <i className="fas fa-cog"></i> Edit Profile
                      </button>
                      <button
                        className="btn-logout"
                        onClick={() => bntLogout()}
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                      </button>
                    </div>
                  </div>

                  <div className="profile-other-info">
                    <div className="profile-post">
                      <strong>{profile.post.length}</strong>
                      <span> {profile.likes.post <= 1 ? "Post" : "Posts"}</span>
                    </div>

                    <div className="profile-post">
                      <strong>{profile.likes.length}</strong>
                      <span>
                        {profile.likes.length <= 1 ? "Like" : "Likes"}
                      </span>
                    </div>

                    <div className="profile-post">
                      <strong>{profile.comments.length}</strong>
                      <span>
                        {profile.comments.length <= 1 ? "Comment" : "Comments"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bottom-container">
                {post.map((posts, key) => {
                  return (
                    <div key={posts._id} className="posts-content">
                      <img src={posts.image} alt="" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UsersProfile;

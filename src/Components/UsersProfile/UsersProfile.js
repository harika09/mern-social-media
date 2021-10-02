import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { HashLoader } from "react-spinners";
import Axios from "axios";
import "../Profile/Profile.css";

function UsersProfile() {
  const history = useHistory();
  const params = useParams();
  const [profile, setProfile] = useState({});
  const [isloading, setLoading] = useState(true);
  const [post, setPost] = useState([]);
  const [userId, setUserId] = useState("");
  let [id, setId] = useState(params.id);

  const headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("Token"),
    },
  };

  const loadProfile = async () => {
    const profile = await Axios.get(
      /* http://localhost:4000/ */ /* https://mern-social-konek.herokuapp.com */
      `https://mern-social-konek.herokuapp.com/auth/view/profile/${id}`,
      headers
    );

    setProfile(profile.data.user);
    setPost(profile.data.post);
    setLoading(false);
  };

  const btnFollow = (id) => {
    Axios.put(
      `https://mern-social-konek.herokuapp.com/auth/follow`,
      { requestedUserId: id },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("Token"),
        },
      }
    ).then((response) => {
      loadProfile();
    });
  };

  const btnUnFollow = (id) => {
    Axios.put(
      `https://mern-social-konek.herokuapp.com/auth/unfollow`,
      { requestedUserId: id },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("Token"),
        },
      }
    ).then((response) => {
      loadProfile();
    });
  };

  useEffect(() => {
    const Token = localStorage.getItem("Token");
    const userData = localStorage.getItem("User");
    const data = JSON.parse(userData);

    if (Token) {
      loadProfile();
      setUserId(data._id);
    } else {
      history.push("/login");
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-content bd-container">
          {isloading ? (
            <div className="loading-animation">
              <HashLoader loading color="#4B5A82" size={75} />
            </div>
          ) : (
            <div className="profile-wrapper">
              <div className="profile-top-content">
                <div className="profile-avatar">
                  <img src={profile.image} alt={profile.username} />
                </div>

                <div className="profile-info">
                  <div className="profile-name">
                    <div>
                      <strong>{profile.username}</strong>
                    </div>

                    {profile.followers.includes(userId) ? (
                      <div className="profile-btn">
                        {profile._id !== userId ? (
                          <button
                            onClick={() => {
                              btnUnFollow(profile._id);
                            }}
                            className="btn-follow"
                          >
                            Following
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      <div className="profile-btn">
                        {profile._id !== userId ? (
                          <button
                            onClick={() => {
                              btnFollow(profile._id);
                            }}
                            className="btn-follow"
                          >
                            Follow
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  </div>

                  <div className="profile-other-info">
                    <div className="profile-post">
                      <strong>{profile.post.length}</strong>
                      <span> {profile.likes.post <= 1 ? "Post" : "Posts"}</span>
                    </div>

                    <div className="profile-post">
                      <strong>{profile.followers.length}</strong>
                      <span>
                        {profile.followers.length <= 1
                          ? "Follower"
                          : "Followers"}
                      </span>
                    </div>

                    <div className="profile-post">
                      <strong>{profile.following.length}</strong>
                      <span>
                        {profile.comments.following <= 1
                          ? "Following"
                          : "Following"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bottom-container">
                {post.map((posts, key) => {
                  return (
                    <div key={posts._id} className="posts-content">
                      <Link to={`/view/post/${posts._id}`}>
                        <img src={posts.image} alt="" />
                      </Link>
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

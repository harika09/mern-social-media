import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { HashLoader, BeatLoader } from "react-spinners";
import moment from "moment";
import Axios from "axios";
import "./Following.css";
import Navbar from "../Navbar/Navbar";

function Following() {
  const history = useHistory();
  let PAGE_NUMBER = 0;
  let [page, setPage] = useState(PAGE_NUMBER);
  const [followingPost, setFollowingPost] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [pageLoad, setPageLoad] = useState(true);
  const [maxPage, setMaxPage] = useState("");

  const headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("Token"),
    },
  };

  const loadUserFollowing = async () => {
    const posts = await Axios.get(
      `http://localhost:4000/auth/following/users?page=${page}`,
      headers
    );

    setFollowingPost([...followingPost, ...posts.data.following]);
    setMaxPage(posts.data.totalPage);
    setIsLoading(false);
    setPageLoad(false);

    console.log(posts);
  };

  useEffect(() => {
    const checkToken = localStorage.getItem("Token");
    if (checkToken) {
      loadUserFollowing();
    } else {
      history.push("/login");
    }
  }, []);

  useEffect(() => {
    if (pageLoad) {
      setIsLoading(false);
    }

    loadUserFollowing();
    // userInfo();

    window.onscroll = infiniteScroll;

    // This variable is used to remember if the function was executed.
    let isExecuted = false;

    function infiniteScroll() {
      // Inside the "if" statement the "isExecuted" variable is negated to allow initial code execution.
      if (
        window.scrollY > document.body.offsetHeight - window.outerHeight &&
        !isExecuted
      ) {
        // Set "isExecuted" to "true" to prevent further execution
        isExecuted = true;
        if (page === maxPage) {
          setIsLoading(false);
        } else {
          setIsLoading(true);
          setTimeout(() => {
            setPage(page + 1);
          }, 1500);
        }

        // After 1 second the "isExecuted" will be set to "false" to allow the code inside the "if" statement to be executed again
      }
    }
  }, [page]);

  return (
    <>
      <Navbar />
      <div className="following-container">
        <div className="following-content bd-container">
          {pageLoad ? (
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
                        <div className="following-top-post-content">
                          <div className="following-post-user-info">
                            <div className="following-user-image">
                              <Link to={`/view/profile/${posts.userId}`}>
                                <img src={posts.avatar} alt={posts.username} />
                              </Link>
                            </div>
                            <div className="user-following-info">
                              <Link to={`/view/profile/${posts.userId}`}>
                                <span>{posts.username}</span>
                              </Link>
                              <span>{moment(posts.createdAt).fromNow()}</span>
                            </div>
                          </div>
                        </div>
                        <hr className="profile-line" />
                        <div className="follow-post-image">
                          <Link to={`/view/post/${posts._id}`}>
                            <img src={posts.image} alt={posts.title} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {isloading && (
            <BeatLoader
              className="following-pagination-animation"
              loading
              color="#e98580"
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Following;

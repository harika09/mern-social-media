import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { BeatLoader } from "react-spinners";
import Navbar from "../Navbar/Navbar";
import Modal from "react-modal";
import moment from "moment";
import Axios from "axios";
import "./Home.css";

function Home() {
  let PAGE_NUMBER = 0;
  let [page, setPage] = useState(PAGE_NUMBER);
  const history = useHistory();
  const [isloading, setLoading] = useState(true);
  const [pageLoad, setPageLoad] = useState(true);
  const [post, setPost] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [postId, setPostId] = useState({});
  const [userId, setUserId] =
    useState(""); /* Check is userId is in the post like Array */
  const [maxPage, setMaxPage] = useState("");

  const showOptions = () => {
    setIsModal(!isModal);
  };

  const headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("Token"),
    },
  };

  /* Loading User Info */
  const userInfo = async () => {
    const details = await Axios.get(
      `http://localhost:4000/post/posts?page=${page}`,
      headers
    );

    setPost((prev) => [...prev, ...details.data.post]);
    setMaxPage(details.data.totalPage);
    setLoading(false);
    setPageLoad(false);
  };

  /* Liking post */
  const btnLike = async (id) => {
    const requestedID = id;

    await Axios.post(
      `http://localhost:4000/post/like/${requestedID}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("Token"),
        },
      }
    ).then((response) => {
      /* Reload Post */
      post.map((item) => {
        if (item._id === response._id) {
          // return response.data;
          return userInfo();
        } else {
          return userInfo();
        }
      });
    });
  };

  const btnUnLike = async (id) => {
    const requestedID = id;

    await Axios.post(
      `http://localhost:4000/post/unlike/${requestedID}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("Token"),
        },
      }
    ).then((response) => {
      /* Reload Post */
      post.map((item) => {
        if (item._id === response._id) {
          // return response.data;
          return userInfo();
        } else {
          return userInfo();
        }
      });
    });
  };

  const btnDelete = async (id) => {
    const requestedID = id;
    await Axios.delete(
      `http://localhost:4000/post/delete/${requestedID}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("Token"),
        },
      }
    ).then((response) => {
      setIsModal(false);
      setPost(
        post.filter((item) => {
          return item._id !== id;
        })
      );
    });
  };

  useEffect(() => {
    const checkToken = localStorage.getItem("Token");
    const userData = localStorage.getItem("User");
    const data = JSON.parse(userData);

    if (checkToken) {
      setUserId(data._id);

      if (pageLoad) {
        setLoading(false);
      }

      userInfo();

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
            setLoading(false);
          } else {
            setLoading(true);
            setTimeout(() => {
              setPage(page + 1);
            }, 1500);
          }

          // After 1 second the "isExecuted" will be set to "false" to allow the code inside the "if" statement to be executed again
        }
      }
    } else {
      history.push("/login");
    }
  }, [page]);

  return (
    <>
      <Navbar />
      <div className="main-container ">
        <div className="main-content bd-container">
          {pageLoad ? (
            <div className="loading-animation">
              <BounceLoader loading color="#e98580" />
            </div>
          ) : (
            <div>
              {post.map((posts, key) => {
                return (
                  <div key={posts._id} className="posts-container">
                    <div className="top-post-content">
                      <div className="post-user-info">
                        <Link to={`/view/profile/${posts.userId}`}>
                          <img src={posts.avatar} alt={posts.username} />
                        </Link>

                        <div>
                          <Link to={`/view/profile/${posts.userId}`}>
                            <h3>{posts.username}</h3>
                          </Link>
                          <span>{moment(posts.createdAt).fromNow()}</span>
                        </div>
                      </div>

                      {posts.userId === userId ? (
                        <div className="post-action-btn">
                          <button
                            onClick={() => {
                              showOptions();
                              setPostId(posts._id);
                            }}
                          >
                            <i className="fas fa-ellipsis-h"></i>
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <hr className="profile-line" />

                    <div className="post-image">
                      <Link to={`/view/post/${posts._id}`}>
                        <img src={posts.image} alt={posts.title} />
                      </Link>
                    </div>

                    <div className="bottom-post-content">
                      <div className="botton-post-action">
                        <div className="btn-like">
                          {posts.likes.includes(userId) ? (
                            <i
                              className="fas fa-heart"
                              onClick={() => {
                                btnUnLike(posts._id);
                              }}
                            ></i>
                          ) : (
                            <i
                              className="far fa-heart"
                              onClick={() => {
                                btnLike(posts._id);
                              }}
                            ></i>
                          )}

                          {posts.likes.length <= 1 ? (
                            <span>{posts.likes.length} Like</span>
                          ) : (
                            <span>{posts.likes.length} Likes</span>
                          )}
                        </div>

                        <div className="view-comments">
                          {posts.comments.length <= 1 ? (
                            <Link to="#">
                              <span>{posts.comments.length} Comment</span>{" "}
                            </Link>
                          ) : (
                            <Link to="#">
                              <span>{posts.comments.length} Comments</span>
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="bottom-post-info">
                        <div className="bottom-user-post">
                          <span>{posts.title}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Modal
                isOpen={isModal}
                onRequestClose={() => setIsModal(false)}
                className="modal"
              >
                <button onClick={() => btnDelete(postId)}>Delete</button>
                <hr className="profile-line" />
                <button>Edit</button>
              </Modal>
            </div>
          )}
          {isloading && (
            <BeatLoader
              className="pagination-animation"
              loading
              color="#e98580"
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;

import { Link, useHistory, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { BounceLoader } from "react-spinners";
import Navbar from "../Navbar/Navbar";
import Modal from "react-modal";
import moment from "moment";
import Axios from "axios";
import "./ViewPost.css";

function ViewPost({ userID }) {
  const history = useHistory();
  const params = useParams();
  const [userId, setUserId] = useState("");
  const [likes, setLikes] = useState([]);
  const [post, setPost] = useState({});
  const [isloading, setIsloading] = useState(true);
  const [comment, setComment] = useState("");
  const [loadComment, setLoadComment] = useState([]);
  const [isModal, setIsModal] = useState(false);

  const showModal = () => {
    setIsModal(!isModal);
  };

  const headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("Token"),
    },
  };

  const getPost = async () => {
    const viewPost = await Axios.get(
      `http://localhost:4000/post/post/${params.id}`,
      headers
    );
    setPost(viewPost.data.post);
    setLikes(viewPost.data.likes);
    setIsloading(false);
    setLoadComment(viewPost.data.comments);
  };

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
      if (post._id === response._id) {
        getPost();
      } else {
        getPost();
      }
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
      if (post._id === response._id) {
        getPost();
      } else {
        getPost();
      }
    });
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("empty");
    } else {
      Axios.post(
        `http://localhost:4000/post/comment/${post._id}`,
        {
          comment: comment,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("Token"),
          },
        }
      ).then((response) => {
        console.log(response);
        setComment("");
        getPost();
      });
    }
  };

  useEffect(() => {
    const Token = localStorage.getItem("Token");
    const userData = localStorage.getItem("User");
    const data = JSON.parse(userData);

    if (Token) {
      getPost();
      setUserId(data._id);
    } else {
      history.push("/login");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="view-post-container">
        <div className="view-post-content bd-container">
          {isloading ? (
            <div className="loading-animation">
              <BounceLoader loading color="#e98580" />
            </div>
          ) : (
            <div className="view-post-card">
              <div className="top-post-card">
                <div className="top-post-profile">
                  <div className="top-post-profile-image">
                    <Link to={`/view/profile/${post.userId}`}>
                      <img src={post.avatar} alt={post.username} />
                    </Link>
                  </div>

                  <div className="top-post-profile-info">
                    <Link to={`/view/profile/${post.userId}`}>
                      <h3>{post.username}</h3>
                    </Link>

                    <span>{moment(post.createdAt).fromNow()}</span>
                  </div>
                </div>

                {post.userId === userId ? (
                  <div className="top-post-btn-action">
                    <i className="fas fa-ellipsis-h"></i>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="top-post-image">
                <img src={post.image} alt={post.title} />
              </div>

              <div className="view-post-info">
                <span>{post.title}</span>
                <p>{post.content}</p>
              </div>

              <div className="view-bottom-post">
                <div className="view-bottom-post-action">
                  <div className="view-post-action">
                    <div className="view-btn-like">
                      {likes.includes(userId) ? (
                        <i
                          className="fas fa-heart"
                          onClick={() => {
                            btnUnLike(post._id);
                          }}
                        ></i>
                      ) : (
                        <i
                          className="far fa-heart"
                          onClick={() => {
                            btnLike(post._id);
                          }}
                        ></i>
                      )}
                    </div>

                    <div className="view-post-like">
                      {likes.length <= 1 ? (
                        <span>{likes.length} Like</span>
                      ) : (
                        <span>{likes.length} Likes</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="view-post-comment">
                  {post.comments.length <= 1 ? (
                    <button>{post.comments.length} Comment</button>
                  ) : (
                    <button
                      onClick={() => {
                        showModal();
                      }}
                    >
                      View {post.comments.length} Comments
                    </button>
                  )}
                </div>
              </div>

              <hr className="profile-line" />

              <div className="view-post-comment-input">
                <form onSubmit={submitComment}>
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <input
                    type="submit"
                    value="Post comment"
                    onSubmit={submitComment}
                  />
                </form>
              </div>
            </div>
          )}

          <Modal
            isOpen={isModal}
            onRequestClose={() => setIsModal(false)}
            className="comments-modal"
          >
            {loadComment.map((value, key) => {
              return (
                <div key={value._id} className="comments-container">
                  <div className="comments-list">
                    <div className="comments-user-list">
                      <div className="comments-user-image">
                        <img src={value.avatar} alt={value.username} />
                      </div>

                      <div className="comments-user-info">
                        <h3>{value.username}</h3>
                        <p>{value.comment}</p>
                        <span>{moment(value.createdAt).fromNow()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Modal>
        </div>
      </div>
    </>
  );
}

export default ViewPost;

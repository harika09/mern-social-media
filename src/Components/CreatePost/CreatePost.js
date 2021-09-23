import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import Navbar from "../Navbar/Navbar";
import Axios from "axios";
import "./CreatePost.css";

function CreatePost() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [pageLoad, setPageLoad] = useState(true);

  /* Disabling  Loading  animation */
  setTimeout(() => {
    setPageLoad(false);
  }, 1000);

  const submitPost = (e) => {
    e.preventDefault();

    /* Enable Loading animation */
    setPageLoad(true);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("content", content);

    if (!title.trim() || !content.trim() || !image) {
      setError("Empty Fields");
      setTimeout(() => {
        setPageLoad(false);
      }, 1000);
    } else {
      Axios.post(
        "https://mern-social-konek.herokuapp.com/post/newPost",

        formData,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("Token"),
          },
        }
      ).then((response) => {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          history.push("/");
        }
      });
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("Token")) {
      history.push("/login");
    }
  });

  return (
    <>
      <Navbar />
      <div className="create-post-container">
        <div className="create-post-content bd-container">
          {pageLoad ? (
            <div className="loading-animation">
              <BounceLoader loading color="#e98580" />
            </div>
          ) : (
            <form onSubmit={submitPost}>
              {error && (
                <div className="error">
                  <p>{error}</p>
                </div>
              )}
              <div className="create-post-form">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <label htmlFor="content">Content</label>
                <input
                  type="text"
                  placeholder="Enter Title"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p className="add-image">Click to upload image</p>
                <label>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/jpeg, image/png"
                  />
                  <i className="fas fa-image"></i>
                </label>

                <input type="submit" value="Post" onClick={() => submitPost} />
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default CreatePost;

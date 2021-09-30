import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { HashLoader } from "react-spinners";
import Navbar from "../Navbar/Navbar";
import Axios from "axios";
import "./EditPost.css";

function EditPost() {
  const history = useHistory();
  const params = useParams();
  const [state, setState] = useState({});
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [pageLoad, setPageLoad] = useState(true);

  const headers = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("Token"),
    },
  };

  const updatePost = async (e) => {
    e.preventDefault();

    setPageLoad(true);

    const { title, content } = state;

    const formData = new FormData();

    formData.append("image", image);
    formData.append("title", title);
    formData.append("content", content);

    Axios.put(
      /* http://localhost:4000/ https://mern-social-konek.herokuapp.com */
      `https://mern-social-konek.herokuapp.com/post/update/${params.id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("Token"),
        },
      }
    ).then((response) => {
      setError("Post Successfully Updated");
      setPageLoad(false);
    });
  };

  const loadData = async () => {
    const data = await Axios.get(
      `https://mern-social-konek.herokuapp.com/post/view/${params.id}`,
      headers
    );

    setState(data.data);
    setPageLoad(false);
  };

  useEffect(() => {
    const Token = localStorage.getItem("Token");

    if (Token) {
      loadData();
    } else {
      history.push("/login");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="edit-post-container">
        <div className="edit-post-content">
          {pageLoad ? (
            <div className="loading-animation">
              <HashLoader loading color="#4B5A82" size={75} />
            </div>
          ) : (
            <div className="edit-form">
              <form onSubmit={updatePost}>
                {error && (
                  <div className="error">
                    <p>{error}</p>
                  </div>
                )}
                <div className="edit-post-form">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    placeholder="Enter Title"
                    name="title"
                    maxLength="50"
                    value={state.title}
                    onChange={(e) =>
                      setState({ ...state, [e.target.name]: e.target.value })
                    }
                  />

                  <label htmlFor="content">Content</label>
                  <input
                    type="text"
                    name="content"
                    placeholder="Enter Title"
                    value={state.content}
                    maxLength="100"
                    onChange={(e) =>
                      setState({ ...state, [e.target.name]: e.target.value })
                    }
                  />
                  <p className="add-image">Click replaced the image</p>
                  <label>
                    <input
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                      accept="image/png, image/gif, image/jpeg"
                    />
                    <i className="fas fa-image"></i>
                  </label>

                  <input type="submit" value="Post" onSubmit={updatePost} />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EditPost;

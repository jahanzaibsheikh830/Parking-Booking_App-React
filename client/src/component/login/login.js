import React, { useState } from "react";
import background from "../../assets/bg.jpg";
import { Form, Formik } from "formik";
import { TextField } from "./textfield";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import url from "../../baseUrl/baseURL";
import { useDispatch } from "react-redux";
import { user } from "../../redux/action/reduxAction";
function Login() {
  const [msg, setMsg] = useState();
  const [msgClass, setMsgClass] = useState();
  const [log, setLog] = useState(false);

  const dispatch = useDispatch();
  const validate = Yup.object({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 charaters")
      .required("Password is required"),
  });
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        height: "100vh",
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container ">
        <div className="row">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ width: "100%", height: "100vh" }}
          >
            <div className="col-md-5 bg-white px-5 pb-3">
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={validate}
                onSubmit={(values) => {
                  const loginData = {
                    email: values.email.toLowerCase(),
                    password: values.password,
                  };
                  setLog(true);
                  axios({
                    method: "post",
                    url: url + "/login",
                    data: loginData,
                    withCredentials: true,
                  })
                    .then((res) => {
                      if (res.data.status === 200) {
                        setMsgClass("alert-success");
                        setMsg(res.data.message);
                        dispatch(
                          user({
                            loginStatus: true,
                            loginUser: res.data.user,
                            role: res.data.user.role,
                          })
                        );
                        // history.push('/dasboard')
                      } else {
                        setMsgClass("alert-danger");
                        setLog(false);
                        setMsg(res.data.message);
                        setTimeout(() => {
                          setMsg("");
                        }, 3000);
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                {(formik) => (
                  <div>
                    <h1
                      className="my-4 font-weight-bold .display-4"
                      style={{ color: "#083144" }}
                    >
                      Login
                    </h1>
                    <Form>
                      <TextField label="Email" name="email" type="email" />
                      <TextField
                        label="Password"
                        name="password"
                        type="password"
                      />
                      <button
                        className="btn text-white"
                        style={{ width: "100%", backgroundColor: "#083144" }}
                        type="submit"
                      >
                        {log ? (
                          <div className="text-center mt-2">
                            <div
                              className="spinner-border"
                              style={{ width: 20, height: 20 }}
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                        ) : (
                          <span>Login</span>
                        )}
                      </button>
                    </Form>
                    <p className="mt-2">
                      Already have an account? <Link to="/">Signup</Link>{" "}
                    </p>
                    {msg ? (
                      <div className={`alert ${msgClass}`} role="alert">
                        {msg}
                      </div>
                    ) : null}
                  </div>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

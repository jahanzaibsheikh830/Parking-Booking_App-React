import React, { useState } from 'react'
import background from '../../assets/bg.jpg'
import { Form, Formik } from 'formik'
import { TextField } from './textfield';
import { Link } from 'react-router-dom'
import * as Yup from "yup"
import axios from 'axios'
import url from '../../baseUrl/baseURL'
import { useDispatch, useSelector } from 'react-redux'
import { user } from '../../redux/action/reduxAction'
import {
    useHistory
} from "react-router-dom";
function Login() {
    const [msg, setMsg] = useState()
    const [msgClass, setMsgClass] = useState()
    const useData = useSelector((state) => state.addUser)
    console.log(useData)
    let history = useHistory()
    const dispatch = useDispatch()
    const validate = Yup.object({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 charaters')
            .required('Password is required'),
    })
    return (
        <div style={{
            backgroundImage: `url(${background})`,
            height: "100vh", width: "100%", backgroundRepeat: "no-repeat",
            backgroundSize: "cover", backgroundPosition: "center"
        }}>
            <div className='container '>
                <div className='row justify-content-center'>
                    <div className="col-md-5 bg-white px-5 pb-3" style={{ marginTop: '180px' }}>
                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                            }}
                            validationSchema={validate}
                            onSubmit={values => {
                                const loginData = {
                                    email: values.email.toLowerCase(),
                                    password: values.password
                                }
                                axios({
                                    method: 'post',
                                    url: url + "/login",
                                    data: loginData,
                                    withCredentials: true
                                }).then((res) => {
                                    if (res.data.status === 200) {
                                        setMsgClass('alert-success')
                                        setMsg(res.data.message)
                                        console.log(res.data.user)
                                        dispatch(user({
                                            loginStatus: true,
                                            loginUser: res.data.user
                                        }))
                                        // history.push('/dasboard')
                                    } else {
                                        setMsgClass('alert-danger')
                                        setMsg(res.data.message)
                                    }
                                }).catch((err) => {
                                    console.log(err)
                                })
                            }}
                        >
                            {formik => (
                                <div>
                                    <h1 className="my-4 font-weight-bold .display-4">Login</h1>
                                    <Form>
                                        <TextField label="Email" name="email" type="email" />
                                        <TextField label="Password" name="password" type="password" />
                                        <button className="btn btn-dark mt-3" type="submit">Login</button>
                                    </Form>
                                    <p className="mt-2">Already have an account? <Link to="/">Signup</Link> </p>
                                    {msg ? <div className={`alert ${msgClass}`} role="alert">{msg}</div> : null}
                                    {/* {errMsg ? <div className="alert alert-danger" role="alert">{errMsg}</div> : null} */}
                                    {/* <div className="d-flex justify-content-center">
                                        <div className="spinner-border" role="status"></div>
                                    </div> */}
                                </div>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
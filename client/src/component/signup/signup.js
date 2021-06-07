import React, { useState } from 'react'
import background from '../../assets/bg.jpg'
import { Form, Formik } from 'formik'
import { TextField } from './textfield';
import { Link } from 'react-router-dom'
import * as Yup from "yup"
import axios from 'axios'
import url from '../../baseUrl/baseURL'
function Signup() {
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const [msg, setMsg] = useState()
  const [msgClass, setMsgClass] = useState()
  const [log, setLog] = useState(false)

  const validate = Yup.object({
    firstName: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Required'),
    lastName: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Required'),
    email: Yup.string()
      .email('Email is invalid')
      .required('Email is required'),
    phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 charaters')
      .required('Password is required')
  })
  return (
    <div style={{
      backgroundImage: `url(${background})`,
      height: "100vh", width: "100%", backgroundRepeat: "no-repeat",
      backgroundSize: "cover", backgroundPosition: "center"
    }}>
      <div className='container '>
        <div className='row'>
          <div className='d-flex justify-content-center align-items-center' style={{ width: "100%", height: "100vh" }}>
            <div className="col-md-5 bg-white px-5 pb-3" style={{ marginTop: '40px' }}>
              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  password: '',
                }}
                validationSchema={validate}
                onSubmit={(values, onSubmitProps) => {
                  const userData = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email.toLowerCase(),
                    phone: values.phone,
                    password: values.password
                  }
                  setLog(true)
                  axios({
                    method: 'post',
                    url: url + "/signup",
                    data: userData,
                    withCredentials: true
                  }).then((res) => {
                    if (res.data.status === 200) {
                      setMsgClass('alert-success')
                      setMsg(res.data.message)
                      onSubmitProps.resetForm()
                      setLog(false)
                    } else {
                      setMsgClass('alert-danger')
                      setMsg(res.data.message)
                      setTimeout(() => {
                        setMsg('')
                      }, 3000)
                    }
                  }).catch((err) => {
                    console.log(err)
                  })
                }}
              >
                {formik => (
                  <div>
                    <h1 className="my-4 font-weight-bold .display-4" style={{ color: "#083144" }}>Sign Up</h1>
                    <Form>
                      <TextField label="First Name" name="firstName" type="text" />
                      <TextField label="Last Name" name="lastName" type="text" />
                      <TextField label="Email" name="email" type="email" />
                      <TextField label="Phone" name="phone" type="text" />
                      <TextField label="Password" name="password" type="password" />
                      <button className="btn text-white w-100" style={{ backgroundColor: "#083144" }} type="submit">
                        {log ? <div className='text-center mt-2'>
                          <div className="spinner-border" style={{ width: 20, height: 20 }} role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div> : <span>Register</span>}
                      </button>
                    </Form>
                    <p className="mt-2">Already have an account? <Link to="/login">Login</Link> </p>
                    {msg ? <div className={`alert ${msgClass}`} role="alert">{msg}</div> : null}
                  </div>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
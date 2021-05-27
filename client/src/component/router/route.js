import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route,Redirect } from "react-router-dom";
import Login from '../login/login'
import Signup from '../signup/signup'
import Dashboard from '../user/dashboard'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import url from './../../baseUrl/baseURL'
import { user } from '../../redux/action/reduxAction'

function RouterConfig() {
    const useData = useSelector((state) => state.addUser)
    const dispatch = useDispatch()
    useEffect(() => {
        axios({
            method: "get",
            url: url + `/profile`,
            withCredentials: true
        })
            .then((res) => {
                console.log(res)
                if (res.data.status === 200) {
                    dispatch(user({
                        loginUser: res.data.profile,
                        loginStatus: true,
                    }));
                }
            })
            .catch((err) => {
                if (err) {
                    dispatch(user({ loginStatus: false }));
                }
            });
        return () => {
            console.log("cleanup");
        };
    }, []);
    return (

        <Router>
            {useData.loginStatus === false ?
                <div>
                    <Switch>
                        <Route exact path="/" component={Signup} />
                        <Route path="/login" component={Login} />
                        <Route path="*" />
                        <Redirect to="/" />
                        <Route />
                    </Switch>
                </div> : null}

            {useData.loginStatus === true ?
                <>
                    <Route exact path="/" component={Dashboard} />
                    <Route path="*" />
                    <Redirect to="/" />
                    <Route />
                </> : null
            }
        </Router>
    )
}
export default RouterConfig
import React from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import { user } from '../../redux/action/reduxAction'
import {useDispatch, useSelector } from 'react-redux'
import URL from '../../baseUrl/baseURL'
function Logout() {
    const dispatch = useDispatch()
    const useData = useSelector(state => state.addUser)
    const history = useHistory()
    function logout() {
        axios({
            method: 'get',
            url: URL+'/logout',
            withCredentials: true
        }).then(() => {
            dispatch(user({
                loginStatus: false,
                role: null
            }))
            history.push("/login")
        }, (error) => {
            console.log(error);
        });
    }
    return (
        <div className='justify-content-right'>
            <span className="text-white mr-3" style={{textTransform: "capitalize"}}>{useData.loginUser.firstName}</span>
            <button className="btn btn-light " onClick={logout}>logout</button>
        </div>
    )
}

export default Logout
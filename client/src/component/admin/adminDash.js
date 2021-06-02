import React ,{useEffect, useState} from 'react'
// import data from './areaData'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'
import url from '../../baseUrl/baseURL'
function AdminDashboard() {
    const useData = useSelector((state)=> state.addUser)
    const [data,setData] = useState([])

    useEffect(()=>{
        axios({
            method: 'get',
            url: url + "/getLocations",
            withCredentials: true 
        }).then((res)=>{
            if(res.status === 200){
                setData(res.data.data)
            }else{
                console.log(res)
            }
        }).catch((err)=>{
            console.log(err)
        })
    },[])
    console.log(data)
    return (
        <div>
            <div className='container'>
                <div className='row mt-5'>
                    {
                        data.map((value, i) => {
                            return (
                                <div className='col-md-4' >
                                    <div className="card" key={i}>
                                        <img src={value.imgUrl} className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title text-capitalize"
                                            style={{ color: "#083144" }}>{value.location}</h5>
                                            <p className="card-text">{value.desc}</p>
                                            <p>Slots {value.slots}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
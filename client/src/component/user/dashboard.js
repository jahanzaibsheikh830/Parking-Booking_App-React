import React ,{useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import url from '../../baseUrl/baseURL'
function Dashboard() {
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
    return (
        <div>
            <div className='container'>
                <div className='row mt-5'>
                    {
                        data.map((value, i) => {
                            return (
                                <div className='col-md-4' key={i}   >
                                    <div className="card" >
                                        <img src={value.imgUrl} className="card-img-top" alt="..." style={{height: 200}} />
                                        <div className="card-body">
                                            <h5 className="card-title text-capitalize" style={{ color: "#083144" }}>{value.location}</h5>
                                            <p className="card-text">{value.desc}</p>
                                            <Link to={{
                                                pathname: "/booking",
                                                // state: value
                                            }} className="btn text-white" style={{backgroundColor: "#083144"}} onClick={()=>localStorage.setItem('data',JSON.stringify(value))}>Booking</Link>
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

export default Dashboard
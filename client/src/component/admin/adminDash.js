import React ,{useEffect, useState} from 'react'
import axios from 'axios'
import url from '../../baseUrl/baseURL'
function AdminDashboard() {
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
                                <div className='col-md-4'key={i} >
                                    <div className="card" >
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
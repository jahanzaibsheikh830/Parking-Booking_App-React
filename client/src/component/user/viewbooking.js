import React, { useEffect, useState } from 'react'
import axios from 'axios'
import url from './../../baseUrl/baseURL'
function ViewBooking() {
    const [data, setData] = useState([])

    useEffect(() => {
        axios({
            method: 'get',
            url: url + '/getBookings',
            withCredentials: true,
        }).then((res) => {
            setData(res.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    return (
        <div >
            <div className='container'>
                <div className="row mt-5">
                    <table className="table">
                        <thead style={{ backgroundColor: "#083144", color: "#fff" }}>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Full Name</th>
                                <th scope="col">Slot</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">End Date</th>
                                <th scope="col">Start Time</th>
                                <th scope="col">End Time</th>
                                <th scope="col">Location</th>
                            </tr>
                        </thead>
                        {
                        data.length === 0? <p>No booking you have made</p>: 
                            data && data.map((value, index) => {
                                return (
                                    <tbody key={index}>
                                        <tr >
                                            <th scope="row">{index + 1}</th>
                                            <td className='text-capitalize'>{value.firstName + " " + value.lastName}</td>
                                            <td>Slot {value.slot}</td>
                                            <td>{new Date(value.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(value.endDate).toLocaleDateString()}</td>
                                            <td>{new Date(value.startDate).toLocaleTimeString()}</td>
                                            <td>{new Date(value.endDate).toLocaleTimeString()}</td>
                                            <td className='text-capitalize'>{value.location}</td>
                                        </tr>
                                    </tbody>
                                )
                            })
                        }
                    </table>
                </div>
            </div>
        </div>
    )
}
export default ViewBooking
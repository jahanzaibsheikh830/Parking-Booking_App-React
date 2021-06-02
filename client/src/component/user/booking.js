import React, { useState } from 'react'
import axios from 'axios'
import url from '../../baseUrl/baseURL'
import Swal from 'sweetalert2'
function Booking(props) {
    // const [valData, setValData] = useState({
    //     startData: [],
    //     endData: [],
    // })
    const data = props.location.state.slots
    const count = []
    for (let i = 1; i <= data; i++) {
        count.push(i)
    }
    function bookPark(e) {
        e.preventDefault();
        let startDay = document.getElementById('startDay').value;
        let endDay = document.getElementById('endDay').value;
        let startTime = document.getElementById('startTime').value;
        let endTime = document.getElementById('endTime').value;
        let slot = document.getElementById('slot').value
        let startDate = new Date(startDay + " " + startTime).getTime()
        let endDate = new Date(endDay + " " + endTime).getTime()

        if (startDate < Date.now() || endDate < Date.now()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Please select valid date and time",
            })
        }
        else {
            axios({
                method: 'post',
                url: url + "/booking",
                data: {
                    location: props.location.state.location,
                    startDate: Number(startDate),
                    endDate: Number(endDate),
                    slot: slot,
                },
                withCredentials: true
            }).then((res) => {
                if (res.data.status === 200) {
                    console.log(res.data.message)
                    Swal.fire(
                        'Congratulations',
                        res.data.message,
                        'success'
                    )
                    document.getElementById('startDay').value = "";
                    document.getElementById('endDay').value = "";
                    document.getElementById('startTime').value = "";
                    document.getElementById('endTime').value = "";
                } else {
                    console.log(res.data.message)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.data.message,
                    })
                }
            }).catch((err) => {
                console.log(err)
            })
        }

    }
    // function validateSlot() {
    //     let startDay = document.getElementById('startDay').value;
    //     let endDay = document.getElementById('endDay').value;
    //     let startTime = document.getElementById('startTime').value;
    //     let endTime = document.getElementById('endTime').value;
    //     let startDate = new Date(startDay + " " + startTime).getTime()
    //     let endDate = new Date(endDay + " " + endTime).getTime()
    //     axios({
    //         method: "post",
    //         url: url + "/validateSlot",
    //         data: {
    //             startDate: Number(startDate),
    //             endDate: Number(endDate),
    //             location: props.location.state.location,
    //         },
    //         withCredentials: true
    //     }).then((res) => {
    //         if (res.status === 200) {
    //             console.log(res.data)
    //             setValData(res.data)
    //         }
    //         else{
    //             setValData({
    //                 startData: [],
    //                 endData: [],
    //             })
    //         }
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // }
    // var valSlot = []
    // console.log(valData)
    // for (let i = 0; i < valData.startData.length; i++) {
    //     console.log(i)
    //     valSlot.push(Number(valData.startData[i].slot))
    // }
    // for (let i = 0; i < valData.endData.length; i++) {
    //     console.log(i)
    //     valSlot.push(Number(valData.endData[i].slot))
    // }
    // console.log(valSlot)
    // var fin = count.filter((val) => {
    //     return valSlot.indexOf(val) < 0
    // })
    // console.log('res ====', fin)
    return (
        <div className="container">
            <div className="row justify-content-center">
                <h2 className="text-center mt-3">Book Parking</h2>
                <div className="col-md-5 bg-white py-4 px-4 mt-3" style={{ boxShadow: "0 0 10px grey" }}>
                    <h2 className="text-center mb-3 text-capitalize">{props.location.state.location}</h2>
                    <form onSubmit={bookPark}>
                        <div className="row">
                            <div className="col">
                                <label>Start Day</label>
                                <input type="date" className="form-control" id="startDay" required />
                            </div>
                            <div className="col">
                                <label>End Day</label>
                                <input type="date" className="form-control" id="endDay" required />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label>Start Time</label>
                                <input type="time" className="form-control" id="startTime" required />
                            </div>
                            <div className="col">
                                <label>Start Time</label>
                                <input type="time" className="form-control" id="endTime" required />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label>Select Slots</label>
                                <select className="form-control" id="slot" required>
                                    {
                                        count.map((val) => {
                                            return (
                                                <option value={val}>Slot {val}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <button className="btn text-white mt-3" style={{ backgroundColor: "#083144" }} type="submit">Book</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Booking
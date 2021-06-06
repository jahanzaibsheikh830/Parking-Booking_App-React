import React, { useState } from 'react'
import axios from 'axios'
import url from '../../baseUrl/baseURL'
import Swal from 'sweetalert2'
import moment from 'moment'
function Booking(props) {
    const [valData, setValData] = useState([])
    const [startDay, setStartDay] = useState('')
    const [endDay, setEndDay] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [slot, setSlot] = useState()
    const [err, setErr] = useState('')
    const [vSlot, setVSlot] = useState(false)
    const data = props.location.state.slots
    const count = []
    for (let i = 1; i <= data; i++) {
        count.push(i)
    }
    let startDate = new Date(startDay + " " + startTime)
    let endDate = new Date(endDay + " " + endTime)
    function bookPark(e) {
        e.preventDefault();

        if (startDate < Date.now() || endDate < Date.now() || startDate > endDate) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Please select valid date and time",
            })
        }
        else {
            slot === '' || slot === undefined ? setErr('Required') :
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
                        setVSlot(false)
                        startDay('')    
                        startTime('')    
                        endDay('')    
                        endTime('')    
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


    function validateSlot() {
        if (startTime !== '' && endTime !== '' && startDay !== '' && endDay !== '') {
            axios({
                method: "post",
                url: url + "/validateSlot",
                data: {
                    startDate: Number(startDate),
                    endDate: Number(endDate),
                    location: props.location.state.location,
                },
                withCredentials: true
            }).then((res) => {
                if (res.data.status === 200) {
                    setValData(res.data.data)
                    console.log(res.data.data)
                }
                else {
                    setValData([])
                }
            }).catch((err) => {
                console.log(err)
            })
            setVSlot(true)
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Please fill in all required fields before checking the slots",
            })
        }
    }

    var valSlot = []

    valData.find((val, ind) => {
        if (moment(new Date(startDate).toLocaleString()).isSameOrAfter(new Date(val.startDate).toLocaleString()) &&
            moment(new Date(startDate).toLocaleString()).isSameOrBefore(new Date(val.endDate).toLocaleString())
            || moment(new Date(val.startDate).toLocaleDateString()).isBetween(new Date(startDate).toLocaleDateString(),new Date(endDate).toLocaleDateString()) && new Date(startDate).getMinutes() >= new Date(val.startDate).getMinutes() && new Date(startDate).getMinutes()<= new Date( val.endDate).getMinutes()) {
            valSlot.push(Number(val.slot))
        }
        if (moment(new Date(endDate).toLocaleString()).isSameOrBefore(new Date(val.endDate).toLocaleString()) &&
            moment(new Date(endDate).toLocaleString()).isSameOrAfter(new Date(val.startDate).toLocaleString())
            || moment(new Date(val.endDate).toLocaleDateString()).isBetween(new Date(startDate).toLocaleDateString(),new Date(endDate).toLocaleDateString())
           && new Date(endDate).getMinutes() >= new Date(val.endDate).getMinutes() && new Date(endDate).getMinutes()<= new Date( val.startDate).getMinutes()) {
            valSlot.push(Number(val.slot))
        }
    })
    var fin = count.filter((val) => {
        return valSlot.indexOf(val) < 0
    })
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
                                <input type="date" className="form-control"
                                    value={startDay} required onChange={(e) => setStartDay(e.target.value)} />
                            </div>
                            <div className="col">
                                <label>End Day</label>
                                <input type="date" className="form-control"
                                    value={endDay} required onChange={(e) => setEndDay(e.target.value)} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label>Start Time</label>
                                <input type="time" className="form-control"
                                    value={startTime} required onChange={(e) => setStartTime(e.target.value)} />
                            </div>
                            <div className="col">
                                <label>End Time</label>
                                <input type="time" className="form-control"
                                    required onChange={(e) => setEndTime(e.target.value)} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                {vSlot ?
                                    <>
                                        <label>Select Slots</label>
                                        <select className="form-control" required onChange={(e) => setSlot(e.target.value)}>
                                            <option>Select Slots</option>
                                            {
                                                fin.map((val, ind) => {
                                                    return (
                                                        <option value={val} key={ind}>Slot {val}</option>
                                                    )
                                                })
                                            }
                                        </select></> : null}
                                {err ? <p className='text-danger' style={{ fontSize: 12 }}>{err}</p> : null}
                            </div>
                        </div>
                        <button className="btn text-white mt-3" style={{ backgroundColor: "#083144" }} type="submit">Book</button>
                        <button className="btn text-white mt-3 ml-3" style={{ backgroundColor: "#083144" }} onClick={validateSlot} type="button">Show Slot</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Booking
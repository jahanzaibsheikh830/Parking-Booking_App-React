import React, { useEffect, useState } from 'react'
import axios from 'axios'
import url from '../../baseUrl/baseURL'
import AreaDetails from './areaDetails'
import Swal from 'sweetalert2'
function AdminDashboard() {
    const [data, setData] = useState([])

    useEffect(() => {
        axios({
            method: 'get',
            url: url + "/getLocations",
            withCredentials: true
        }).then((res) => {
            if (res.status === 200) {
                setData(res.data.data)
            } else {
                console.log(res)
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    function delt(id) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios({
                    method: 'post',
                    url: url + '/deleteLocation',
                    data: { id: id },
                    withCredentials: true
                }).then((res) => {
                    swalWithBootstrapButtons.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                    window.location.reload(false);
                }).catch((err) => {
                    console.log(err)
                })
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                )
            }
        })
    }
    return (
        <div>
            <div className='container'>
                <div className='row mt-5'>
                    {
                        data.map((value, i) => {
                            return (
                                <div className='col-md-4' key={i} >
                                    <div className="card">
                                        <img src={value.imgUrl} className="card-img-top" alt="..."
                                            style={{ height: 200, overflow: "scroll" }} />
                                        <div className="card-body">
                                            <h5 className="card-title text-capitalize"
                                                style={{ color: "#083144" }}>{value.location}</h5>
                                            {/* <p className="card-text" style={{height: 200 , overflow: "hidden"}} >{value.desc}</p> */}
                                            <p>Slots {value.slots}</p>
                                            <button className="btn btn-danger" onClick={() => delt(value._id)}>Delete</button>
                                            <button className='btn btn-dark ml-3' onClick={() => {
                                                return (
                                                    Swal.fire({
                                                        title: value.location,
                                                        text: value.desc,
                                                        imageUrl: value.imgUrl,
                                                        imageWidth: 400,
                                                        imageHeight: 200,
                                                        imageAlt: 'Custom image',
                                                    })
                                                )
                                            }}>Details</button>
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
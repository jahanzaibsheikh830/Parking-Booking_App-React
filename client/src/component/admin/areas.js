import React,{useState} from 'react'
import axios from 'axios'
import url from '../../baseUrl/baseURL'
import Swal from 'sweetalert2'
import Storage from '../../config/firebase'
function AddArea() {
    const [imgUrl, setUrl] = useState()
    function addDetails(e) {
        e.preventDefault()
        axios({
            method: 'post',
            url: url + '/addAreaDetails',
            data: {
                location: document.getElementById('location').value,
                slots: document.getElementById('slots').value,
                desc: document.getElementById('desc').value,
                imgURl: imgUrl,
            },
            withCredentials: true
        }).then((res) => {
            console.log(res)
            if (res.data.status === 200) {
                Swal.fire(
                    'Congratulations',
                    res.data.message,
                    'success'
                )
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.message
                })
            }
        }).catch((err) => [
            console.log(err)

        ])
    }
    const onChangePics = (event) => {
        let images = event.target.files[0];
        const name=Date.now();
        Storage.ref('picture/' + images+name)
            .put(images)
            .then((snapshot) => {
                Swal.fire({
                    position: 'center',
                    title: 'Image is uploading',
                    showConfirmButton: false,
                    timer: 2000,
                  }); 
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                snapshot.ref.getDownloadURL().then((URL) => {
                    setUrl(URL);
                });
            });
    }
    return (
        <div className="container">
            <div className="row justify-content-center">
                <h2 className="text-center mt-3">Add Parking Areas</h2>
                <div className="col-md-5 bg-white py-4 px-4 mt-3" style={{ boxShadow: "0 0 10px grey" }}>
                        <form onSubmit={addDetails}>
                        <div className="row">
                            <div className="col">
                                <label>Location</label>
                                <input type="text" placeholder="Location" className="form-control" id="location" required />
                            </div>
                            <div className="col">
                                <label>Slots</label>
                                <input type="number" placeholder="Slots" className="form-control" id="slots" required />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label>Description</label>
                                <textarea className="form-control" placeholder="Description" required id="desc" rows="3"></textarea>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label>Area Image</label>
                                <input type="file" className="form-control" 
                                onChange={onChangePics}  required />
                            </div>
                        </div>
                        <button className="btn text-white mt-3" style={{ backgroundColor: "#083144" }} type="submit">Add</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddArea
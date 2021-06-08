import React, { useState } from "react";
import axios from "axios";
import url from "../../baseUrl/baseURL";
import Swal from "sweetalert2";
import moment from "moment";
function Booking(props) {
  const [valData, setValData] = useState([]);
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slot, setSlot] = useState();
  const [err, setErr] = useState("");
  const [slotBtn, setSlotBtn] = useState(true);
  const [bookBtn, setBookBtn] = useState(false);
  const [log, setLog] = useState(false);
  const [vSlot, setVSlot] = useState(false);
  const data = JSON.parse(localStorage.getItem("data"));

  const count = [];
  for (let i = 1; i <= data.slots; i++) {
    count.push(i);
  }

  let startDate = new Date(startDay + " " + startTime);
  let endDate = new Date(endDay + " " + endTime);
  function bookPark() {
    slot === "" || slot === undefined ? setErr("Required") : setLog(true);
    axios({
      method: "post",
      url: url + "/booking",
      data: {
        location: data.location,
        startDate: Number(startDate),
        endDate: Number(endDate),
        slot: slot,
      },
      withCredentials: true,
    })
      .then((res) => {
        if (res.data.status === 200) {
          console.log(res.data.message);
          Swal.fire("Congratulations", res.data.message, "success");
          setVSlot(false);
          setSlotBtn(true);
          setBookBtn(false);
          setEndTime("");
          setStartDay("");
          setStartTime("");
          setEndDay("");
          setLog(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data.message,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  let t = new Date(startDate).toLocaleTimeString();
  let t1 = new Date(endDate).toLocaleTimeString();
  t = moment(t, "h:mm");
  t1 = moment(t1, "h:mm");
  function validateSlot(e) {
    e.preventDefault();
    if (moment(startDay) > moment(endDay)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "End Date should be equal or greater than start date",
      });
    } else if (endTime < startTime) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "End time should be greater than start time",
      });
    }
    else if (t1.diff(t, "minutes") <= 14) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Maximum booking time is 15 minutes",
      });
    }
    else {
      setLog(true);
      axios({
        method: "post",
        url: url + "/validateSlot",
        data: {
          startDate: Number(startDate),
          endDate: Number(endDate),
          location: data.location,
        },
        withCredentials: true,
      })
        .then((res) => {
          if (res.data.status === 200) {
            setLog(false);
            setValData(res.data.data);
            setVSlot(true);
            setSlotBtn(false);
            setBookBtn(true);
          } else {
            setValData([]);
            setLog(false);
            setVSlot(true);
            setSlotBtn(false);
            setBookBtn(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  var valSlot = [];
  valData.find((val, ind) => {
    const stdb = moment(new Date(val.startDate).toLocaleTimeString(), "hh:mm");
    const etdb = moment(new Date(val.endDate).toLocaleTimeString(), "hh:mm");
    const stu = moment(new Date(startDate).toLocaleTimeString(), "hh:mm");
    const etu = moment(new Date(endDate).toLocaleTimeString(), "hh:mm");
    if (
      (etdb.isBetween(stu, etu, null, "[]") ||
        stdb.isBetween(stu, etu, null, "[]")) &&
      (moment(new Date(val.startDate).toLocaleDateString()).isBetween(
        new Date(startDate).toLocaleDateString(),
        new Date(endDate).toLocaleDateString(),
        null,
        "[]"
      ) ||
        moment(new Date(val.endDate).toLocaleDateString()).isBetween(
          new Date(startDate).toLocaleDateString(),
          new Date(endDate).toLocaleDateString(),
          null,
          "[]"
        ))
    ) {
      valSlot.push(Number(val.slot));
    }
  });
    var findSlots = count.filter((val) => {
        return valSlot.indexOf(val) < 0;
  });
  function handleSubmit(e) {
    console.log(e.target.name);
    if (e.target.name === "startDay") {
      setStartDay(e.target.value);
    } else if (e.target.name === "startTime") {
      setStartTime(e.target.value);
    } else if (e.target.name === "endTime") {
      setEndTime(e.target.value);
    } else {
      setEndDay(e.target.value);
    }
    setVSlot(false);
    setSlotBtn(true);
    setBookBtn(false);
  }
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div
          className="col-md-5 bg-white py-4 px-4 mt-3"
          style={{ boxShadow: "0 0 10px grey" }}
        >
          <h2 className="text-center mb-3 text-capitalize">{data.location}</h2>
          <form onSubmit={validateSlot}>
            <div className="row">
              <div className="col">
                <label>Start Day</label>
                <input
                  type="date"
                  className="form-control"
                  min={moment().format("YYYY-MM-DD")}
                  value={startDay}
                  required
                  onChange={handleSubmit}
                  name="startDay"
                />
              </div>
              <div className="col">
                <label>End Day</label>
                <input
                  type="date"
                  className="form-control"
                  min={moment().format("YYYY-MM-DD")}
                  value={endDay}
                  required
                  onChange={handleSubmit}
                  name="endDay"
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label>Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  min={
                    moment().format("YYYY-MM-DD") === startDay
                      ? moment().format("HH:mm")
                      : null
                  }
                  value={startTime}
                  required
                  onChange={handleSubmit}
                  name="startTime"
                />
              </div>
              <div className="col">
                <label>End Time</label>
                <input
                  type="time"
                  className="form-control"
                  min={
                    moment().format("YYYY-MM-DD") === startDay
                      ? moment().format("HH:mm")
                      : null
                  }
                  required
                  onChange={handleSubmit}
                  name="endTime"
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                {vSlot ? (
                  <>
                    <label>Select Slots</label>
                    <select
                      className="form-control"
                      required
                      onChange={(e) => setSlot(e.target.value)}
                    >
                      <option>Select Slots</option>
                      {findSlots.map((val, ind) => {
                        return (
                          <option value={val} key={ind}>
                            Slot {val}
                          </option>
                        );
                      })}
                    </select>
                  </>
                ) : null}
                {err ? (
                  <p className="text-danger" style={{ fontSize: 12 }}>
                    {err}
                  </p>
                ) : null}
              </div>
            </div>
            {bookBtn ? (
              <button
                className="btn text-white mt-3 w-100"
                style={{ backgroundColor: "#083144" }}
                type="button"
                onClick={bookPark}
              >
                {log ? (
                  <div className="text-center mt-2">
                    <div
                      className="spinner-border"
                      style={{ width: 20, height: 20 }}
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <span>Book</span>
                )}
              </button>
            ) : null}
            {slotBtn ? (
              <button
                className="btn text-white mt-3 w-100"
                style={{ backgroundColor: "#083144" }}
                type="submit"
              >
                {log ? (
                  <div className="text-center mt-2">
                    <div
                      className="spinner-border"
                      style={{ width: 20, height: 20 }}
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <span>Show Slot</span>
                )}
              </button>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Booking;

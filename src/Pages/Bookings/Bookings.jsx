import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import BookingRow from "../BookingRow/BookingRow";

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  const url = `http://localhost:5000/bookings?email=${user?.email}`;
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setBookings(data));
  }, [url]);
  //console.log(bookings);

  const handleDelete = id =>{
    const proceed = confirm('Are you sure you want to delete this booking');
    if (proceed) {
        fetch(`http://localhost:5000/bookings/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.deletedCount > 0) {
                alert('Deleted booking successfully');
                const remaining = bookings.filter(booking => booking._id !== id);
                setBookings(remaining);
            }
        })
    }
}

const handleBookingConfirm = id => {
    fetch(`http://localhost:5000/bookings/${id}`, {
        method: 'PATCH',
        headers: {
             'Content-Type': 'application/json'
            },
        body: JSON.stringify({status: 'confirm'}),
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if (data.modifiedCount > 0) {
            //update state
            const remaining = bookings.filter(booking => booking._id !== id );
            const updated = bookings.find(booking => booking._id === id);
            updated.status = 'confirm';
            const newBookings = [updated, ...remaining];
            setBookings(newBookings);
        }
    })
}
 
  return (
    <div>
      <h2 className="text-3xl text-center">Your bookings: {bookings.length}</h2>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Image</th>
              <th>Service</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {
              bookings.map(booking => <BookingRow 
              key={booking._id}
              booking={booking}
              handleDelete={handleDelete}
              handleBookingConfirm={handleBookingConfirm}
              ></BookingRow>)  
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;

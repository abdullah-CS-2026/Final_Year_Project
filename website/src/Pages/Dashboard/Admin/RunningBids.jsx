import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
const BASE_URL = import.meta.env.VITE_API_URL;
export const RunningBids = () => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    const res = await fetch(`${BASE_URL}/admin/running-bids`);
    const data = await res.json();
    setBids(data.list || []);
  };

  return (
    <>
      <h3>Running / Accepted Bids</h3>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Project</th>
            <th>Customer</th>
            <th>Contractor</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((b, i) => (
            <tr key={b._id}>
              <td>{i + 1}</td>
              <td>{b.project?.title}</td>
              <td>{b.customer?.name}</td>
              <td>{b.contractor?.name}</td>
              <td>Rs {b.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};



import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

export const PendingContractors = () => {
  const [list, setList] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const res = await fetch("http://localhost:5000/admin/contractors/pending");
    const data = await res.json();
    setList(data.list || []);
  };

  const action = async (id, type) => {
    await fetch(`http://localhost:5000/admin/contractors/${id}/${type}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPending();
  };

  return (
    <>
      <h3>Pending Contractors</h3>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Email</th>
            <th>Phone</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((c, i) => (
            <tr key={c._id}>
              <td>{i + 1}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => action(c._id, "approve")}
                >
                  Approve
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => action(c._id, "reject")}
                >
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};



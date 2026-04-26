import React, { useEffect, useState } from "react";
import { Table, Badge } from "react-bootstrap";
import { NavLink } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_URL;
const AdminContractors = () => {
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    const res = await fetch(`${BASE_URL}/contractor/list`);
    const data = await res.json();
    setContractors(data.list || []);
  };

  return (
    <>
      <h3>All Contractors</h3>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Email</th>
            <th>Phone</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {contractors.map((c, i) => (
            <tr key={c._id}>
              <td>{i + 1}</td>
              <td>
                <NavLink to={`/contractor/${c._id}`}>
                  {c.name}
                </NavLink>
              </td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <Badge bg={
                  c.status === "approved" ? "success" :
                  c.status === "pending" ? "warning" : "danger"
                }>
                  {c.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};


export default AdminContractors;



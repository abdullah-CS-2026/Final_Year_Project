import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await fetch("http://localhost:5000/customer/list");
    const data = await res.json();
    setCustomers(data.list || []);
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h3>All Customers</h3>

      <Form.Control
        placeholder="Search customer..."
        className="my-3"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Email</th><th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c, i) => (
            <tr key={c._id}>
              <td>{i + 1}</td>
              <td>
                <NavLink to={`/customer/${c._id}`}>
                  {c.name}
                </NavLink>
              </td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};



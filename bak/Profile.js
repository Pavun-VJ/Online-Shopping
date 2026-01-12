import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem("customerProfile");
    if (data) setCustomer(JSON.parse(data));
  }, []);

  if (!customer) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">

          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Account Overview</h5>
            </div>

            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <div className="profile-big-avatar">👤</div>
                <div className="ms-3">
                  <h5 className="mb-1">
                    {customer.customer_name || "Customer"}
                  </h5>
                  <small className="text-muted">
                    {customer.customer_email_id}
                  </small>
                </div>
              </div>

              <div className="row">
                <ProfileItem label="Customer Code" value={customer.customer_code} />
                <ProfileItem label="Mobile" value={customer.customer_mobile_no} />
                <ProfileItem label="Company" value={customer.company_code} />
                <ProfileItem label="State" value={customer.customer_state} />
              </div>

              <div className="mt-3">
                <h6 className="text-muted">Address</h6>
                <p className="mb-0">
                  {customer.customer_addr_1}
                </p>
              </div>

              <div className="mt-4">
                <span className="badge bg-success p-2">
                  Credit Limit ₹{customer.customer_credit_limit}
                </span>
              </div>

              <div className="mt-4 d-flex gap-2">
                <a href="/home" className="btn btn-outline-primary">
                  Back to Home
                </a>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    sessionStorage.clear();
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const ProfileItem = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <div className="border rounded p-3 h-100">
      <small className="text-muted">{label}</small>
      <div className="fw-semibold">{value || "-"}</div>
    </div>
  </div>
);

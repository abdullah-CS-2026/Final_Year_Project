import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";



import { AboutUs } from "./Pages/AboutUs";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Pages/Layout";
import { Home } from "./Pages/Home";
import { Services } from "./Pages/Services";
import { CustomerLogin } from "./Pages/Login/CustomerLogin";
import { ContractorLogin } from "./Pages/Login/ContractorLogin";
import { CustomerSignup } from "./Pages/Signup/CustomerSignup";
import { ContractorSignup } from "./Pages/Signup/ContractorSignup";
import { ContractorProfile } from "./Pages/Dashboard/ContractorProfile";
import { ContractorProjectTrack } from "./Pages/Dashboard/ContractorProjectTrack";
import { ContractorLayout } from "./Pages/Dashboard/ContractorLayout";
import { CustomerLayout } from "./Pages/Dashboard/Customer/CustomerLayout";
import { CustomerProfile } from "./Pages/Dashboard/Customer/CustomerProfile";
import { CustomerProjectTrack } from "./Pages/Dashboard/Customer/CustomerProjectTrack";
import { CustomerProjectForm } from "./Pages/Dashboard/Customer/CustomerProjectForm";
import { SeeAllOpenProjects } from "./Pages/Dashboard/SeeAllOpenProjects";
import { Admin } from "./Pages/Dashboard/Admin/Admin";
import { AdminSignup } from "./Pages/Signup/AdminSignup";
import { AdminLogin } from "./Pages/Login/AdminLogin";
import AdminContractors from "./Pages/Dashboard/Admin/AdminContractors";
import {AdminCustomers} from "./Pages/Dashboard/Admin/AdminCustomers"
import {PendingContractors} from "./Pages/Dashboard/Admin/PendingContractors";
import {RunningBids} from "./Pages/Dashboard/Admin/RunningBids";

import { CustomerProfile as CustomerProf } from "./Pages/Dashboard/Admin/CustomerProfile";
import { ContractorProfile as ContractorProf } from "./Pages/Dashboard/Admin/ContractorProfile";


import ProtectedRoute from "./components/ProtectedRoute"; // import
import { ContractorSendProposal } from "./Pages/Dashboard/ContractorSendProposal";
import { CustomerProposals } from "./Pages/Dashboard/Customer/CustomerProposals";
import { ChatPage } from "./Pages/Dashboard/Chat/ChatPage";
import { ContractorChatList } from "./Pages/Dashboard/ContractorChatList";
import { ShortlistedProposals } from "./Pages/Dashboard/Customer/ShortlistedProposals";
import { CustomerAcceptedProposals } from "./Pages/Dashboard/Customer/CustomerAcceptedProposals";
import { ContractorAcceptedProposals } from "./Pages/Dashboard/ContractorAcceptedProposals";
import { CustomerChatList } from "./Pages/Dashboard/Customer/CustomerChatList";
import { CustomerViewRequests } from "./Pages/Dashboard/Customer/CustomerViewRequests";
import { ContractorForgotPassword } from "./Pages/Dashboard/ContractorForgotPassword";
import { ResetPassword } from "./Pages/Dashboard/ResetPassword";
import { ContractorSeeSentProposals } from "./Pages/Dashboard/ContractorSeeSentProposals";
import { AdminDashboard } from "./Pages/Dashboard/Admin/AdminDashboard";
import { RoleSelection } from "./Pages/RoleSelection";
import { LearnMore } from "./Pages/LearnMore";
import { ContractorSeeCustomers } from "./Pages/Dashboard/ContractorSeeCustomers";
import { ToastProvider } from "./components/Toast";


function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'home', element: <Home /> },
        { path: 'services', element: <Services /> },
        { path: "about-us", element: <AboutUs /> },
        { path: '/select-role', element: <RoleSelection /> },
        { path: 'customer-login', element: <CustomerLogin /> },
        { path: 'contractor-login', element: <ContractorLogin /> },
        { path: 'customer-signup', element: <CustomerSignup /> },
        { path: 'contractor-signup', element: <ContractorSignup /> },
        { path:"/contractor-forgot-password", element:<ContractorForgotPassword />},
        { path:"/reset-password/:token", element:<ResetPassword />},
        { path: "/learn-more", element: <LearnMore /> },
        

      ],
    },

    // Contractor routes
    {
      path: "/",
      element: <ContractorLayout />,
      children: [
        { path: "contractor-profile", element: <ContractorProfile /> },
        { path: "contractor-project-track", element: <ContractorProjectTrack /> },
        { path: 'All-pending-projects-list', element: <SeeAllOpenProjects /> },
       { path:"/contractor/projects/:projectId/proposal", element:<ContractorSendProposal />},
       { path: "/contractor/accepted-proposals", element: <ContractorAcceptedProposals /> },
       { path: "/contractor-see-customers", element: <ContractorSeeCustomers /> },

       { path:"/contractor/sent-proposals" , element:<ContractorSeeSentProposals/>},

       { path:"/contractor-chat-list", element:<ContractorChatList />}
       
      ],
    },

    // Customer routes
    {
      path: "/",
      element: <CustomerLayout />,
      children: [
        { path: "customer-profile", element: <CustomerProfile /> },
        { path: "/customer-project-track", element: <CustomerProjectTrack /> },
        { path: '/customer/projects', element: <CustomerProjectForm /> },
        { path:"/customer/see-request", element: <CustomerViewRequests  />},
         {path:"/customer/proposals", element:<CustomerProposals />},
         {path:"/customer/shortlisted-proposals", element:<ShortlistedProposals />},
        {path: "/customer/accepted-proposals", element:<CustomerAcceptedProposals />},
        
          {path:"customer-chat-list", element:<CustomerChatList/>},
         
      ],
    },
    {
  path: "/chat/:roomId",
  element: <ChatPage />,
},

    // Admin routes
    { path: 'admin/signup', element: <AdminSignup /> },
    { path: 'admin/login', element: <AdminLogin /> },
    {
  path: "/admin",
  element: (
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: "customers", element: <AdminCustomers /> },
    { path: "contractors", element: <AdminContractors /> },
    { path: "pending-contractors", element: <PendingContractors /> },
    { path: "running-bids", element: <RunningBids /> }
  ],
},
{
       path:"/customer/:id", element:<CustomerProf />
    },{
       path:"/contractor/:id", element:<ContractorProf/>
    }
  ]);

  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}


export default App;



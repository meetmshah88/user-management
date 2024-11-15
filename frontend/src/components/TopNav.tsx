import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Tab, Tabs, Typography } from "@mui/material";
import { SAPIENS_LOGO } from "../constant/data";

const TopNav: React.FC = () => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              src={SAPIENS_LOGO}
              alt="Sapiens Logo"
              width="40px"
              height="40px"
              style={{ marginRight: "15px" }}
            />
            <div>User Management</div>
          </div>
        </Typography>

        {/* Tabs Component to handle route navigation */}
        <Tabs
          value={location.pathname}
          textColor="inherit"
          indicatorColor="primary"
          aria-label="user management navigation"
        >
          <Tab label="List of Users" value="/" component={Link} to="/" />
          <Tab
            label="Create User"
            value="/create-user"
            component={Link}
            to="/create-user"
          />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;

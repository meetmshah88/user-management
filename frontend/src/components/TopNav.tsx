import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Tab, Tabs, Typography } from "@mui/material";

const TopNav: React.FC = () => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
        </Typography>

        {/* Tabs Component to handle route navigation */}
        <Tabs
          value={location.pathname}
          textColor="inherit"
          indicatorColor="primary"
          aria-label="user management navigation"
        >
          <Tab label="List of Users" value="/home" component={Link} to="/home" />
          <Tab
            label="Create User"
            value="/create-user"
            component={Link}
            to="/create-user"
          />
          <Tab 
            label="Slider"
            value="/slider"
            component={Link}
            to="/slider"
          />
          <Tab 
            label="Batch"
            value="/batch"
            component={Link}
            to="/batch"
          />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;

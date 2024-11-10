import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Box, CircularProgress } from "@mui/material";
import { UserType } from "../types/types.ts";
import TableComponent from "../components/Table.tsx";
import { API_BASE } from "../constant/data.ts";

const UserList: React.FC = () => {
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    //Cancel the pending API call if user leaves the Users List page
    const controller = new AbortController();

    axios
      .get(`${API_BASE}/api/users`, {
        signal: controller.signal,
      })
      .then((response) => {
        setUsersList(response.data || []);
      })
      .catch(() => {
        setError("Failed to fetch users");
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const renderContent = () => {
    //Show loader till the time data get fetched
    if (loading) {
      return (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}
        >
          <CircularProgress data-testid="loading-indicator"/>
        </Box>
      );
    }

    //show error message if error occurred during fetching
    if (error) {
      return (
        <Typography color="error" variant="h6" sx={{ textAlign: "center" }}>
          {error}
        </Typography>
      );
    }

    //show no users found message if there is no user exist
    if (usersList.length === 0) {
      return (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ textAlign: "center" }}
        >
          No users found.
        </Typography>
      );
    }

    return <TableComponent usersList={usersList} />;
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        List of Users
      </Typography>

      {renderContent()}
    </Box>
  );
};

export default UserList;

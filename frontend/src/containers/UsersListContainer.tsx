import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Typography, Box, CircularProgress } from "@mui/material";
import { UserType } from "../types/types.ts";
import TableComponent from "../components/Table.tsx";
import { API_BASE } from "../constant/data.ts";
import { useDebounce } from "../hooks/useDebounce.tsx";

type UsersResponseType = {
  users: UserType[] | [];
  page: number;
  limit: number;
  count: number;
};

type EmailsOptionType = { _id: string; emailId: string }[];

const renderOptions = (emails: EmailsOptionType) => {
  return emails.map((email) => {
    return (
      <option value={email.emailId} key={email._id}>
        {email.emailId}
      </option>
    );
  });
};

const UserList: React.FC = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [emailOptions, setEmailOptions] = useState<EmailsOptionType>([]);
  const [limit, setLimit] = useState("5");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentWindow, setCurrentWindow] = useState<number[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>(
    searchParams.get("emailFilter") || ""
  );
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>(
    searchParams.get("searchText") || ""
  );
  const debouncedText = useDebounce(search.trim());
  const initialLoad = useRef(true);

  const fetchNetworkData = async (
    endpoint: string,
    signal: AbortSignal
  ): Promise<UserType[] | []> => {
    setLoading(true);

    try {
      const res = await axios.get(endpoint, { signal });
      if (error) {
        setError("");
      }
      return res.data;
    } catch (error) {
      setError("API ERROR");
      console.log(error);
    } finally {
      setLoading(false);
    }

    return [];
  };

  useEffect(() => {
    const abortController = new AbortController();

    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    // const cachedResult = localStorage.getItem(search.toLowerCase());
    // if (search && cachedResult && !selectedEmail) {
    //   const parsedResult = JSON.parse(cachedResult);
    //   setUsersList(parsedResult || []);
    //   setLoading(false);
    //   return;
    // }

    const updatedParam =
      debouncedText || selectedEmail ? `&${searchParams.toString()}` : "";

    fetchNetworkData(
      `${API_BASE}/api/users?page=${currentPage}&limit=${limit}${updatedParam}`,
      abortController.signal
    )
      .then((result) => {
        const { users, count } = result as unknown as UsersResponseType;
        setUsersList(users || []);

        const totalPagesCalculated = Math.ceil(count / parseInt(limit, 10));
        setTotalPages(count > parseInt(limit, 10) ? totalPagesCalculated : 0);

        // Do not cache if the email id is selected as didn't implement the combinations
        // if (debouncedText && !selectedEmail && !cachedResult) {
        //   localStorage.setItem(
        //     debouncedText.toLowerCase(),
        //     JSON.stringify(users)
        //   );

        //   setTimeout(() => {
        //     localStorage.removeItem(debouncedText.toLowerCase());
        //   }, 10000);
        // }
      })
      .catch((err) => console.error(err));

    return () => {
      abortController.abort();
    };
  }, [debouncedText, selectedEmail, currentPage, limit]);

  useEffect(() => {
    if (totalPages > 3) {
      setCurrentWindow([1, 2, 3]);
    } else if (totalPages > 0) {
      const currentPagesWindow = Array.from({
        length: totalPages,
      }).map((_, index) => index + 1);
      setCurrentWindow(currentPagesWindow);
    }
  }, [totalPages]);

  const handleSearchChange = (searchVal: string): void => {
    if (searchVal) {
      searchParams.set("searchText", searchVal);
    } else {
      searchParams.delete("searchText");
    }

    const updatedParams = searchVal
      ? `?${searchParams.toString()}`
      : selectedEmail
      ? `${window.location.pathname}?${searchParams.toString()}`
      : window.location.pathname;

    window.history.pushState(null, "", updatedParams);
    setCurrentPage(1);
    setSearch(searchVal);
  };

  const handleOptionChange = (val: string): void => {
    if (val) {
      searchParams.set("emailFilter", val);
    } else {
      searchParams.delete("emailFilter");
    }
    const updatedParams = val
      ? `?${searchParams.toString()}`
      : search
      ? `${window.location.pathname}?${searchParams.toString()}`
      : window.location.pathname;

    window.history.pushState(null, "", updatedParams);
    setSelectedEmail(val);
    setCurrentPage(1);
  };

  const renderPages = () => {
    let renderButtons = [];
    for (let i = 0; i < currentWindow.length; i++) {
      console.log("Inside for", currentWindow);
      const button = (
        <button
          id={`button-${currentWindow[i] + 1}`}
          key={`button-${currentWindow[i] + 1}`}
          onClick={() => setCurrentPage(currentWindow[i])}
          style={{
            backgroundColor:
              currentPage === currentWindow[i] ? "grey" : "revert",
          }}
        >
          {currentWindow[i]}
        </button>
      );
      renderButtons.push(button);
    }

    return renderButtons;
  };

  useEffect(() => {
    const removeCacheOnUnload = () => {
      const cacheKeys = Object.keys(localStorage);

      if (cacheKeys.length > 0) {
        for (const key of cacheKeys) {
          delete localStorage[key];
        }
      }
    };

    window.addEventListener("beforeunload", removeCacheOnUnload);
    //Cancel the pending API call if user leaves the Users List page
    const controller = new AbortController();

    if (!search) {
      const updatedParam = selectedEmail ? `&${searchParams.toString()}` : "";

      fetchNetworkData(
        `${API_BASE}/api/users?page=${currentPage}&limit=${limit}${updatedParam}`,
        controller.signal
      )
        .then((result) => {
          const { users, count } = result as unknown as UsersResponseType;
          setUsersList(users || []);
          const totalPagesCalculated = Math.ceil(count / parseInt(limit, 10));
          setTotalPages(count > parseInt(limit, 10) ? totalPagesCalculated : 0);
        })
        .catch((err) => console.error(err));
    }

    axios
      .get(`${API_BASE}/api/users/email`, {
        signal: controller.signal,
      })
      .then((res) => {
        setEmailOptions(res.data);
      })
      .catch((error) => {
        setError(error);
      });

    return () => {
      controller.abort();

      //remove the localstorage during unmount of component

      const keys = Object.keys(localStorage);

      if (keys.length > 0) {
        for (const localKey of keys) {
          delete localStorage[localKey];
        }
      }

      window.removeEventListener("beforeunload", removeCacheOnUnload);
    };
  }, []);

  const renderContent = () => {
    //Show loader till the time data get fetched
    if (loading) {
      return (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginTop: "2em" }}
        >
          <CircularProgress data-testid="loading-indicator" />
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

    return (
      <>
        <TableComponent usersList={usersList} />
      </>
    );
  };

  const onBackHandler = () => {
    setCurrentPage(currentPage - 1);
    if (!currentWindow.includes(currentPage - 1)) {
      const clonedCurrentWindow = [...currentWindow];
      const newPage = clonedCurrentWindow[0] - 1;
      clonedCurrentWindow.pop();
      clonedCurrentWindow.unshift(newPage);
      console.log(clonedCurrentWindow);
      setCurrentWindow(clonedCurrentWindow);
    }
  };

  const onNextHandler = () => {
    setCurrentPage(currentPage + 1);
    if (!currentWindow.includes(currentPage + 1)) {
      const clonedCurrentWindow = [...currentWindow];
      console.log("clonedCurrentWindow", clonedCurrentWindow);
      const newPage = clonedCurrentWindow[clonedCurrentWindow.length - 1] + 1;
      clonedCurrentWindow.shift();
      clonedCurrentWindow.push(newPage);
      console.log(clonedCurrentWindow);
      setCurrentWindow(clonedCurrentWindow);
    }
  };

  const limitChangeHandler = (val: string) => {
    setLimit(val);
    setCurrentPage(1);
  }

  const hideBackButton = currentPage === 1 || totalPages < 4;

  const hideNextButton = currentPage === totalPages || totalPages < 4;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        List of Users
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <label id="searchLabel" htmlFor="search">
            Search :
          </label>
          <input
            type="text"
            onChange={(e) => handleSearchChange(e.target.value)}
            name="search"
            id="search"
            value={search}
            placeholder="Search firstName OR lastName"
          />
        </div>
        <div>
          <label htmlFor="Select Email : ">Email : </label>
          <select
            onChange={(e) => handleOptionChange(e.target.value)}
            value={selectedEmail}
            id="email"
            name="email"
          >
            <option value="">Any</option>
            {renderOptions(emailOptions)}
          </select>
        </div>
        <div>
          <label htmlFor="perPage">Results Per Page</label>
          <select
            id="perPage"
            value={limit}
            onChange={(e) => limitChangeHandler(e.target.value)}
            name="perPage"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {!hideBackButton && (
            <button id="back" onClick={onBackHandler}>
              Back
            </button>
          )}
        </div>
        <div>{totalPages > 0 && renderPages()}</div>
        <div>
          {!hideNextButton && (
            <button id="next" onClick={onNextHandler}>
              Next
            </button>
          )}
        </div>
      </div>
      {renderContent()}
    </Box>
  );
};

export default UserList;

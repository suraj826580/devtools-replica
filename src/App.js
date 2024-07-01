import React, { useState, useMemo } from "react";
import { Container, Grid, Paper } from "@mui/material";
import RequestList from "./components/RequestList";
import RequestDetails from "./components/RequestDetails";
import FilterBar from "./components/FilterBar";
import useNetworkRequests from "./hooks/useNetworkRequests";
import "./App.css";

function App() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { requests, sendRequest } = useNetworkRequests();

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesType = filterType === "all" || request.type === filterType;
      const matchesSearch = request.url
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [requests, filterType, searchTerm]);

  const handleSendRequest = (url, method, body) => {
    sendRequest(url, method, body);
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FilterBar
            filterType={filterType}
            setFilterType={setFilterType}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSendRequest={handleSendRequest}
          />
        </Grid>
        <Grid item xs={4}>
          <Paper>
            <RequestList
              requests={filteredRequests}
              onSelectRequest={setSelectedRequest}
            />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper>
            <RequestDetails request={selectedRequest} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;

import React from "react";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function RequestDetails({ request }) {
  if (!request)
    return <Typography>Select a request to view details</Typography>;

  const formatJSON = (data) => {
    if (typeof data === "string") {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch {
        return data;
      }
    }
    return JSON.stringify(data, null, 2);
  };

  return (
    <Box>
      <Typography variant="h6">Request Details</Typography>

      <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                URL
              </TableCell>
              <TableCell>{request.url}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Method
              </TableCell>
              <TableCell>{request.method}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Status
              </TableCell>
              <TableCell>{request.status || "Pending"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Type
              </TableCell>
              <TableCell>{request.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Start Time
              </TableCell>
              <TableCell>{request.startTime?.toFixed(2)} ms</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                End Time
              </TableCell>
              <TableCell>
                {request.endTime
                  ? request.endTime.toFixed(2) + " ms"
                  : "Pending"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Duration
              </TableCell>
              <TableCell>
                {request.endTime
                  ? (request.endTime - request.startTime).toFixed(2) + " ms"
                  : "Pending"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {request.headers && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Headers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(request.headers).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row">
                        {key}
                      </TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}

      {request.body && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Request Body</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {formatJSON(request.body)}
            </pre>
          </AccordionDetails>
        </Accordion>
      )}

      {request.responseBody && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Response Body</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {formatJSON(request.responseBody)}
            </pre>
          </AccordionDetails>
        </Accordion>
      )}

      {!request.ok && (
        <Typography color="error">
          Error: {request.error || `HTTP Error ${request.status}`}
        </Typography>
      )}
    </Box>
  );
}

export default RequestDetails;

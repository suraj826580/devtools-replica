import React from "react";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

function RequestList({ requests, onSelectRequest }) {
  return (
    <List>
      {requests.map((request) => (
        <ListItem
          key={request.id}
          button
          onClick={() => onSelectRequest(request)}>
          {!request.ok && (
            <ListItemIcon>
              <ErrorIcon color="error" />
            </ListItemIcon>
          )}
          <ListItemText
            primary={request.url}
            secondary={`${request.method} - ${request.status || "Pending"}`}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default RequestList;

import {
  Alert,
  Avatar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import ArrowDown from "@mui/icons-material/ArrowDownward";
import ArrowUp from "@mui/icons-material/ArrowUpward";
import SendIcon from "@mui/icons-material/Send";
import MailIcon from "@mui/icons-material/Mail";
import RequestedIcon from "@mui/icons-material/Check";
import React from "react";

import "./App.css";

import users from "./users";

function IconActionButton({ tooltip, onClick, icon, type, color = "primary" }) {
  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={onClick} color={color} type={type}>
        {icon}
      </IconButton>
    </Tooltip>
  );
}

function MessageBox({ children, onMessageSend }) {
  const [message, setMessage] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);

  const onSubmit = (e) => {
    e.preventDefault();

    onMessageSend(message);

    setMessage("");
  };

  return (
    <div>
      <IconActionButton
        tooltip={isExpanded ? "Close" : "Open"}
        onClick={() => setIsExpanded(!isExpanded)}
        icon={isExpanded ? <ArrowUp /> : <ArrowDown />}
      />
      {isExpanded && <Divider />}
      <Collapse in={isExpanded}>
        <CardContent>
          {children}
          <Box
            sx={{
              marginTop: 2,
            }}
          >
            <form onSubmit={onSubmit}>
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    label="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconActionButton
                    tooltip="Send"
                    type="submit"
                    icon={<SendIcon />}
                  />
                </Grid>
              </Grid>
            </form>
          </Box>
        </CardContent>
      </Collapse>
    </div>
  );
}

function UserAvatar({ avatar, name, showName = true }) {
  if (!name || !showName) {
    return <Avatar src={avatar} name={name} />;
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Avatar src={avatar} alt={name} />
      <span style={{ marginLeft: 10 }}>{name}</span>
    </div>
  );
}

export default function App() {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [conversations, setConversations] = React.useState([]);

  const handleConversationStart = (user) => {
    setConversations([
      ...conversations,
      {
        ...user,
        messages: [],
      },
    ]);

    setIsSnackbarOpen(true);
  };

  const handleMessageSend = (user, message) => {
    const userMsgsIdx = conversations.findIndex((x) => x.id === user.id);

    if (userMsgsIdx === -1) {
      return;
    }

    conversations[userMsgsIdx].messages.push({
      recipient: user.id,
      content: message,
      timestamp: Date.now(),
    });

    setConversations([...conversations]);
  };

  const handleClose = () => setIsSnackbarOpen(false);

  return (
    <div className="App">
      {selectedTab === 0 && (
        <>
          <h1>Users</h1>
          <Grid container spacing={2}>
            {users.map((user) => {
              const hasConversation = conversations.find(
                (c) => c.id === user.id
              );
              return (
                <Grid key={user.id} item xs={12}>
                  <Card>
                    <CardHeader
                      avatar={
                        <UserAvatar avatar={user.avatar} name={user.name} />
                      }
                      action={
                        !hasConversation ? (
                          <IconActionButton
                            tooltip="Start conversation"
                            onClick={() => handleConversationStart(user)}
                            icon={<SendIcon />}
                          />
                        ) : (
                          <Tooltip title="Conversation started">
                            <RequestedIcon
                              style={{ padding: 8 }}
                              color="primary"
                            />
                          </Tooltip>
                        )
                      }
                    />
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
      {selectedTab === 1 && (
        <>
          <Grid container justifyContent="center" alignItems="center">
            <h1>Conversations</h1>
            <Badge badgeContent={conversations.length} color="secondary">
              <MailIcon color="secondary" />
            </Badge>
          </Grid>
          <Grid container spacing={2}>
            {conversations.length === 0 && <>No conversations started</>}
            {conversations.map((conversation) => {
              const lastMessage =
                conversation.messages[conversation.messages.length - 1]
                  ?.content;
              return (
                <Grid key={conversation.id} item xs={12}>
                  <Card>
                    <CardHeader
                      avatar={
                        <UserAvatar
                          avatar={conversation.avatar}
                          name={conversation.name}
                        />
                      }
                      title={
                        lastMessage
                          ? `Last message: ${lastMessage}`
                          : "No messages"
                      }
                    />
                    <MessageBox
                      onMessageSend={(message) =>
                        handleMessageSend(conversation, message)
                      }
                    >
                      <List>
                        {conversation.messages.map(
                          ({ content, timestamp, recipient }) => (
                            <ListItem key={`${recipient}-${timestamp}`}>
                              {content ?? "test"}
                            </ListItem>
                          )
                        )}
                      </List>
                    </MessageBox>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
      <Snackbar
        open={isSnackbarOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={1000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          Conversation created!
        </Alert>
      </Snackbar>
      <BottomNavigation
        showLabels
        value={selectedTab}
        onChange={(event, value) => {
          setSelectedTab(value);
        }}
      >
        <BottomNavigationAction label="Users" />
        <BottomNavigationAction label="Conversations" />
      </BottomNavigation>
    </div>
  );
}

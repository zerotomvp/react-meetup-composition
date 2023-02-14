import { Grid } from "@mui/material";
import users from "../users";
import SingleUser from "./SingleUser";

export default function Messages() {
  return (
    <>
      <h1>Messages</h1>
      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid key={user.id} item xs={12}>
            <SingleUser user={user} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

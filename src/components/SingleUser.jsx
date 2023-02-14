import { Avatar, Card, CardHeader } from "@mui/material";

export default function SingleUser({ user }) {
  const { avatar, fullName } = user;

  return (
    <Card>
      <CardHeader avatar={<Avatar src={avatar} alt={fullName} />} />
    </Card>
  );
}

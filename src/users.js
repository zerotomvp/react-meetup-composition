import { faker } from "@faker-js/faker";

function createUser() {
  return {
    id: faker.datatype.uuid(),
    avatar: faker.image.avatar(),
    name: faker.name.fullName(),
  };
}

const users = faker.datatype.array(5).map((_) => createUser());

export default users;

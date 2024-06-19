import { AutoMap } from "@automapper/classes";

export class User {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  email: string;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;
}

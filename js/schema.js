
export const layout =  {
};

export const schema = {
  title: "Ticket",
  type: "object",
  required: ["title"],
  properties: {
    surname: {type: "string", title: "Surname", default: "Surname"},
    name: {type: "string", title: "Name", default: "Name"},
    email: {type: "string", title: "Email", default: "Email"},
    description: {type: "string", title: "Description", default: "Description"},
  }
};


export const layout =  {
};

export const schema = {
  title: 'Contact',
  type: 'object',
  required: ['surname'],
  properties: {
    // string types with different subtypes (used for widgets)
    name:
        {type: 'string', title: 'Name', default: 'Name'},
    surname:
        {type: 'string', subtype:'string', title: 'Surname', default: 'Name'},
    comments:
        {type: 'string', subtype:'text', title: 'Comments', default: 'Name'},
    password:
        {type: 'string', subtype:'password', title:'Password'},
    date:
        {type: 'string', subtype:'date', title:'Date'},
    description:
        {type: 'string', subtype:'html', title: 'Description', default: 'Description'},
    customer:
        {type: 'string', subtype: 'reference', title: 'Customer'}
  }
};

export const layouts = {
     xs: [{i: "name",       x: 0, y: 0, w: 2, h: 1},
          {i: "surname",    x: 0, y: 1, w: 2, h: 1},
          {i: "password",   x: 0, y: 2, w: 2, h: 1},
          {i: "comments",   x: 0, y: 3, w: 4, h: 1},
          {i: "date",       x: 0, y: 4, w: 2, h: 1},
          {i: "description",x: 0, y: 5, w: 4, h: 4},
          {i: "customer",   x: 0, y: 6, w: 2, h: 1}],
     lg: [{i: "name",       x: 0, y: 0, w: 2, h: 1},
          {i: "surname",    x: 2, y: 0, w: 2, h: 1},
          {i: "password",   x: 4, y: 0, w: 2, h: 1},
          {i: "comments",   x: 0, y: 1, w: 4, h: 1},
          {i: "date",       x: 4, y: 1, w: 2, h: 1},
          {i: "description",x: 0, y: 3, w: 4, h: 4},
          {i: "customer",   x: 0, y: 2, w: 2, h: 1}],
}

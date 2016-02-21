
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

import {contacts} from './reducers';
import {addContact} from './actions';
import {assert} from 'chai';

var contacts_before = [
    {name: 'foo'},
    {name: 'bar', email: 'bar@test.com'}
]

var newContact = {
    name: 'baz',
    email: 'baz@test.com'
}
var contacts_after = [
    {name: 'foo'},
    {name: 'bar', email: 'bar@test.com'},
    {name: 'baz', email: 'baz@test.com', status: 'saving'},
]

describe('contacts', function(){
    it('should have added a contact', function(){
        var nc= contacts(contacts_before, addContact(newContact))
        assert.deepEqual(
            contacts(contacts_before, addContact(newContact)),
            contacts_after);
    })
})





import {docs} from './reducers';
import {addContact} from './actions';
import {assert} from 'chai';

var docs_before = [
    {name: 'foo'},
    {name: 'bar', email: 'bar@test.com'}
]

var newContact = {
    name: 'baz',
    email: 'baz@test.com'
}
var docs_after = [
    {name: 'foo'},
    {name: 'bar', email: 'bar@test.com'},
    {name: 'baz', email: 'baz@test.com', status: 'saving'},
]

describe('docs', function(){
    it('should have added a doc', function(){
        var nc= docs(docs_before, addContact(newContact))
        assert.deepEqual(
            docs(docs_before, addContact(newContact)),
            docs_after);
    })
})





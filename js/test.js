import {docs} from './reducers';
import {addRecord} from './actions';
import {assert} from 'chai';

var docs_before = [
    {name: 'foo'},
    {name: 'bar', email: 'bar@test.com'}
]

var newRecord = {
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
        var nc= docs(docs_before, addRecord(newRecord))
        assert.deepEqual(
            docs(docs_before, addRecord(newRecord)),
            docs_after);
    })
})





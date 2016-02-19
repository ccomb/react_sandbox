import {docs} from './reducers';
import {addRecord} from './actions';
import {assert} from 'chai';

var docsBefore = [
    {name: 'foo'},
    {name: 'bar', email: 'bar@test.com'}
]

var newRecord = {
    name: 'baz',
    email: 'baz@test.com'
}
var docsAfter = [
    {name: 'foo'},
    {name: 'bar', email: 'bar@test.com'},
    {name: 'baz', email: 'baz@test.com', status: 'saving'},
]

describe('docs', function(){
    it('should have added a doc', function(){
        assert.deepEqual(
            docs(docsBefore, addRecord(newRecord)),
            docsAfter);
    })
})





import {docs} from './reducers';
import {addRecord} from './actions';
import {assert} from 'chai';

const docsBefore = [
    {name: 'foo'},
    {name: 'bar', email: 'bar@test.com'}
]

const newRecord = {
    name: 'baz',
    email: 'baz@test.com'
}
const docsAfter = [
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





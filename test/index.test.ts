import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { startHost } from '../src';
// import fs from 'fs';
// import path from 'path';
// import { encode, decode } from '@msgpack/msgpack';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('wasmcloudjs', function () {
  it('should initialize a host with the name and key set', async () => {
    const host = await startHost('default', false, ["ws://localhost:4222"]);
    expect(host.name).to.equal('default');
    expect(host.key).to.be.a('string').and.satisfy((key: string) => key.startsWith('N'));
    expect(host.actors).to.equal({});
  })
})
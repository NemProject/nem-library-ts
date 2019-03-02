/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 NEM
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {expect} from "chai";
import {NodeHttp} from "../../../src/infrastructure/NodeHttp";
import {TimeSyncHttp} from "../../../src/infrastructure/TimeSyncHttp";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {NisNodeInfo} from "../../../src/models/node/NisNodeInfo";
import {Node} from "../../../src/models/node/Node";
import {NodeCollection} from "../../../src/models/node/NodeCollection";
import {NEMLibrary} from "../../../src/NEMLibrary";
import {TestVariables} from "../../config/TestVariables.spec";

describe("NodeHttp", () => {

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should get node time", (done) => {
    const timesync = new TimeSyncHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    timesync.getNetworkTime()
      .subscribe((time) => {
        expect(time).to.not.be.undefined;
        done();
      });
  });

  it("should get node information", (done) => {
    const nodeHttp = new NodeHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    nodeHttp.getNodeInfo()
      .subscribe((node) => {
        expect(node).to.be.instanceOf(Node);
        expect(node.metaData).to.not.be.undefined;
        expect(node.endpoint).to.not.be.undefined;
        expect(node.identity).to.not.be.undefined;
        done();
      });
  });

  it("should get nis node information", (done) => {
    const nodeHttp = new NodeHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    nodeHttp.getNisNodeInfo()
      .subscribe((nisNodeInfo) => {
        expect(nisNodeInfo).to.be.instanceOf(NisNodeInfo);
        expect(nisNodeInfo.node).to.not.be.undefined;
        expect(nisNodeInfo.node.metaData).to.not.be.undefined;
        expect(nisNodeInfo.node.endpoint).to.not.be.undefined;
        expect(nisNodeInfo.node.identity).to.not.be.undefined;
        expect(nisNodeInfo.nisInfo).to.not.be.undefined;
        expect(nisNodeInfo.nisInfo.currentTime).to.not.be.undefined;
        expect(nisNodeInfo.nisInfo.application).to.not.be.undefined;
        expect(nisNodeInfo.nisInfo.startTime).to.not.be.undefined;
        expect(nisNodeInfo.nisInfo.version).to.not.be.undefined;
        expect(nisNodeInfo.nisInfo.signer).to.not.be.undefined;
        done();
      });
  });

  it("should get all nodes information", (done) => {
    const nodeHttp = new NodeHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    nodeHttp.getAllNodes()
      .subscribe((nodeCollection) => {
        expect(nodeCollection).to.be.instanceOf(NodeCollection);
        expect(nodeCollection.inactive).to.not.be.undefined;
        expect(nodeCollection.active).to.not.be.undefined;
        expect(nodeCollection.busy).to.not.be.undefined;
        expect(nodeCollection.failure).to.not.be.undefined;
        done();
      });
  });

  it("should get active nodes information", (done) => {
    const nodeHttp = new NodeHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    nodeHttp.getActiveNodes()
      .subscribe((nodes) => {
        expect(nodes[0]).to.be.instanceOf(Node);
        expect(nodes[0].metaData).to.not.be.undefined;
        expect(nodes[0].endpoint).to.not.be.undefined;
        expect(nodes[0].identity).to.not.be.undefined;
        done();
      });
  });

  it("should get active neighbour nodes information", (done) => {
    const nodeHttp = new NodeHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    nodeHttp.getActiveNeighbourNodes()
      .subscribe((nodes) => {
        expect(nodes[0]).to.be.instanceOf(Node);
        expect(nodes[0].metaData).to.not.be.undefined;
        expect(nodes[0].endpoint).to.not.be.undefined;
        expect(nodes[0].identity).to.not.be.undefined;
        done();
      });
  });

  it("should get maximum chain height in active neighborhood", (done) => {
    const nodeHttp = new NodeHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    nodeHttp.getMaximumChainHeightInActiveNeighborhood()
      .subscribe((blockHeight) => {
        expect(blockHeight).to.not.be.undefined;
        done();
      });
  });

  it("should get node experiences", (done) => {
    const nodeHttp = new NodeHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    nodeHttp.getNodeExperiences()
      .subscribe((nodeExperiences) => {
        expect(nodeExperiences[0].node).to.not.be.undefined;
        expect(nodeExperiences[0].syncs).to.not.be.undefined;
        expect(nodeExperiences[0].experience).to.not.be.undefined;
        expect(nodeExperiences[0].experience.s).to.not.be.undefined;
        expect(nodeExperiences[0].experience.f).to.not.be.undefined;
        done();
      });
  });

  it("uses the default testnet server when no argument is passed in constructor", () => {
    const nodeHttp = new NodeHttp();
    expect(nodeHttp.nextNode()).to.be.equals("http://bigalice2.nem.ninja:7890/node/");
  });

  it("uses a specific domain when it is passed in constructor", () => {
    const nodeHttp = new NodeHttp([{domain: "bob.nem.ninja"}]);
    expect(nodeHttp.nextNode()).to.contain("bob.nem.ninja");
  });
});

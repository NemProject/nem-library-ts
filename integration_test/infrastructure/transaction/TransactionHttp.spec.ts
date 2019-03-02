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
import {Observable} from "rxjs";
import {AssetHttp} from "../../../src/infrastructure/AssetHttp";
import {TransactionHttp} from "../../../src/infrastructure/TransactionHttp";
import {TimeSyncHttp} from "../../../src/infrastructure/TimeSyncHttp";
import {Account} from "../../../src/models/account/Account";
import {Address} from "../../../src/models/account/Address";
import {AssetId} from "../../../src/models/asset/AssetId";
import {XEM} from "../../../src/models/asset/XEM";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {EmptyMessage, PlainMessage} from "../../../src/models/transaction/PlainMessage";
import {TimeWindow} from "../../../src/models/transaction/TimeWindow";
import {TransferTransaction} from "../../../src/models/transaction/TransferTransaction";
import {NEMLibrary} from "../../../src/NEMLibrary";
import {TestVariables} from "../../../test/config/TestVariables.spec";
import { async } from "rxjs/internal/scheduler/async";

declare let process: any;

describe("TransactionHttp", () => {
  const recipientAccount: string = "TBV7LE4TFDEMGVOON5MYOK2P7TU2KEKLMHOLHQT6";
  const privateKey: string = process.env.PRIVATE_KEY || TestVariables.TEST_PRIVATE_KEY;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
  });

  after(() => {
    NEMLibrary.reset();
  });

  /**
   * TODO: We have to create a secure way to test the transactions.
   */
  it("creates a TRANSFER", async () => {
    const transactionHttp = new TransactionHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    const account = Account.createWithPrivateKey(privateKey);
    const amount = new XEM(2000000);
    const transferTransaction = TransferTransaction.create(TimeWindow.createWithDeadline(), new Address(recipientAccount), amount,
      PlainMessage.createFromDTO(
        "74657374207472616e73616374696f6e",
      ));
    const signedTransaction = account.signTransaction(transferTransaction);
    /*
     let result = await transactionHttp.announceTransaction(signedTransaction).toPromise();
     expect(result.message).to.equal("SUCCESS");
     expect(result.transactionHash.data).to.not.null;*/
  });

  it("uses the localhost server when no argument is passed in constructor", () => {
    const transactionHttp = new TransactionHttp();
    expect(transactionHttp.nextNode()).to.be.equals("http://bigalice2.nem.ninja:7890/transaction/");
  });

  it("should create a TRANSFER and throw error wrong fee", (done) => {
    const transactionHttp = new TransactionHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    const account = Account.createWithPrivateKey(privateKey);
    const transferTransaction = new TransferTransaction(
      new Address(recipientAccount),
      new XEM(0),
      TimeWindow.createWithDeadline(),
      1,
      0,
      PlainMessage.createFromDTO(
        "74657374207472616e73616374696f6e",
      ),
    );

    const signedTransaction = account.signTransaction(transferTransaction);
    transactionHttp.announceTransaction(signedTransaction).subscribe((announceSuccessResult) => {

    }, (error) => {
      expect(error.toString()).to.be.contain("FAILURE_INSUFFICIENT_FEE");
      done();
    });
  });

  it("receive a transaction by its hash", (done) => {
    const hash = "cd442136cf5b634a8d608c680103ee5126cebfdc0e549bdd9f01c904b4fa8128";
    const transactionHttp = new TransactionHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    transactionHttp.getByHash(hash)
      .subscribe((transaction) => {
        expect(transaction.getTransactionInfo().hash.data).to.be.equal(hash);
        done();
      });
  });

  it.only("should create a TRANSFER with node network time", async () => {
    const timesync = new TimeSyncHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);

    let timestamp = await timesync.getNetworkTime().toPromise();

    const transactionHttp = new TransactionHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    const account = Account.createWithPrivateKey(privateKey);

    const transferTransaction = TransferTransaction.create(
      TimeWindow.createWithDeadline(timestamp),
      new Address(recipientAccount),
      new XEM(0),
      PlainMessage.createFromDTO('74657374207472616e73616374696f6e')
    );

     const signedTransaction = account.signTransaction(transferTransaction);

      let result =  await transactionHttp.announceTransaction(signedTransaction).toPromise();
      expect(result.message).to.equal("SUCCESS");
      expect(result.transactionHash.data).to.not.null;
  });
});

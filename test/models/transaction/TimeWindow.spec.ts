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
import {ChronoUnit, LocalDateTime, ZonedDateTime, ZoneId, ZoneOffset} from "js-joda";
import {TimeWindow} from "../../../src/models/transaction/TimeWindow";
describe("TimeWindow", () => {

  it("should create window default deadline 2h", () => {
    const timeWindow = TimeWindow.createWithDeadline();
    expect(timeWindow.deadlineToDTO() - timeWindow.timeStampToDTO()).to.be.equal(2 * 60 * 60);
  });

  it("should create window deadline 3h", () => {
    const timeWindow = TimeWindow.createWithDeadline(3);
    expect(timeWindow.deadlineToDTO() - timeWindow.timeStampToDTO()).to.be.equal(3 * 60 * 60);
  });

  it("should create window deadline 10s", () => {
    const timeWindow = TimeWindow.createWithDeadline(10, ChronoUnit.MINUTES);
    expect(timeWindow.deadlineToDTO() - timeWindow.timeStampToDTO()).to.be.equal(10 * 60);
  });

  it("should create timestamp today", () => {
    const timeWindow = TimeWindow.createWithDeadline();
    const date = new Date();
    expect(timeWindow.timeStamp.dayOfMonth()).to.be.equal(date.getDate());
    expect(timeWindow.timeStamp.monthValue()).to.be.equal(date.getMonth() + 1);
    expect(timeWindow.timeStamp.year()).to.be.equal(date.getFullYear());
  });

  it("should throw error deadline smaller than timeStamp", () => {
    expect(() => {
      TimeWindow.createWithDeadline(-3);
    }).to.throw(Error);
  });

  it("should throw error deadline greater than 24h", () => {
    expect(() => {
      TimeWindow.createWithDeadline(2, ChronoUnit.DAYS);
    }).to.throw(Error);
  });

  it("should create window with timeStamp", () => {
    const timeWindow = TimeWindow.createFromDTOInfo(71847392, 71850992);

    expect(timeWindow.timeStampToDTO()).to.be.equal(71847392);
    expect(timeWindow.deadlineToDTO()).to.be.equal(71850992);
  });
});

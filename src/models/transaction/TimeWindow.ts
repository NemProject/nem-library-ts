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

import {ChronoUnit, Instant, LocalDateTime, ZoneId} from "js-joda";

export class TimeWindow {
  public static timestampNemesisBlock: number = 1427587585;

  /**
   * The deadline of the transaction. The deadline is given as the number of seconds elapsed since the creation of the nemesis block.
   * If a transaction does not get included in a block before the deadline is reached, it is deleted.
   */
  public deadline: LocalDateTime;

  /**
   * The number of seconds elapsed since the creation of the nemesis block.
   */
  public timeStamp: LocalDateTime;

  /**
   * @param deadline - LocalDateTime
   * @param timeStamp - LocalDateTime
   */
  constructor(
    timeStamp: LocalDateTime,
    deadline: LocalDateTime,
  ) {
    this.deadline = deadline;
    this.timeStamp = timeStamp;
  }

/**
   * @param deadline
   * @param chronoUnit
   * @returns {TimeWindow}
   */
  public static createWithDeadline(deadline: number = 2, chronoUnit: ChronoUnit = ChronoUnit.HOURS): TimeWindow {
    const currentTimeStamp = (new Date()).getTime();
    const timeStampDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(currentTimeStamp), ZoneId.SYSTEM);
    const deadlineDateTime = timeStampDateTime.plus(deadline, chronoUnit);

    if (deadline <= 0) {
      throw new Error("deadline should be greater than 0");
    } else if (timeStampDateTime.plus(24, ChronoUnit.HOURS).compareTo(deadlineDateTime) != 1) {
      throw new Error("deadline should be less than 24 hours");
    }

    return new TimeWindow(timeStampDateTime, deadlineDateTime);
  }

  /**
   * @param nodeTime
   * @param deadline
   * @param chronoUnit
   * @returns {TimeWindow}
   */
  public static createWithNodeTimeAndDeadline(nodeTime: number = 0, deadline: number = 2, chronoUnit: ChronoUnit = ChronoUnit.HOURS): TimeWindow {
    let timeStampDateTime;

    const currentTimeStamp = (new Date()).getTime();
    timeStampDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(currentTimeStamp), ZoneId.SYSTEM);

    if (nodeTime != 0) {
      let receiveTimeStamp = nodeTime / 1000;
      let nodeTimeStamp = Math.floor(receiveTimeStamp) + Math.floor(new Date().getSeconds() / 10);

      timeStampDateTime = TimeWindow.createLocalDateTimeFromNemDate(nodeTimeStamp);
    }

    const deadlineDateTime = timeStampDateTime.plus(deadline, chronoUnit);

    if (deadline <= 0) {
      throw new Error("deadline should be greater than 0");
    } else if (timeStampDateTime.plus(24, ChronoUnit.HOURS).compareTo(deadlineDateTime) != 1) {
      throw new Error("deadline should be less than 24 hours");
    }

    return new TimeWindow(timeStampDateTime, deadlineDateTime);
  }

  /**
   * @internal
   * @param timestamp
   * @param deadline
   */
  public static createFromDTOInfo(timeStamp: number, deadline: number): TimeWindow {
    return new TimeWindow(
      TimeWindow.createLocalDateTimeFromNemDate(timeStamp),
      TimeWindow.createLocalDateTimeFromNemDate(deadline),
    );
  }

  /**
   * @internal
   * @param dateSeconds
   * @returns {LocalDateTime}
   */
  public static createLocalDateTimeFromNemDate(dateSeconds: number): LocalDateTime {
    return LocalDateTime.ofInstant(Instant.ofEpochMilli(1000 * Math.round(dateSeconds + TimeWindow.timestampNemesisBlock)), ZoneId.SYSTEM);
  }

  /**
   * @internal
   */
  public deadlineToDTO(): number {
    return this.deadline.atZone(ZoneId.SYSTEM).toEpochSecond() - TimeWindow.timestampNemesisBlock;
  }

  /**
   * @internal
   */
  public timeStampToDTO(): number {
    return this.timeStamp.atZone(ZoneId.SYSTEM).toEpochSecond() - TimeWindow.timestampNemesisBlock;
  }
}

import { describe, it, expect } from "vitest";
import { tierMixByDay, tierForDate, dateKey, scheduleDates } from "./scheduler";

describe("tierMixByDay", () => {
  it("covers all seven days", () => {
    for (let day = 0; day <= 6; day++) {
      expect(tierMixByDay[day as 0 | 1 | 2 | 3 | 4 | 5 | 6]).toBeDefined();
    }
  });

  it("Monday and Tuesday are Tier 1 only", () => {
    expect(tierMixByDay[1]).toEqual([1]);
    expect(tierMixByDay[2]).toEqual([1]);
  });

  it("Wednesday mixes Tier 1 and 2", () => {
    expect(tierMixByDay[3]).toContain(1);
    expect(tierMixByDay[3]).toContain(2);
  });

  it("Thursday and Friday are Tier 2 only", () => {
    expect(tierMixByDay[4]).toEqual([2]);
    expect(tierMixByDay[5]).toEqual([2]);
  });

  it("Saturday mixes Tier 2 and 3", () => {
    expect(tierMixByDay[6]).toContain(2);
    expect(tierMixByDay[6]).toContain(3);
  });

  it("Sunday is Tier 3 only", () => {
    expect(tierMixByDay[0]).toEqual([3]);
  });

  it("every tier value is 1, 2, or 3", () => {
    for (let day = 0; day <= 6; day++) {
      for (const tier of tierMixByDay[day as 0 | 1 | 2 | 3 | 4 | 5 | 6]) {
        expect([1, 2, 3]).toContain(tier);
      }
    }
  });
});

describe("tierForDate", () => {
  it("returns a valid tier for any date", () => {
    const dates = scheduleDates(new Date("2026-05-04"), 7); // one full week
    for (const date of dates) {
      expect([1, 2, 3]).toContain(tierForDate(date));
    }
  });

  it("returns only Tier 1 on Mondays", () => {
    const monday = new Date("2026-05-04"); // known Monday
    expect(monday.getUTCDay()).toBe(1);
    // Run multiple times since tierForDate may be random on mixed days
    for (let i = 0; i < 10; i++) {
      expect(tierForDate(monday)).toBe(1);
    }
  });

  it("returns only Tier 3 on Sundays", () => {
    const sunday = new Date("2026-05-10"); // known Sunday
    expect(sunday.getUTCDay()).toBe(0);
    for (let i = 0; i < 10; i++) {
      expect(tierForDate(sunday)).toBe(3);
    }
  });

  it("returns Tier 2 or 3 on Saturdays", () => {
    const saturday = new Date("2026-05-09"); // known Saturday
    expect(saturday.getUTCDay()).toBe(6);
    const tiers = new Set(Array.from({ length: 50 }, () => tierForDate(saturday)));
    expect([...tiers].every((t) => t === 2 || t === 3)).toBe(true);
  });
});

describe("dateKey", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(dateKey(new Date("2026-04-28T00:00:00Z"))).toBe("2026-04-28");
  });

  it("zero-pads month and day", () => {
    expect(dateKey(new Date("2026-01-05T00:00:00Z"))).toBe("2026-01-05");
  });
});

describe("scheduleDates", () => {
  it("returns the requested count of dates", () => {
    const dates = scheduleDates(new Date("2026-05-04"), 7);
    expect(dates.length).toBe(7);
  });

  it("dates are consecutive", () => {
    const dates = scheduleDates(new Date("2026-05-04"), 5);
    for (let i = 1; i < dates.length; i++) {
      const diff = dates[i].getTime() - dates[i - 1].getTime();
      expect(diff).toBe(24 * 60 * 60 * 1000);
    }
  });

  it("starts on the given date", () => {
    const start = new Date("2026-05-04T00:00:00Z");
    const dates = scheduleDates(start, 3);
    expect(dateKey(dates[0])).toBe("2026-05-04");
  });

  it("does not mutate the start date", () => {
    const start = new Date("2026-05-04T00:00:00Z");
    const original = start.getTime();
    scheduleDates(start, 7);
    expect(start.getTime()).toBe(original);
  });
});

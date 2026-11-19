export const marketSample = {
  updatedAt: "2026-11-18T09:00:00+07:00",
  gold: { buy: 146_500_000, sell: 148_500_000, change: 500_000, source: "SJC" },
  fuel: {
    name: "Xăng RON 95-III",
    price: 20_090,
    change: -190,
    source: "Bộ Công Thương",
  },
  goldHistory: [
    142_800_000, 143_500_000, 144_200_000, 143_900_000, 145_300_000,
    146_000_000, 148_500_000,
  ],
  labels: ["12/11", "13/11", "14/11", "15/11", "16/11", "17/11", "18/11"],
} as const;

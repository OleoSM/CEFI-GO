export const MOCK_ADMIN_METRICS = {
  total_users: 3840,
  active_subscriptions: 1420,
  monthly_revenue: 87600,
  churn_rate: 3.2,
  active_today: 847,
};

export const MOCK_ADMIN_MONTHLY_USERS = [
  { month: "Ene", users: 320 }, { month: "Feb", users: 410 }, { month: "Mar", users: 580 },
  { month: "Abr", users: 720 }, { month: "May", users: 890 }, { month: "Jun", users: 1040 },
];

export const analyticsData = {
  newUsersPerMonth: MOCK_ADMIN_MONTHLY_USERS,
  revenuePerMonth: [
    { month: "Ene", value: 18400 }, { month: "Feb", value: 23100 }, { month: "Mar", value: 31200 },
    { month: "Abr", value: 38900 }, { month: "May", value: 47600 }, { month: "Jun", value: 56300 },
  ],
  topCourses: [
    { name: "Examen UNAM", views: 12480, completion: 74 },
    { name: "Examen IPN",  views: 9320,  completion: 68 },
    { name: "COMIPEMS",    views: 8110,  completion: 81 },
    { name: "Examen UAM",  views: 5240,  completion: 72 },
  ],
  churnRate: 3.2,
  avgSession: "28 min",
};

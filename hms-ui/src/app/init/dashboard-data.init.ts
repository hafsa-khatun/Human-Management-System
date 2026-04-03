export function initDashboardData() {
  const data = {
    totalEmployees: 120,
    activeEmployees: 98,
    onLeave: 12,
    newJoin: 10,
    departments: [
      { name: 'HR', count: 10 },
      { name: 'IT', count: 25 },
      { name: 'Accounts', count: 15 },
      { name: 'Production', count: 40 }
    ],
    recentActivities: [
      'Rahim joined IT department',
      'Karima leave approved',
      'Hasan profile updated'
    ]
  };

  if (!localStorage.getItem('dashboard')) {
    localStorage.setItem('dashboard', JSON.stringify(data));
  }
}

import { inject, Injectable } from '@angular/core';
import { EmployeeService } from './employee-service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private empService = inject(EmployeeService);

getDashboardStats(): Observable<any> {
  return this.empService.getAll().pipe(
    map((employees: any[]) => {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const newJoiners = employees.filter(emp => {
        const joinDate = new Date(emp.dateOfJoining);
        return joinDate >= thirtyDaysAgo && joinDate <= today;
      }).length;

      // Active / Inactive (leave employees included in inactive)
      const activeEmployees = employees.filter(emp => emp.status === 'ACTIVE').length;
      const inactiveEmployees = employees.length - activeEmployees; // onLeave + inactive

      return {
        totalEmployees: employees.length,
        activeEmployees: activeEmployees,
        inactiveEmployees: inactiveEmployees,  // ✅ include leave employees
        newJoin: newJoiners,
        departments: this.calculateDeptStats(employees)
      };
    })
  );
}



  private calculateDeptStats(employees: any[]) {
    const counts: any = {};
    employees.forEach(emp => {
      const deptName = emp.departmentName || 'Others';
      counts[deptName] = (counts[deptName] || 0) + 1;
    });
    return Object.keys(counts).map(name => ({ name, count: counts[name] }));
  }
}

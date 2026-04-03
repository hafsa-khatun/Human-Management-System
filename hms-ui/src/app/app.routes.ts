import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Layouts } from './components/layouts/layouts';
import { Dashboard } from './components/dashboard/dashboard';

import { EmployeeSalary } from './components/employee-salary/employee-salary';



import { Department } from './employee/department/department';
import { Designation } from './employee/designation/designation';
import { Leave } from './employee/leave/leave';
import { Registration } from './employee/registration/registration';
import { Attendance } from './performancemangement/attendance/attendance';
import { Documents } from './performancemangement/documents/documents';
import { Performance } from './performancemangement/performance/performance';
import { Applicant } from './trainingManagement/applicant/applicant';
import { Training } from './trainingManagement/training/training';
import { Employee } from './employee/employee/employee';
import { Project } from './employee/project/project';
import { LeaveRequest } from './performancemangement/leave-request/leave-request';
import { PayrollProcessing } from './performancemangement/payroll-processing/payroll-processing';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Layouts,
        children: [
            {
                path: 'dashboard',
                component: Dashboard


            },
            {
                path: 'employee',
                component: Employee


            },
            {
                path: 'department',
                component: Department
            },
            {
                path: 'designation',
                component: Designation
            },
            {
                path: 'registration',
                component: Registration
            },
            {
                path: 'leave',
                component: Leave
            },
            {
                path: 'project',
                component: Project
            },

            {
                path: 'employee-salary',
                component: EmployeeSalary
            },
            {
                path: 'attendance',
                component: Attendance
            },
            {
                path: 'leave-request',
                component: LeaveRequest
            },
            {
                path: 'payroll-processing',
                component: PayrollProcessing
            },

            {
                path: 'documents',
                component: Documents
            },
            {
                path: 'performance',
                component: Performance
            },
            //Trainging
            {
                path: 'applicant',
                component: Applicant
            },
            {
                path: 'training',
                component: Training
            }


        ]
    }
];

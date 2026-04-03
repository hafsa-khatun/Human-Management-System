export class SalaryModel {
  employeeId?: number;
  id?: number;
  salaryCode: string = '';
  name: string = '';
  phone: string = '';
  basicSalary: number = 0;
  overTimeRate: number = 0;
  overTimeHour: number = 0;
  bankName: string = '';

  // Optional: auto calculated getters
  get houseRent(): number {
    return this.basicSalary * 0.2;
  }

  get medical(): number {
    return this.basicSalary * 0.1;
  }

  get transport(): number {
    return this.basicSalary * 0.15;
  }

  get grossSalary(): number {
    return this.basicSalary + this.houseRent + this.medical + this.transport + (this.overTimeRate * this.overTimeHour);
  }

  // Convert API response to model
static fromApi(data: any): SalaryModel {
  const s = new SalaryModel();
  s.id = data.id;
  s.employeeId = data.employeeId; 
  s.salaryCode = data.salaryCode;
  s.name = data.name;
  s.phone = data.phone;
  s.basicSalary = data.basicSalary;
  s.overTimeRate = data.overTimeRate;
  s.overTimeHour = data.overTimeHour;
  s.bankName = data.bankName;
  return s;
}


  // Convert model to API format
toApi(): any {
  return {
    id: this.id,
    employeeId: this.employeeId,
    salaryCode: this.salaryCode,
    name: this.name,
    phone: this.phone,
    basicSalary: this.basicSalary,
    overTimeRate: this.overTimeRate,
    overTimeHour: this.overTimeHour,
    bankName: this.bankName
  };
}

}

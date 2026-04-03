export class DepartmentModel {
  id: number = 0; 
  name: string = '';
  createdDate?: Date;

  static fromApi(data: any): DepartmentModel {
    const dep = new DepartmentModel();
    dep.id = data.id;         
    dep.name = data.name;    
    dep.createdDate = data.createdDate ? new Date(data.createdDate) : undefined;
    return dep;
  }

  toApi() {
    return {name: this.name };
  }
}
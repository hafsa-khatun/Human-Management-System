export class DesignationModel {
  id: number = 0;
  name: string = '';
  departmentId: number = 0;
  departmentName: string = '';  
  createdDate?: Date;

  static fromApi(data: any): DesignationModel {
    const d = new DesignationModel();
    d.id = data.id;
    d.name = data.name;

    d.departmentId = data.department?.id || 0;
    d.departmentName = data.department?.name || '';
    d.createdDate = data.createdDate ? new Date(data.createdDate) : undefined;
    return d;
  }

  toApi() {
    return {
     
      name: this.name,
      department: { id: this.departmentId } 
    };
  }
}
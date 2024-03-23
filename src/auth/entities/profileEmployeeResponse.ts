export class ProfileEmployeeResponse {
    id: string;
    fullname: string;
    birthdate: Date;
    cellphone: string;
    email: string;
    ci: string;
    address: string;
    employee: EmployeeResponse;
    hospital: HospitalResponse;
    createdAt: Date;
    updatedAt: Date;
}

export class EmployeeResponse {
    id: string;
    roles: RoleEmployeeResponse[];

}

export class RoleEmployeeResponse {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export class HospitalResponse {
    id: string;
    name: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}
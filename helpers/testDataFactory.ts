import { faker } from "@faker-js/faker";

interface EmployeeData {
  firstName: string;
  lastName: string;
  middleName: string;
  employeeId: string;
  fullName: string;
}

interface UserCredentials {
  username: string;
  password: string;
  role: "Admin" | "ESS";
}

interface LeaveData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface PersonalDetails {
  firstName: string;
  lastName: string;
  middleName: string;
  driverLicense: string;
  nationality: string;
  maritalStatus: "Single" | "Married" | "Other";
  gender: "Male" | "Female";
  dateOfBirth: string;
}

interface ContactDetails {
  street1: string;
  city: string;
  province: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export class TestDataFactory {
  static employee(): EmployeeData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const middleName = faker.person.firstName();
    const employeeId = "EMP-" + Date.now();
    const fullName = firstName + " " + lastName;

    return { firstName, lastName, middleName, employeeId, fullName };
  }

  static userCredentials(role?: "Admin" | "ESS"): UserCredentials {
    return {
      username: "user." + faker.internet.username().toLowerCase() + "." + Date.now(),
      password: "Test@" + faker.number.int({ min: 1000, max: 9999 }),
      role: role || "ESS",
    };
  }

  static leaveData(daysFromNow?: number): LeaveData {
    const startDate = new Date();

    startDate.setDate(startDate.getDate() + (daysFromNow ?? 7));

    const endDate = new Date(startDate);

    endDate.setDate(endDate.getDate() + 1);

    return {
      leaveType: faker.helpers.arrayElement(["Annual Leave", "Casual Leave", "Medical Leave"]),
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      reason: faker.lorem.sentence(),
    };
  }

  static personalDetails(): PersonalDetails {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      middleName: faker.person.firstName(),
      driverLicense: faker.string.alphanumeric({ length: 9, casing: "mixed" }),
      nationality: faker.location.country(),
      maritalStatus: faker.helpers.arrayElement(["Single", "Married", "Other"]),
      gender: faker.helpers.arrayElement(["Male", "Female"]),
      dateOfBirth: faker.date
        .between({
          from: "1960-01-01",
          to: "2000-12-31",
        })
        .toISOString()
        .split("T")[0],
    };
  }

  static contactDetails(): ContactDetails {
    return {
      street1: faker.location.streetAddress(),
      city: faker.location.city(),
      province: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
    };
  }

  static emergencyContact(): EmergencyContact {
    return {
      name: faker.person.fullName(),
      relationship: faker.helpers.arrayElement(["Spouse", "Parent", "Sibling", "Friend", "Other"]),
      phone: faker.phone.number(),
    };
  }

  static uniqueId(prefix?: string): string {
    return (prefix || "ID") + "-" + Date.now();
  }

  static futureDate(daysFromNow: number): string {
    const date = new Date();

    date.setDate(date.getDate() + daysFromNow);

    return date.toISOString().split("T")[0];
  }

  static pastDate(daysAgo: number): string {
    const date = new Date();

    date.setDate(date.getDate() - daysAgo);

    return date.toISOString().split("T")[0];
  }
}

export type {
  EmployeeData,
  UserCredentials,
  LeaveData,
  PersonalDetails,
  ContactDetails,
  EmergencyContact,
};

import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointment, CitizenProfile, Facility, MedicineStock } from '../../common/types';
import { nextId, reference } from '../../data/seed';
import { APPOINTMENTS, FACILITIES, MEDICINES, StoredAppointment } from './data';
import { BookAppointmentDto } from './dto/book-appointment.dto';

@Injectable()
export class HealthService {
  listFacilities(municipality?: string, type?: string): Facility[] {
    return FACILITIES.filter(
      (f) =>
        (!municipality || f.municipality.toLowerCase() === municipality.toLowerCase()) &&
        (!type || f.type === type),
    );
  }

  listMedicines(q?: string): MedicineStock[] {
    if (!q) return [...MEDICINES];
    const needle = q.toLowerCase();
    return MEDICINES.filter(
      (m) =>
        m.name.toLowerCase().includes(needle) || m.genericName.toLowerCase().includes(needle),
    );
  }

  listAppointments(citizen: CitizenProfile): Appointment[] {
    return APPOINTMENTS.filter((a) => a.nin === citizen.nin).map((a) => this.toPublic(a));
  }

  bookAppointment(citizen: CitizenProfile, dto: BookAppointmentDto): Appointment {
    const facility = FACILITIES.find((f) => f.id === dto.facilityId);
    if (!facility) throw new NotFoundException('Facility not found');
    const appointment: StoredAppointment = {
      id: nextId('apt'),
      nin: citizen.nin,
      facilityId: facility.id,
      facilityName: facility.name,
      department: dto.department,
      scheduledFor: new Date(dto.preferredDate).toISOString(),
      status: 'booked',
      reference: reference('APT'),
    };
    APPOINTMENTS.push(appointment);
    return this.toPublic(appointment);
  }

  private toPublic(a: StoredAppointment): Appointment {
    const { nin: _nin, ...rest } = a;
    return rest;
  }
}

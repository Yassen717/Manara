import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionsStore } from '../../data/sessions.store';
import { MUNICIPALITIES, REGIONS } from '../../data/seed';
import { CitizenProfile, Municipality, Region } from '../../common/types';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class CitizensService {
  getProfile(citizen: CitizenProfile): CitizenProfile {
    return citizen;
  }

  updateProfile(citizen: CitizenProfile, dto: UpdateProfileDto): CitizenProfile {
    const updated = SessionsStore.updateCitizen(citizen.nin, dto);
    if (!updated) throw new NotFoundException('Citizen not found');
    return updated;
  }

  listMunicipalities(): Municipality[] {
    return MUNICIPALITIES;
  }

  listRegions(): Region[] {
    return REGIONS;
  }
}

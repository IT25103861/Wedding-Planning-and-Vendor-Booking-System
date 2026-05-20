package com.sliit.weddingplanner.service;

import com.sliit.weddingplanner.dto.EventPackageDTO;
import java.util.List;

public interface EventPackageService {
    EventPackageDTO addPackageToEvent(EventPackageDTO dto);
    void removePackageFromEvent(int eventPackageId);
    List<EventPackageDTO> getPackagesByEvent(int eventId);
}

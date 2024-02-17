from pydantic import BaseModel

class ReportReading(BaseModel):
    phase: str

class Panel(BaseModel):
    panel_number: str

class PanelPost(BaseModel):
    panel_number: str
    phase_number: str
    amps: str
    ab: str
    latest_reading: str
    name_notes_detail: str
    kW_capacity: str
    kW_reading: str
    percent_of_breaker: str
 

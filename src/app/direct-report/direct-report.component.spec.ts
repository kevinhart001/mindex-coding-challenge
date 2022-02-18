import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeService } from '../employee.service';

import { DirectReportComponent } from './direct-report.component';

const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', ['getAll', 'get', 'save', 'remove']);

describe('DirectReportComponent', () => {
  let component: DirectReportComponent;
  let fixture: ComponentFixture<DirectReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectReportComponent ],
      providers: [{provide: EmployeeService, useValue: employeeServiceSpy}]
    })
    .compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(DirectReportComponent);
    const comp = fixture.debugElement.componentInstance;
    expect(comp).toBeTruthy();
  }));

  it('should get employee on init', async(() => {
    const fixture = TestBed.createComponent(DirectReportComponent);
    const comp = fixture.debugElement.componentInstance as DirectReportComponent;
    
    employeeServiceSpy.get.and.returnValue({ pipe: () => {} });

    comp.employeeId = 56;
    fixture.detectChanges();

    expect(employeeServiceSpy.get).toHaveBeenCalledWith(56);
  }));
});

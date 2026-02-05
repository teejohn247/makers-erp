import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { HumanResourcesService } from '../hr/human-resources.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private hrService: HumanResourcesService,
  ) { }

  private dataSubject: ReplaySubject<string> = new ReplaySubject<string>(1);

  setData(data: string): void {
    this.dataSubject.next(data);
  }

  getData$(): Observable<string> {
    return this.dataSubject.asObservable();
  }

  getDepartments() {
    let departments;
    this.hrService.getDepartments().subscribe({
      next:(res) => {
        if(res.success) {
          departments = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
    return departments;
  }
  
}

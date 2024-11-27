import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCountSubject = new BehaviorSubject<number>(0);


  loading$ = this.loadingSubject.asObservable();
  loadingCount$ = this.loadingCountSubject.asObservable();



  constructor() { }

  private updateLoadingState(){
    const isLoading = this.loadingCountSubject.value > 0;
    this.loadingSubject.next(isLoading);
  }

  show(){
    const currentCount = this.loadingCountSubject.value;
    this.loadingCountSubject.next(currentCount+1);
    this.updateLoadingState();
  }

  hide(){
    const currentCount = this.loadingCountSubject.value;
    this.loadingCountSubject.next(Math.max(0,currentCount-1));
    this.updateLoadingState();
  }

  reset(){
    this.loadingCountSubject.next(0);
    this.updateLoadingState();
  }

}

import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Observable,
  Subject,
  debounceTime,
  delay,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
  });

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  get code() {
    return this.form.get('code');
  }

  inProgress = false;
  codeIcon = '';

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor() {
    this.onCodeChange().subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private onCodeChange(): Observable<void> {
    return this.form.get('code')!.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      tap((code) => {
        this.inProgress = !!code;
        this.codeIcon = '';
      }),
      debounceTime(1000),
      filter((code) => !!code),
      switchMap((code) => this.validateCode(code)),
      map((isValid) => {
        this.inProgress = false;
        this.codeIcon = isValid ? 'check_circle' : 'error';
        if (!isValid) {
          this.code?.setErrors({ invalidCode: true });
          this.code?.markAllAsTouched();
        }
      })
    );
  }

  private validateCode(code: string | null): Observable<boolean> {
    return new Observable<boolean>((obs) => {
      if (code === 'code') return obs.next(true);
      return obs.next(false);
    }).pipe(delay(500));
  }
}

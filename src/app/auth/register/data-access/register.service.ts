import { computed, inject, Injectable, signal } from "@angular/core";
import { PocketBaseService } from "../../../shared/data-access/pocket-base.service";
import { catchError, EMPTY, from, Subject, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CreateCredentials } from "../../../shared/interfaces/credentials";
import { Router } from "@angular/router";

export interface RegisterState {
  loading: boolean;
  error: string | null;
}

@Injectable()
export class RegisterService {
  client = inject(PocketBaseService).client;
  router = inject(Router);

  //state
  readonly #state = signal<RegisterState>({
    loading: false,
    error: null,
  });

  //selectors
  loading = computed(() => this.#state().loading);
  error = computed(() => this.#state().error);  

  //sources
  register$ = new Subject<CreateCredentials>();

  constructor() {
    this.register$.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.#state.update((state) => ({
          ...state,
          loading: true,
          error: null,
        }));
      }),
      switchMap((user) => 
        from(this.register(user)).pipe(
          catchError((error) => {
            this.#state.update((state) => ({
              ...state,
              loading: false,
              error: error.message,
            }));
            return EMPTY;
          })
        )
      ),
    )
    .subscribe(() => this.router.navigate(['auth/login']));
  }

  private register(user: CreateCredentials) {
    return this.client.collection('users').create({
      username: user.username,
      email: user.email,
      password: user.password,
      passwordConfirm: user.passwordConfirm,
    });
  }
}
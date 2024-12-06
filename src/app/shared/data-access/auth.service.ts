import { computed, DestroyRef, inject, Injectable, signal } from "@angular/core";
import { AuthRecord } from 'pocketbase';
import { catchError, EMPTY, from, fromEventPattern, Subject, switchMap, tap } from "rxjs";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Credentials } from "../interfaces/credentials";
import { PocketBaseService } from "./pocket-base.service";
import { Router } from "@angular/router";

export interface AuthState {
  currentUser: AuthRecord | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  client = inject(PocketBaseService).client;
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  //state
  readonly #state = signal<AuthState>({
    currentUser: null,
    loading: false,
    error: null,
  });

  //selectors
  currentUser = computed(() => this.#state().currentUser);
  loading = computed(() => this.#state().loading);
  error = computed(() => this.#state().error);
  

  //sources
  authStoreChanged$ = fromEventPattern<AuthRecord>(
    handler => this.client.authStore.onChange((...args) => handler(args[1]))
  );
  login$ = new Subject<Credentials>();
  logout$ = new Subject<void>();

  constructor() {
    this.initializeAuthState();

    this.authStoreChanged$.pipe(
      takeUntilDestroyed(),
      catchError((error) => {
        this.#state.update((state) => ({
          ...state,
          loading: false,
          error: error.message,
        }));
        return EMPTY;
      })
    ).subscribe((user) => {
      this.#state.update((state) => ({
        ...state,
        currentUser: user,
        loading: false,
        error: null
      }));
    });

    this.login$.pipe(
      takeUntilDestroyed(),
      tap(() => {
        this.#state.update((state) => ({
          ...state,
          loading: true,
          error: null,
        }));
      }),
      switchMap((credentials) => 
        from(this.login(credentials)).pipe(
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
    ).subscribe();

    this.logout$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.client.authStore.clear();
      this.router.navigate(['auth/login']);
    });
  }

  private initializeAuthState() {
    if (this.client.authStore.isValid) {
      this.#state.update((state) => ({
        ...state,
        currentUser: this.client.authStore.record,
      }));
    }
  }

  private login(credentials: Credentials) {
    return this.client.collection('users').authWithPassword(credentials.username, credentials.password);
  }
}
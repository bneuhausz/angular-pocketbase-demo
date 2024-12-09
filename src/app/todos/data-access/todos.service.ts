import { computed, inject, Injectable, signal } from "@angular/core";
import { Todo } from "../interfaces/todo";
import { HttpClient } from "@angular/common/http";
import { startWith, Subject, switchMap, tap } from "rxjs";
import { Pagination } from "../interfaces/pagination";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export interface TodosState {
  todos: Todo[];
  loading: boolean;
  page: number;
  pageSize: number;
  completedFilter: boolean | null;
}

@Injectable()
export class TodosService {
  readonly #http = inject(HttpClient);

  //state
  readonly #state = signal<TodosState>({
    todos: [],
    loading: true,
    page: 1,
    pageSize: 5,
    completedFilter: null,
  });

  //selectors
  page = computed(() => this.#state().page);
  pageSize = computed(() => this.#state().pageSize);
  loading = computed(() => this.#state().loading);
  todos = computed(() => this.#state().todos);
  completedFilter = computed(() => this.#state().completedFilter);

  //soruces
  pagination$ = new Subject<Pagination>();
  readonly #paginated$ = this.pagination$
    .pipe(
      takeUntilDestroyed(),
      startWith({page: this.page(), pageSize: this.pageSize()}),
      tap((page) => {
        this.#state.update((state) =>
          ({ ...state, page: page.page, pageSize: page.pageSize, loading: true }));
      }),
      switchMap(() => this.getTodos()),
    );

  completedFilter$ = new Subject<boolean | null>();
  readonly #filtered$ = this.completedFilter$
    .pipe(
      takeUntilDestroyed(),
      tap((filter) => {
        this.#state.update((state) =>
          ({ ...state, completedFilter: filter, loading: true }));
      }),
      switchMap(() => this.getTodos()),
    );

  constructor() {  
    this.#paginated$.subscribe(todos => {
      this.#state.update((state) =>
        ({ ...state, todos, loading: false }))
    });

    this.#filtered$.subscribe(todos => {
      this.#state.update((state) =>
        ({ ...state, todos, loading: false }))
    });
  }

  getTodos() {
    let url = `https://jsonplaceholder.typicode.com/todos?_page=${this.page()}=&_limit=${this.pageSize()}`;

    if (this.completedFilter() !== null) {
      url += `&completed=${this.completedFilter()}`;
    }

    return this.#http.get<Todo[]>(url);
  }
}
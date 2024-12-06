import { Component, inject } from "@angular/core";
import { TodosTableComponent } from "./ui/todos-table.component";
import { TodosService } from "./data-access/todos.service";

@Component({
  selector: "app-mat-table",
  imports: [TodosTableComponent],
  providers: [TodosService],
  template: `
    <app-todos-table
      [data]="todosService.todos()"
      [loading]="todosService.loading()"
      [pageSize]="todosService.pageSize()"
      [pageIndex]="todosService.page() - 1"
      [completedFilter]="todosService.completedFilter()"
      (pageChange)="todosService.pagination$.next($event)"
      (filterChange)="todosService.completedFilter$.next($event)"
    />
  `,
})
export default class TodosComponent {
  todosService = inject(TodosService);
}
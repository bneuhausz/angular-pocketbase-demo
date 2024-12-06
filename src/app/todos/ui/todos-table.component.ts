import { Component, input, output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from '@angular/material/table';
import { Todo } from "../interfaces/todo";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Pagination } from "../interfaces/pagination";
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: "app-todos-table",
  imports: [MatTableModule, MatCardModule, MatProgressSpinnerModule, MatPaginatorModule, MatCheckboxModule],
  template: `
    <section>
      <mat-card>
        @if (loading()) {
          <mat-progress-spinner mode="indeterminate" diameter="100"></mat-progress-spinner>
        }
        @else {
          <table mat-table [dataSource]="data()">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let todo">{{todo.id}}</td>
            </ng-container>
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let todo">{{todo.title}}</td>
            </ng-container>
            <ng-container matColumnDef="completed">
              <th mat-header-cell *matHeaderCellDef>
                <mat-checkbox
                  [checked]="completedFilter() === true"
                  [indeterminate]="completedFilter() === null"
                  (change)="onCheckboxChange()">
                </mat-checkbox>
                Completed
              </th>
              <td mat-cell *matCellDef="let todo">
                <mat-checkbox
                  class="checkbox-margin"
                  [checked]="todo.completed"
                  [disabled]="true"
              ></mat-checkbox>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <mat-paginator [pageSize]="pageSize()" [pageSizeOptions]="[5, 10]"
            [length]="200" [pageIndex]="pageIndex()" (page)="pageEvent($event)"></mat-paginator>
        }
      </mat-card>
    </section>
  `,
  styles: [
    `
      mat-card {
        width: 800px;
        margin: 20px 10px;
        padding: 20px 0;
      }

      section {
        display: flex;
        justify-content: center;
      }

      table {
        width: 100%;
      }

      .checkbox-margin {
        margin: 0 50px;
      }
    `
  ]
})
export class TodosTableComponent {
  loading = input.required<boolean>();
  data = input.required<Todo[]>();
  pageSize = input.required<number>();
  pageIndex = input.required<number>();
  completedFilter = input.required<boolean | null>();
  pageChange = output<Pagination>();
  filterChange = output<boolean | null>();

  displayedColumns = ['id', 'title', 'completed'];

  pageEvent(event: PageEvent) {
    this.pageChange.emit({
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
    });
  }

  onCheckboxChange() {
    let newFilter: boolean | null;
    if (this.completedFilter() === true) {
      newFilter = false;
    } else if (this.completedFilter() === false) {
      newFilter = null;
    } else {
      newFilter = true;
    }
    this.filterChange.emit(newFilter);
  }
}
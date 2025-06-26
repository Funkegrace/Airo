import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDataService } from '../../services/form-data.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormDataInterfaceForLocalStorage } from '../../shared/interfaces/form-data.interface';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-result-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, RouterModule ],
  templateUrl: './result-page.component.html',
  styleUrl: './result-page.component.scss'
})
export class ResultPageComponent implements OnInit, AfterViewInit {
  public formData!: FormDataInterfaceForLocalStorage;
  public empty: boolean = true;
  public dataSource = new MatTableDataSource<any>();
  public displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private formDataService: FormDataService
) {}

  ngOnInit(): void {
    this.fetchTableData();
    this.fetchuserData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchTableData() {
    const rawData = this.formDataService.getCSVData();
    if (rawData) {
      const { headers, rows } = JSON.parse(rawData);

      this.displayedColumns = headers;

      const rowObjects = rows.map((row: string[]) =>
        Object.fromEntries(headers.map((h: string, i: number) => [h, row[i] || '']))
      );
      this.dataSource.data = rowObjects;

      this.empty = !(this.displayedColumns.length && this.dataSource.data.length);
    }
  }

  fetchuserData() {
    const userData = this.formDataService.getFormData();
    if(userData) {
      this.formData = JSON.parse(userData);
    }
  }

}

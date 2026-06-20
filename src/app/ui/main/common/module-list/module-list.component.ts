import {ApplicationRef, Component, input, OnInit} from '@angular/core';
import {MainService} from '../../../../services/main.service';
import {ModuleSummary} from '../../../../domain/modulesummary';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ErrorHandlerService} from '../../../../services/error-handler.service';
import {ModuleData} from '../../../../domain/moduledata';
import {MatDialog} from '@angular/material/dialog';
import {ModuleConfigComponent} from './module-config/module-config.component';
import {MatTableModule} from '@angular/material/table';
import {NgClass} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'app-module-list',
    templateUrl: './module-list.component.html',
    styleUrls: ['./module-list.component.scss'],
    imports: [
        MatTableModule,
        NgClass,
        MatIconModule
    ]
})
export class ModuleListComponent implements OnInit {

  readonly assignment = input.required<number>();
  readonly group = input<number>();
  moduleColumns = ['name', 'active', 'outputPortState'];
  showSpinner = false;
  moduleDatabase: ModuleDataBase;
  moduleDataSource: ModuleDataSource;
  rowClicked =false;
  selectedModule: ModuleSummary;

  constructor(public mainService: MainService, private errorHandler: ErrorHandlerService,
              private appRef :ApplicationRef, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.moduleDatabase = new ModuleDataBase(this.mainService, this.assignment(), this.group(), this, this.errorHandler, this.appRef);
    this.moduleDataSource = new ModuleDataSource(this.moduleDatabase);
  }

  rowSelect(row) {
    if (this.rowClicked) {
      return;
    }
    this.rowClicked = true;
    this.selectedModule = row;
    this.mainService.getModuleById(this.selectedModule.moduleId).subscribe(
      res => {
        this.openDialog(res)
      },
      error => {
        this.errorHandler.handle(error, ' Cannot get module details');
        this.rowClicked = false;
      }
    )
  }

  private openDialog(moduleData: ModuleData) {
    const moduleConfDlgRef = this.dialog.open(ModuleConfigComponent, {
      disableClose:true,
      data: moduleData
    });
    moduleConfDlgRef.afterClosed().subscribe(() => {
      this.moduleDatabase.update();
      this.rowClicked = false;
    });
  }
}

export class ModuleDataBase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<ModuleSummary[]> = new BehaviorSubject<ModuleSummary[]>([]);

  constructor(private mainService: MainService,
              private assignment: number,
              private group: number | undefined,
              private parent: ModuleListComponent,
              private errorHandler: ErrorHandlerService,
              private appRef :ApplicationRef) {
    this.update();
  }

  get data(): ModuleSummary[] {
    return this.dataChange.value;
  }

  update() {
    this.parent.showSpinner = true;

    this.mainService.getModuleList(this.assignment, this.group).subscribe(
      response => {
        this.dataChange.next(response);
        this.parent.showSpinner = false;
        this.appRef.tick();
      },
      error => {
        this.parent.showSpinner = false;
        this.errorHandler.handle(error, 'Cannot get module list: ');
      }
    );
  }

}

export class ModuleDataSource extends DataSource<ModuleSummary> {
  constructor(private moduleDataBase: ModuleDataBase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ModuleSummary[]> {
    const displayDataChanges = this.moduleDataBase.dataChange;
    return merge(displayDataChanges).pipe(map(() => {
      return this.moduleDataBase.data.slice();
    }));
  }

  disconnect() {
  }
}

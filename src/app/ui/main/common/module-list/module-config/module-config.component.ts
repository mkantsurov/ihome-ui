import {Component, Inject, OnInit} from '@angular/core';
import {ModuleData} from "../../../../../domain/moduledata";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MainService} from "../../../../../services/main.service";
import {ErrorHandlerService} from "../../../../../services/error-handler.service";
import {ModuleUpdateRequest} from "../../../../../domain/module-update-request";
import {logger} from "codelyzer/util/logger";

@Component({
  selector: 'app-module-config',
  templateUrl: './module-config.component.html',
  styleUrls: ['./module-config.component.scss']
})
export class ModuleConfigComponent implements OnInit {
  moduleConfigForm: FormGroup;
  showSpinner: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ModuleData,
              public moduleConfFormComponentRef: MatDialogRef<ModuleConfigComponent>,
              public mainService: MainService,
              private errorHandler: ErrorHandlerService,
              private fb: FormBuilder,
              ) { }

  ngOnInit(): void {
    this.moduleConfigForm = this.fb.group({
        mode: new FormControl(this.data.mode == 2),
        outputPortState: new FormControl(this.data.outputPortState > 0)
      }
    );
  }

  save() {
    this.mainService.updateModuleConfig(this.data.moduleId, <ModuleUpdateRequest> {
      moduleActive: this.moduleConfigForm.value['mode'],
      outputPortEnabled: this.moduleConfigForm.value['outputPortState']
    }).subscribe(
      res => {
        this.moduleConfFormComponentRef.close(true);
      }, error => {
        this.showSpinner = false;
        let err = JSON.parse(JSON.stringify(error.error));
        this.errorHandler.handle(error, "Cannot update organization. " + err.message);
      }
    );
  }

  cancel() {
    this.moduleConfFormComponentRef.close();
  }

  isChanged() {
    return true;
  }
}

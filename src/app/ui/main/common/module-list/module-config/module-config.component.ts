import {Component, Inject, OnInit} from '@angular/core';
import {ModuleData} from '../../../../../domain/moduledata';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MainService} from '../../../../../services/main.service';
import {ErrorHandlerService} from '../../../../../services/error-handler.service';
import {ModuleUpdateRequest} from '../../../../../domain/module-update-request';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'app-module-config',
  templateUrl: './module-config.component.html',
  styleUrls: ['./module-config.component.scss']
})
export class ModuleConfigComponent implements OnInit {
  moduleConfigForm: FormGroup;
  showSpinner = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ModuleData,
              public moduleConfFormComponentRef: MatDialogRef<ModuleConfigComponent>,
              public mainService: MainService,
              private errorHandler: ErrorHandlerService,
              private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.moduleConfigForm = this.fb.group({
        mode: new FormControl(this.data.mode === 2),
        enabledOnStartup: new FormControl(this.data.startupMode === 1),
        outputPortState: new FormControl(this.data.outputPortState)
      }
    );
  }

  save() {
    this.mainService.updateModuleConfig(this.data.moduleId, {
      enabledOnStartup: this.moduleConfigForm.value.enabledOnStartup,
      moduleActive: this.moduleConfigForm.value.mode,
      outputValue: this.moduleConfigForm.value.outputPortState
    } as ModuleUpdateRequest).subscribe(
      res => {
        this.moduleConfFormComponentRef.close(true);
      }, error => {
        this.showSpinner = false;
        const err = JSON.parse(JSON.stringify(error.error));
        this.errorHandler.handle(error, 'Cannot update module properties. ' + err.message);
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

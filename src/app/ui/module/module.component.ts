import {Component, Input, OnInit} from '@angular/core';
import {ModuleSummary} from "../../domain/modulesummary";
import {ModuleData} from "../../domain/moduledata";
import {SystemService} from "../../services/system.service";

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {

  @Input() category: number;
  moduleSummary: ModuleSummary[];
  selectedModule: ModuleSummary;
  moduleData: ModuleData;

  constructor(public systemService: SystemService) {
  }

  ngOnInit() {
    this.systemService.getModuleList(this.category).subscribe(response => {
      this.moduleSummary = response;
    });
  }

  onSelect(module: ModuleSummary) {
    this.systemService.getModuleData(module.moduleId).subscribe(response => {
      this.selectedModule = module;
      this.selectedModule.outputPortState = response.outputPortState;
      this.selectedModule.active = response.active;
      this.moduleData = response;
    })

  }

  onLogicStatusChange(selectedModule: ModuleSummary) {
    var newMode = 0;
    if (selectedModule.mode == 0 || selectedModule.mode == 1) {
      newMode = 2;
    } else if (selectedModule.mode == 2) {
      newMode = 1;
    }

    this.systemService.updateModuleMode(selectedModule.moduleId, newMode).subscribe(() => {
      this.selectedModule.mode = newMode;
    })
  }

  onEnabledStatusChange(selectedModule: ModuleSummary) {
    var newState;

    if (selectedModule.outputPortState) {
      newState = 0;
    } else {
      newState = 255;
    }

    this.systemService.updateModuleState(selectedModule.moduleId, newState).subscribe(() => {
      this.selectedModule.outputPortState = newState;
    })
  }
}

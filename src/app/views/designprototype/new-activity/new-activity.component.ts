import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Paginator } from '../../interfaces/paginator';
import { SwalService } from '../../services/swal.service';
import { ValidationMessagesService } from '../../services/validation-messages.service';
import { ActivityService } from '../services/activity.service';
import { MeanService } from '../services/mean.service';
import {
  cilBookmark,
  cilInfo,
  cilArrowThickToRight,
  cilSearch,
  cilX,
  cilPlus,
  cilLoopCircular,
  cilMagnifyingGlass,
  cilViewStream,
  cilFolder,
  cilNewspaper,
  cilPencil,
  cilPeople,
  cilTrash,
  cilActionRedo,
  cilCheckCircle,
  cilXCircle,
  cilCheck,
  cilSave,
  cilCloudUpload,
  cilBan,
} from '@coreui/icons';

@Component({
  selector: 'app-activity',
  templateUrl: './new-activity.component.html',
  styleUrls: ['./new-activity.component.scss'],
})
export class NewActivityComponent implements OnInit {
  icons = {
    cilBookmark, cilInfo, cilArrowThickToRight, cilSearch, cilX, cilPlus,
    cilLoopCircular, cilPencil, cilViewStream, cilMagnifyingGlass,

    cilFolder, cilNewspaper, cilPeople, cilTrash, cilActionRedo, cilCheckCircle, cilXCircle, cilCheck,
    cilSave,
    cilCloudUpload,
    cilBan,
  }

  public tokensave: string = '';
  public ideaIdG: string = '';
  public activityIdG: string = '';
  public rolIdG: string = '';

  public selected: boolean = false;
  public respListButton: boolean = true;
  public sizeEvidence: boolean = false;

  // Forms
  public activityForm!: FormGroup;
  public evidenceForm!: FormGroup;
  public responForm!: FormGroup;

  public meanForm!: FormGroup;
  public responFormMean!: FormGroup;
  public evidenceFormMean!: FormGroup;

  // Arrays
  public teamArray: any[] = [];
  public activityArray: any[] = [];
  public meanArray: any[] = [];

  public teamBuildingUsers: any[] = [];
  public teamBuildingUserFilter: any[] = [];
  public arrayL: any[] = [];

  public responArray: any[] = [];
  public responArrayTemp: any[] = [];

  // ControlForms
  public formSubmittedA = false;
  public formSubmittedM = false;

  // Paginator
  public pagMyTeam = new Paginator();
  public pagActi = new Paginator();
  public pagMean = new Paginator();

  public modal!: BsModalRef;
  public modalTwo!: BsModalRef;

  constructor(
    private activityService: ActivityService,
    private meanService: MeanService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private validateService: ValidationMessagesService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('TOKEN') !== null) {
      this.tokensave = localStorage.getItem('TOKEN') ?? '';
    }
    this.buildForms();
    this.getMyTeams();
  }

  buildForms(): void {
    this.activityForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      ideaId: ['', [Validators.required]],
      finishDate: ['', [Validators.required]],
      activityId: [''],
    });

    this.responForm = this.fb.group({
      ideaId: ['', [Validators.required]],
      activityId: ['', [Validators.required]],
      responsible: [[], [Validators.required]],
    });

    this.evidenceForm = this.fb.group({
      ideaId: ['', [Validators.required]],
      activityId: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
    });

    this.meanForm = this.fb.group({
      mean: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      ideaId: ['', [Validators.required]],
      activityId: ['', [Validators.required]],
      meanId: [''],
    });

    this.responFormMean = this.fb.group({
      ideaId: ['', [Validators.required]],
      meanId: ['', [Validators.required]],
      responsible: [[], [Validators.required]],
    });

    this.evidenceFormMean = this.fb.group({
      ideaId: ['', [Validators.required]],
      meanId: ['', [Validators.required]],
      evidence: ['', [Validators.required]],
    });

    this.pagMyTeam.currentPage = 1;
    this.pagMyTeam.sizePage = 5;
    this.pagActi.currentPage = 1;
    this.pagActi.sizePage = 5;
    this.pagMean.currentPage = 1;
    this.pagMean.sizePage = 3;
  }

  getMyTeams(): void {
    this.swalService.searching();
    this.activityService.listStatusTeamsUser(this.tokensave).subscribe(
      (res: any) => {
        this.swalService.close();
        this.teamArray = res.data.data;
        this.teamArray = this.teamArray.filter(
          (m: any) => m.ideaId.phase == 'design/prototyping'
        );
        this.pagMyTeam.totalItems = this.teamArray.length * 10;
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    );
  }

  searchData(id: string, rolUser: string): void {
    this.ideaIdG = id;
    this.swalService.searching();
    this.rolIdG = rolUser;
    this.selected = true;

    this.getActivity(id);

    this.activityService
      .listTeamBuilding(this.tokensave, this.ideaIdG)
      .subscribe(
        (res: any) => {
          this.swalService.close();
          this.teamBuildingUsers = res.data.data;
        },
        (error) => {
          this.swalService.error(error.status);
        }
      );
  }

  openModal(
    template: any,
    type: string,
    data:
      | string
      | {
          _id: string;
          title: string;
          ideaId: string;
          description: string;
          finishDate: string;
          activityId: string;
        }
  ): void {
    this.activityForm?.reset();
    this.formSubmittedA = false;
    if (type === 'create') {
    } else if (type === 'edit' && typeof data != 'string') {
      this.activityForm?.patchValue({
        title: data?.title,
        description: data?.description,
        ideaId: data?.ideaId,
        finishDate: data?.finishDate.split('T')[0],
        activityId: data?._id,
      });
    } else if (type === 'resp') {
      this.responForm?.patchValue({
        ideaId: this.ideaIdG,
        activityId: data,
      });
      this.searchResponsible(data);
    } else if (type === 'mean' && typeof data == 'string') {
      this.getMean(data);
      this.activityIdG = data;
    }
    this.modal = this.modalService.show(template, {
      class: 'modal-dialog-centered',
    });
  }

  openSecondModal(template: any, type: string, data?: any): void {
    this.meanForm?.reset();
    this.formSubmittedM = false;
    if (type === 'create') {
    } else if (type === 'edit') {
      this.meanForm?.patchValue({
        mean: data.mean,
        description: data.description,
        ideaId: data.activityId.ideaId,
        activityId: data.activityId._id,
        meanId: data._id,
      });
    } else if (type === 'resp') {
      this.responFormMean?.patchValue({
        ideaId: this.ideaIdG,
        meanId: data,
      });
      this.searchResponsibleMean(data);
    }
    this.modalTwo = this.modalService.show(template, {
      class: 'modal-dialog-centered',
    });
  }

  openModalEvidence(template: any, idActivity: string): void {
    this.evidenceForm?.reset();
    this.evidenceForm?.patchValue({
      ideaId: this.ideaIdG,
      activityId: idActivity,
    });

    this.getEvidence(idActivity);
    this.modal = this.modalService.show(template, {
      class: 'modal-dialog-centered',
    });
  }

  openSecondModalEvidence(template, meanId): void {
    this.evidenceFormMean?.reset();
    this.evidenceFormMean?.patchValue({
      ideaId: this.ideaIdG,
      meanId: meanId,
    });

    this.getEvidenceMeanActivity(meanId);
    this.modalTwo = this.modalService.show(template, {
      class: 'modal-dialog-centered',
    });
  }

  getActivity(id) {
    this.activityService.getActivity(this.tokensave, id).subscribe(
      (res: any) => {
        this.activityArray = res.data.data;
        this.pagActi.totalItems = this.activityArray.length * 10;
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    );
  }

  getMean(id) {
    this.meanService.getMean(this.tokensave, this.ideaIdG, id).subscribe(
      (res: any) => {
        this.meanArray = res.data.data;
        this.pagMean.totalItems = this.meanArray.length * 10;
      },
      (error) => {
        this.swalService.checkError(error.status);
      }
    );
  }

  getEvidence(id: string): void {
    this.sizeEvidence = false;
    this.activityService
      .getEvidence(this.tokensave, this.ideaIdG, id)
      .subscribe(
        (res: any) => {
          if (res.data.data !== null) {
            this.sizeEvidence = true;
            this.evidenceForm?.patchValue({
              evidence: res.data.data,
            });
          }
        },
        (error) => {
          this.swalService.error(error);
        }
      );
  }

  getEvidenceMeanActivity(id: string): void {
    this.sizeEvidence = false;
    this.meanService.getEvidence(this.tokensave, this.ideaIdG, id).subscribe(
      (res: any) => {
        if (res.data.data !== null) {
          this.sizeEvidence = true;
          this.evidenceFormMean?.patchValue({
            evidence: res.data.data,
          });
        }
      },
      (error) => {
        this.swalService.error(error);
      }
    );
  }

  uploadEvidence(type) {
    if (type === 'activity') {
      if (this.evidenceForm?.valid) {
        this.activityService
          .uploadEvidence(this.tokensave, this.evidenceForm.value)
          .subscribe(
            (res: any) => {
              this.swalService.confirmation(res.data.success);
              this.modal?.hide();
            },
            (error) => {
              this.swalService.error(error.error.data.error);
            }
          );
      } else {
        this.swalService.error('Debe escoger la evidencia');
      }
    } else {
      if (this.evidenceFormMean?.valid) {
        this.meanService
          .createEvidenceMean(this.tokensave, this.evidenceFormMean.value)
          .subscribe(
            (res: any) => {
              this.swalService.confirmation(res.data.success);
              this.modalTwo?.hide();
            },
            (error) => {
              this.swalService.error(error.error.data.error);
            }
          );
      } else {
        this.swalService.error('Debe escoger la evidencia');
      }
    }
  }

  addActivity(): void {
    this.formSubmittedA = true;
    this.activityForm?.get('ideaId')?.setValue(this.ideaIdG);
    this.activityForm?.patchValue({
      title: this.activityForm.value.title.trim(),
      description: this.activityForm.value.description.trim(),
    });
    if (this.activityForm?.valid) {
      delete this.activityForm.value.activityId;
      this.activityService
        .createActivity(this.tokensave, this.activityForm.value)
        .subscribe(
          (res) => {
            this.swalService.confirmation('Actividad creada');
            this.getActivity(this.ideaIdG);
            this.activityForm?.addControl('activityId', this.fb.control(''));
            this.modal?.hide();
          },
          (error) => {
            this.swalService.error(error.error.data.error);
          }
        );
    } else {
      (<HTMLFormElement>document.getElementById('activityForm')).setAttribute(
        'class',
        'was-validated'
      );
    }
  }

  addMean(): void {
    this.formSubmittedM = true;
    this.meanForm?.get('activityId')?.setValue(this.activityIdG);
    this.meanForm?.get('ideaId')?.setValue(this.ideaIdG);
    this.meanForm?.patchValue({
      mean: this.meanForm.value.mean.trim(),
      description: this.meanForm.value.description.trim(),
    });
    if (this.meanForm?.valid) {
      delete this.meanForm.value.meanId;
      this.meanService
        .createMean(this.tokensave, this.meanForm.value)
        .subscribe(
          (res) => {
            this.swalService.confirmation('Recurso creado');
            this.getMean(this.activityIdG);
            this.meanForm?.addControl('meanId', this.fb.control(''));
            this.modalTwo?.hide();
          },
          (error) => {
            this.swalService.error(error.error.data.error);
          }
        );
    } else {
      (<HTMLFormElement>document.getElementById('meanForm')).setAttribute(
        'class',
        'was-validated'
      );
    }
  }

  updateActivity(): void {
    this.formSubmittedA = true;
    this.activityForm?.patchValue({
      title: this.activityForm.value.title.trim(),
      description: this.activityForm.value.description.trim(),
    });
    if (this.activityForm?.valid) {
      this.activityService
        .updateActivity(this.tokensave, this.activityForm.value)
        .subscribe(
          (res) => {
            this.swalService.confirmation('Actividad actualizada');
            this.getActivity(this.ideaIdG);
            this.modal?.hide();
          },
          (error) => {
            this.swalService.error(error.error.data.error);
          }
        );
    } else {
      (<HTMLFormElement>(
        document.getElementById('editActivityForm')
      )).setAttribute('class', 'was-validated');
    }
  }

  changeStateMean(idMean): void {
    Swal.fire({
      title: '¿Quiere eliminar el recurso?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: '#3e8457',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const object = {
          ideaId: this.ideaIdG,
          activityId: this.activityIdG,
          meanId: idMean,
        };
        this.meanService.changeStateMean(this.tokensave, object).subscribe(
          (res) => {
            this.swalService.confirmation('Recurso eliminado');
            this.getMean(this.activityIdG);
          },
          (error) => {
            this.swalService.error(error.error.data.error);
          }
        );
      }
    });
  }

  changeStateActivity(idActivity): void {
    Swal.fire({
      title: '¿Quiere eliminar la actividad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: '#3e8457',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const object = {
          ideaId: this.ideaIdG,
          activityId: idActivity,
        };
        this.activityService
          .changeStatusActivity(this.tokensave, object)
          .subscribe(
            (res: any) => {
              this.swalService.confirmation('Actividad eliminada');
              this.getActivity(this.ideaIdG);
            },
            (error) => {
              this.swalService.error(error.error.data.error);
            }
          );
      }
    });
  }

  endActivity(idActivity): void {
    Swal.fire({
      title: '¿Quiere finalizar la actividad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: '#3e8457',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const object = {
          ideaId: this.ideaIdG,
          activityId: idActivity,
        };
        this.activityService.endActivity(this.tokensave, object).subscribe(
          (res: any) => {
            this.swalService.confirmation('Actividad Finalizada');
            this.getActivity(this.ideaIdG);
          },
          (error) => {
            this.swalService.error(error.error.data.error);
          }
        );
      }
    });
  }

  searchResponsible(activityId): void {
    this.respListButton = false;

    this.activityService
      .getResponsibles(this.tokensave, this.ideaIdG, activityId)
      .subscribe(
        (res: any) => {
          this.responArray = res.data.data;
          this.arrayL = this.teamBuildingUsers;
          this.teamBuildingUserFilter = [];

          if (this.rolIdG == 'administrator') {
            if (this.responArray.length === 0) {
              this.respListButton = true;
              this.teamBuildingUserFilter = this.teamBuildingUsers;
              (<HTMLInputElement>(
                document.getElementById('buttonResp')
              )).checked = true;
            } else {
              this.respListButton = false;
              this.filter(0);
            }
          }
          this.responArrayTemp = [];
        },
        (error) => {
          this.swalService.error(error.status);
        }
      );
  }

  searchResponsibleMean(meanId): void {
    this.respListButton = false;

    this.meanService
      .getResponsabilityMean(this.tokensave, this.ideaIdG, meanId)
      .subscribe(
        (res: any) => {
          this.responArray = res.data.data;
          this.arrayL = this.teamBuildingUsers;
          this.teamBuildingUserFilter = [];

          if (this.rolIdG == 'administrator') {
            if (this.responArray.length === 0) {
              this.respListButton = true;
              this.teamBuildingUserFilter = this.teamBuildingUsers;
              (<HTMLInputElement>(
                document.getElementById('buttonResp')
              )).checked = true;
            } else {
              this.respListButton = false;
              this.filter(0);
            }
          }
          this.responArrayTemp = [];
        },
        (error) => {
          this.swalService.error(error.status);
        }
      );
  }

  saveRespon(type) {
    if (type === 'activity') {
      this.responForm?.get('responsible')?.setValue(this.responArrayTemp);
      if (this.responForm?.valid) {
        this.activityService
          .assignResponsibility(this.tokensave, this.responForm.value)
          .subscribe(
            (res: any) => {
              this.swalService.confirmation(
                'Responsables asignados correctamente'
              );
              this.modal?.hide();
            },
            (error) => {
              this.swalService.error(error.error.data.error);
            }
          );
      }
    } else {
      this.responFormMean?.get('responsible')?.setValue(this.responArrayTemp);
      if (this.responFormMean?.valid) {
        this.meanService
          .assignMean(this.tokensave, this.responFormMean.value)
          .subscribe(
            (res: any) => {
              this.swalService.confirmation(
                'Responsables asignados correctamente'
              );
              this.modalTwo?.hide();
            },
            (error) => {
              this.swalService.error(error.error.data.error);
            }
          );
      }
    }
  }

  removeRespon(type) {
    if (type === 'activity') {
      this.responForm?.get('responsible')?.setValue(this.responArrayTemp);
      if (this.responForm?.valid) {
        this.activityService
          .removeResponsibility(this.tokensave, this.responForm.value)
          .subscribe(
            (res: any) => {
              this.swalService.confirmation('Responsables editados');
              this.modal?.hide();
            },
            (error) => {
              this.swalService.error(error.error.data.error);
            }
          );
      }
    } else {
      this.responFormMean?.get('responsible')?.setValue(this.responArrayTemp);
      if (this.responFormMean?.valid) {
        this.meanService
          .removeResponsabilityMean(this.tokensave, this.responFormMean.value)
          .subscribe(
            (res: any) => {
              this.swalService.confirmation('Responsables editados');
              this.modalTwo?.hide();
            },
            (error) => {
              this.swalService.error(error.error.data.error);
            }
          );
      }
    }
  }

  changePhase(idIdea): void {
    Swal.fire({
      title: '¿Quiere realizar el cambio de fase?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      confirmButtonColor: '#3e8457',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.activityService
          .changePhaseMarketing(this.tokensave, idIdea)
          .subscribe(
            (res: any) => {
              this.swalService.confirmation('La idea ha cambiado de fase');
              this.getMyTeams();
              this.selected = false;
            },
            (error) => {
              this.swalService.error(error.error.data.error);
            }
          );
      }
    });
  }

  controlArray(userResp, check) {
    if (check.target.checked) {
      this.responArrayTemp.push(userResp);
    } else {
      this.responArrayTemp = this.responArrayTemp.filter(
        (data) => data != userResp
      );
    }
  }

  controlList(check) {
    this.responArrayTemp = [];
    this.teamBuildingUserFilter = [];
    if (check.target.checked) {
      this.teamBuildingUserFilter = this.teamBuildingUsers;
      if (this.responArray.length !== 0) {
        this.filter(1);
      }
      this.respListButton = true;
    } else {
      if (this.responArray.length === 0) {
        this.teamBuildingUserFilter = [];
      } else {
        this.filter(0);
      }
      this.respListButton = false;
    }
  }

  filter(type) {
    if (type === 0) {
      this.responArray.forEach((data) => {
        this.arrayL.forEach((datos, index) => {
          if (data.userId._id === datos.userId._id) {
            this.teamBuildingUserFilter.push(this.arrayL[index]);
          }
        });
      });
    } else {
      this.responArray.forEach((data) => {
        this.teamBuildingUserFilter.forEach((datos) => {
          if (data.userId._id === datos.userId._id) {
            this.teamBuildingUserFilter = this.teamBuildingUserFilter.filter(
              (dato) => data.userId._id !== dato.userId._id
            );
          }
        });
      });
    }
  }

  onFileSelect(event, type) {
    if (type === 'activity') {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        let data = file.name.split('.');
        if (
          data[data.length - 1].toLowerCase() === 'png' ||
          data[data.length - 1].toLowerCase() === 'pdf' ||
          data[data.length - 1].toLowerCase() === 'jpg'
        ) {
          this.evidenceForm?.get('evidence')?.setValue(file);
        } else {
          this.swalService.error('Solo se permiten archivos: pdf o imagen');
        }
      } else {
        this.evidenceForm?.patchValue({
          evidence: null,
        });
        this.sizeEvidence = false;
      }
    } else {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        let data = file.name.split('.');
        if (
          data[data.length - 1].toLowerCase() === 'png' ||
          data[data.length - 1].toLowerCase() === 'pdf' ||
          data[data.length - 1].toLowerCase() === 'jpg'
        ) {
          this.evidenceFormMean?.get('evidence')?.setValue(file);
        } else {
          this.swalService.error('Solo se permiten archivos: pdf o imagen');
        }
      } else {
        this.evidenceFormMean?.patchValue({
          evidence: null,
        });
        this.sizeEvidence = false;
      }
    }
  }

  // *Sección de validaciones*
  getErrorMessage(field: string, type: string): string {
    if (type == 'activity') {
      return this.validateService.getErrorMessage(field, this.activityForm);
    }
    return this.validateService.getErrorMessage(field, this.meanForm);
  }

  // Validador de campos
  invalidField(field: string, type: string): boolean {
    if (type == 'activity') {
      return this.validateService.invalidField(
        field,
        this.activityForm,
        this.formSubmittedA
      );
    }
    return this.validateService.invalidField(
      field,
      this.meanForm,
      this.formSubmittedM
    );
  }
}
